import { Timestamp } from "firebase/firestore";

export interface IEntry {
    content: string,
    createdAt?: Timestamp | null,
    updatedAt?: Timestamp | null,    
}

export interface IPerson {
    name: string,
    createdAt?: Timestamp | null,
    updatedAt?: Timestamp | null,
    entries: Array<IEntry>,
  }