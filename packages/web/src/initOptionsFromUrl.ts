import { Options } from "@tetris/core/game/init";

export function initOptionsFromUrl(url: URL, options : Options) {
    if (url.searchParams.get("setup") != null) options.setup = url.searchParams.get("setup");

    if (url.searchParams.get("next") != null) options.next = url.searchParams.get("next");

    if (url.searchParams.get("simulate") != null)
        options.simulate =
            url.searchParams.get("simulate") === "1" ? true : url.searchParams.get("simulate");

    if (url.searchParams.get("clickTick") != null)
        options.clickTick = url.searchParams.get("clickTick") === "1";

    if (url.searchParams.get("logger") != null) options.logger = url.searchParams.get("logger");

    if (url.searchParams.get("view") != null) options.view = url.searchParams.get("view");

    if (url.searchParams.get("debug") != null) options.debug = url.searchParams.get("debug");
}
