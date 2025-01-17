
// backport for Object.groupBy (not available in react native)
export function groupBy<T, K extends keyof any>(arr: T[], callback: (item: T, index: number, all: T[]) => K): Partial<Record<K, T[]>> {
    return arr.reduce<Partial<Record<K, T[]>>>((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= [];
        acc[key].push(args[0]);
        return acc;
    }, {});
};