export function sortBy(selector, descending = false) {
    const exec = function (selector, descending) {
        return (a, b) => selector(descending ? b : a) - selector(descending ? a : b);
    };
    return {
        sorters: [exec(selector, descending)],
        thenBy: function (selector2, descending2) {
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
            const sorter = this;
            return array.concat().sort((a, b) => sorter.compare(a, b));
        },
    };
}
