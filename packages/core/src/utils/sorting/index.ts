export function sortBy(selector, descending = false) {
    const exec = function (selector, descending) {
        return (a, b) => selector(descending ? b : a) - selector(descending ? a : b);
    }
    return {
        sorters: [exec(selector, descending)],
        thenBy: function (selector2, descending2) {
            this.sorters.push(exec(selector2, descending2));
            return this;
        },
        compare: function (a, b) {
            for (var sorter of this.sorters) {
                var diff = sorter(a, b);
                if (diff !== 0)
                    return diff;
            }
            return 0;
        },
        execute(array) {
            var sorter = this;
            return array.concat().sort((a, b) => sorter.compare(a, b));
        }
    }
}