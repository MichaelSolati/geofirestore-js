import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoQuerySnapshot } from './GeoQuerySnapshot';
import { validateQueryCriteria, calculateDistance } from './utils';

interface DocMap { change: GeoFirestoreTypes.web.DocumentChange; distance: number; emitted: boolean; }

/**
 * A `GeoJoinerOnSnapshot` subscribes and aggregates multiple `onSnapshot` listeners
 * while filtering out documents not in query radius.
 */
export class GeoJoinerOnSnapshot {
  private _docs: Map<string, DocMap> = new Map();
  private _error: Error;
  private _firstRoundResolved = false;
  private _firstEmitted = false;
  private _interval: any;
  private _newValues = false;
  private _subscriptions: Array<() => void> = [];
  private _queriesResolved: number[] = [];

  /**
   * @param _queries An array of Firestore Queries to aggregate.
   * @param _queryCriteria The query criteria of geo based queries, includes field such as center, radius, and limit.
   * @param _onNext A callback to be called every time a new `QuerySnapshot` is available.
   * @param _onError A callback to be called if the listen fails or is cancelled. No further callbacks will occur.
   */
  constructor(
    private _queries: GeoFirestoreTypes.web.Query[], private _queryCriteria: GeoFirestoreTypes.QueryCriteria,
    private _onNext: (snapshot: GeoQuerySnapshot) => void, private _onError?: (error: Error) => void
  ) {
    validateQueryCriteria(_queryCriteria);
    this._queriesResolved = new Array(_queries.length).fill(0);
    _queries.forEach((value: GeoFirestoreTypes.web.Query, index: number) => {
      const subscription = value.onSnapshot(snapshot => this._processSnapshot(snapshot, index), error => (this._error = error));
      this._subscriptions.push(subscription);
    });

    this._interval = setInterval(() => this._emit(), 100);
  }

  /**
   * A functions that clears the interval and ends all query subscriptions.
   *
   * @return An unsubscribe function that can be called to cancel all snapshot listener.
   */
  unsubscribe(): () => void {
    return () => {
      clearInterval(this._interval);
      this._subscriptions.forEach(subscription => subscription());
    };
  }

  /**
   * Runs through documents stored in map to set value to send in `next` function.
   */
  private _next(): void {
    // Sort docs based on distance if there is a limit so we can then limit it
    if (this._queryCriteria.limit && this._docs.size > this._queryCriteria.limit) {
      const arrayToLimit = Array.from(this._docs.values()).sort((a, b) => a.distance - b.distance);
      // Iterate over documents outside of limit
      for (let i = this._queryCriteria.limit; i < arrayToLimit.length; i++) {
        if (arrayToLimit[i].emitted) { // Mark as removed if outside of query and previously emitted
          const result = { change: { ...arrayToLimit[i].change }, distance: arrayToLimit[i].distance, emitted: arrayToLimit[i].emitted };
          result.change.type = 'removed';
          this._docs.set(result.change.doc.id, result);
        } else { // Remove if not previously in query
          this._docs.delete(arrayToLimit[i].change.doc.id);
        }
      }
    }

    let deductIndexBy = 0;
    const docChanges = Array.from(this._docs.values()).map((value: DocMap, index: number) => {
        const result: GeoFirestoreTypes.web.DocumentChange = {
          type: value.change.type,
          doc: value.change.doc,
          oldIndex: value.emitted ? value.change.newIndex : -1,
          newIndex: (value.change.type !== 'removed') ? (index - deductIndexBy) : -1
        };
        if (result.type === 'removed') {
          deductIndexBy--;
          this._docs.delete(result.doc.id);
        } else {
          this._docs.set(result.doc.id, { change: result, distance: value.distance, emitted: true });
        }
        return result;
      });

    const docs = docChanges.reduce((filtered, change) => {
      if (change.newIndex >= 0) {
        filtered.push(change.doc);
      } else {
        this._docs.delete(change.doc.id);
      }
      return filtered;
    }, []);

    this._firstEmitted = true;
    this._onNext(new GeoQuerySnapshot({
          docs,
          docChanges: () => docChanges.reduce((reduced, change) => {
            if (change.oldIndex === -1 || change.type !== 'added') {
              reduced.push(change);
            }
            return reduced;
          }, [])
    } as GeoFirestoreTypes.web.QuerySnapshot, this._queryCriteria.center));
  }

  /**
   * Determines if new values should be emitted via `next` or if subscription should be killed with `error`.
   */
  private _emit(): void {
    if (this._error) {
      if (this._onError) this._onError(this._error);
      this.unsubscribe()();
    } else if (this._newValues && this._firstRoundResolved) {
      this._newValues = false;
      this._next();
    } else if (!this._firstRoundResolved) {
      this._firstRoundResolved = this._queriesResolved.reduce((a, b) => a + b, 0) === this._queries.length;
    }
  }

  /**
   * Parses `snapshot` and filters out documents not in query radius. Sets new values to `_docs` map.
   *
   * @param snapshot The `QuerySnapshot` of the query.
   * @param index Index of query who's snapshot has been triggered.
   */
  private _processSnapshot(snapshot: GeoFirestoreTypes.web.QuerySnapshot, index: number): void {
    const docChanges = Array.isArray(snapshot.docChanges) ?
      snapshot.docChanges as any as GeoFirestoreTypes.web.DocumentChange[]: snapshot.docChanges();
    if (!this._firstRoundResolved) this._queriesResolved[index] = 1;
    if (docChanges.length) { // Snapshot has data, key during first snapshot
      docChanges.forEach((change) => {
        const distance = change.doc.data().l ? calculateDistance(this._queryCriteria.center, change.doc.data().l) : null;
        const id = change.doc.id;
        const fromMap = this._docs.get(id);
        const doc: any = {
          change: {
            doc: change.doc,
            oldIndex: (fromMap && this._firstEmitted) ? fromMap.change.oldIndex : -1,
            newIndex: (fromMap && this._firstEmitted) ? fromMap.change.newIndex : -1,
            type: (fromMap && this._firstEmitted) ? change.type : 'added'
          }, distance, emitted: this._firstEmitted ? !!fromMap : false
        };

        if (this._queryCriteria.radius >= distance) { // Ensure doc in query radius
          // Ignore doc since it wasn't in map and was already 'removed'
          if (!fromMap && doc.change.type === 'removed') return;
          // Mark doc as 'added' doc since it wasn't in map and was 'modified' to be
          if (!fromMap && doc.change.type === 'modified') doc.change.type = 'added';
          this._newValues = true;
          this._docs.set(id, doc);
        } else if (fromMap) { // Document isn't in query, but is in map
          doc.change.type = 'removed'; // Not in query anymore, mark for removal
          this._newValues = true;
          this._docs.set(id, doc);
        } else if (!fromMap && !this._firstRoundResolved) { // Document isn't in map and the first round hasn't resolved
          // This is an empty query, but it has resolved
          this._newValues = true;
        }
      });
    } else if (!this._firstRoundResolved) { // Snapshot doesn't have data, key during first snapshot
      this._newValues = true;
    }
  }
}