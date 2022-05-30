export interface IEntry {
    content: string,
    createdAt?: Date | null,
    updatedAt?: Date | null,    
}

export interface IPerson {
    name: string,
    createdAt?: Date | null,
    updatedAt?: Date | null,
    entries: Array<IEntry>,
  }