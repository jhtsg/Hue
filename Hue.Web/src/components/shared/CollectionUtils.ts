export function addToCollection<T>(collection: T[], item: T): T[] {
    return [...collection, item]
}

export function updateInCollection<T>(collection: T[], index: number, item: T): T[] {
    return [...collection.map((a, i) => i === index ? item : a)]
}

export function deleteFromCollection<T>(collection: T[], index: number): T[] {
    return [...collection.map((a, i) => i === index ? undefined : a).filter(a => a !== undefined)]
}
