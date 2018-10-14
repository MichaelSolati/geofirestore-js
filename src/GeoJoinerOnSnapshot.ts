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
   * @param _near The center and radius of geo based queries.
   * @param _onNext A callback to be called every time a new `QuerySnapshot` is available.
   * @param _onError A callback to be called if the listen fails or is cancelled. No further callbacks will occur.
   */
  constructor(
    private _queries: GeoFirestoreTypes.web.Query[], private _near: GeoFirestoreTypes.QueryCriteria,
    private _onNext: (snapshot: GeoQuerySnapshot) => void, private _onError?: (error: Error) => void
  ) {
    validateQueryCriteria(_near);

    this._queriesResolved = (new Array(_queries.length)).fill(0);

    _queries.forEach((value: GeoFirestoreTypes.web.Query, index: number) => {
      const subscription = value.onSnapshot((snapshot) => this._processSnapshot(snapshot, index), (error) => this._error = error);
      this._subscriptions.push(subscription);
    });

    this._interval = setInterval(() => this._emit(), 1000);
  }

  /**
   * A functions that clears the interval and ends all query subscriptions.
   * 
   * @return An unsubscribe function that can be called to cancel all snapshot listener.
   */
  public unsubscribe(): () => void {
    return () => {
      clearInterval(this._interval);
      this._subscriptions.forEach(subscription => subscription());
    };
  }

  /**
   * Runs through documents stored in map to set value to send in `next` function.
   */
  private _next(): void {
    const docChanges = Array.from(this._docs.values())
      .map((value: DocMap, index: number) => {
        const result: GeoFirestoreTypes.web.DocumentChange = {
          type: value.change.type,
          doc: value.change.doc,
          oldIndex: value.emitted ? index : -1,
          newIndex: (value.change.type !== 'removed') ? index : -1
        };
        if (result.type === 'removed') {
          this._docs.delete(result.doc.id);
        } else {
          this._docs.set(result.doc.id, { change: result, distance: value.distance, emitted: true });
        }
        return result;
      });

    const docs = docChanges.map((change) => change.doc);
    this._firstEmitted = true;
    this._onNext(new GeoQuerySnapshot({
      docs,
      docChanges: () => docChanges
    } as GeoFirestoreTypes.web.QuerySnapshot, this._near.center));
  }

  /**
   * Determines if new values should be emitted via `next` or if subscription should be killed with `error`.
   */
  private _emit(): void {
    if (this._error) {
      if (this._onError) this._onError(this._error);
      this.unsubscribe();
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
    if (!this._firstRoundResolved) this._queriesResolved[index] = 1;
    snapshot.docChanges().forEach((change) => {
      const distance = calculateDistance(this._near.center, change.doc.data().l);
      const id = change.doc.id;
      const fromMap = this._docs.get(id);
      const doc: any = {
        change: {
          doc: change.doc,
          oldIndex: fromMap && this._firstEmitted ? fromMap.change.oldIndex : -1,
          newIndex: fromMap && this._firstEmitted ? fromMap.change.newIndex : -1,
          type: fromMap && this._firstEmitted ? change.type : 'added'
        }, distance, emitted: this._firstEmitted ? !!fromMap : false
      };
      // Ensure doc in query radius
      if (this._near.radius >= distance) {
        if (!fromMap && doc.change.type === 'removed') return; // Removed doc and wasn't in map
        if (!fromMap && doc.change.type === 'modified') doc.change.type = 'added'; // Modified doc and wasn't in map
        this._newValues = true;
        this._docs.set(id, doc);
      } else if (fromMap) {
        doc.change.type = 'removed'; // Not in query anymore, mark for removal 
        this._newValues = true;
        this._docs.set(id, doc);
      }
    });
  }
}