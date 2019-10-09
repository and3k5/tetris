export default {
    mq(query) {
        return window.matchMedia(query).matches;
    },
    isTouch() {
        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }

        return this.mq(['(', this.prefixes().join('touch-enabled),('), 'heartz', ')'].join(''));
    },
    prefixes() {
        return ["webkit", "moz", "o", "ms"].map(p => "-" + p + "-");
    }
}