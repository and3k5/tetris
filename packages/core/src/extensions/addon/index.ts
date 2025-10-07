export const INIT_TYPES = {
    AFTER_INIT: "after-init",
};
export class AddonContainer {
    private _addons = [];
    private _typesLoaded = [];
    constructor() {}
    add(object, callback, initType) {
        let addon;
        switch (initType) {
            case INIT_TYPES.AFTER_INIT:
                addon = {
                    initType,
                    object,
                    callback,
                    loaded: false,
                };
                break;
            default:
                throw new Error("Unknown INIT_TYPE: " + initType);
        }
        this._addons.push(addon);
        if (this.typeIsAlreadyLoaded(initType)) {
            this.loadAddon(addon);
        }
    }

    typeIsAlreadyLoaded(type) {
        return this._typesLoaded.indexOf(type) !== -1;
    }

    loadByType(type) {
        if (this.typeIsAlreadyLoaded(type))
            throw new Error("Type " + type + " has already been loaded");
        this._typesLoaded.push(type);
        for (var addon of this._addons) {
            if (addon.initType !== type) continue;
            if (addon.loaded !== false) continue;

            this.loadAddon(addon);
        }
    }

    loadAddon(addon) {
        if (addon.loaded !== false) throw new Error("Addon is already loaded");

        addon.loaded = true;
        addon.callback(addon.object);
    }
}
