type Constructor<T extends object = object> = new (...args: any[]) => T;
type Prototype<T extends object = object> = { prototype: T };
export type ClassDef<T extends object = object> = Constructor<T> & Prototype<T>;
