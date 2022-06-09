/**
 * Filter array by key values
 * @param array Array
 * @param selector Key selector
 * @param keys Keys to remove
 * @returns Filtered array
 */
export function removeByKey<TItem, TValue>(
    array: Array<TItem>,
    selector: (item: TItem) => TValue,
    keys: Array<TValue>
): Array<TItem> {
    return array.filter(item => {
        const value = selector(item);

        return !keys.includes(value);
    });
}
