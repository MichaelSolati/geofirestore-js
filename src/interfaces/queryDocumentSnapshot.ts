import { DocumentData } from './documentData';

export interface GeoQueryDocumentSnapshot {
    exists: boolean;
    id: string;
    data: DocumentData | any;
    distance: number;
}