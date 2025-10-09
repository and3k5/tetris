type Selector<TItem> = (item: TItem) => number;
interface Sorter<TItem> {
    sorters: unknown[];
    thenBy(selector: Selector<TItem>, descending?: boolean);
    compare(a: TItem, b: TItem): number;
    execute(array: TItem[]);
}
export function sortBy<TItem>(selector: Selector<TItem>, descending = false): Sorter<TItem> {
    const exec = function (selector: Selector<TItem>, descending) {
        return (a, b) => selector(descending ? b : a) - selector(descending ? a : b);
    };
    return {
        sorters: [exec(selector, descending)],
        thenBy: function (selector2, descending2 = false) {
            this.sorters.push(exec(selector2, descending2));
            return this;
        },
        compare: function (a, b) {
            for (const sorter of this.sorters) {
                const diff = sorter(a, b);
                if (diff !== 0) return diff;
            }
            return 0;
        },
        execute(array) {
            return array.concat().sort((a, b) => this.sorter.compare(a, b));
        },
    };
}
