export type ReadyCallback = () => void;
export type ErrorCallback = (err: Error) => void;
export type KeyCallback = (key?: string, document?: any, distanceFromCenter?: number) => void;

export interface GeoQueryCallbacks {
  ready: ReadyCallback[];
  error: ErrorCallback[];
  key_entered: KeyCallback[];
  key_exited: KeyCallback[];
  key_moved: KeyCallback[];
  key_modified: KeyCallback[];
}