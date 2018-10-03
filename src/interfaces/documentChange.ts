import { DocumentData } from './documentData';

export interface GeoDocumentChange {
    doc: DocumentData;
    newIndex: number;
    oldIndex: number;
    type: any;
}