export function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function RemoveIndex<T>(arr: T[], i: number) {
    const l = [] as T[]
    arr.forEach((a, ai) => {
        if (ai !== i) { l.push(a) }
    })

    return l;
}

export const dateFromBackend = (val: string): string => new Date(val).toISOString().split('T')[0]
export const dateToBackend = (val?: string): string | undefined => val && val.length > 0 ? new Date(val).toISOString().replace("Z", "") : undefined;