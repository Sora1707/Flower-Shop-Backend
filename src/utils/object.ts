import e from "express";

export function shallowCopy<T>(obj: T): T {
    return { ...obj };
}

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
