/*global describe, expect, it*/
import { SoundController } from "./sound-controller";

describe("sound controller", function () {
    it("can init, load and play sounds", function () {
        var soundController = new SoundController();
        soundController.init();

        expect(soundController.activated).toBe(true);
        expect(soundController.ready).toBe(true);
        expect(soundController.failed).toBe(false);

        var allSoundKeys = soundController.allSoundKeys;

        console.debug(allSoundKeys);

        expect(allSoundKeys).not.toBeNull();

        expect(allSoundKeys.length).toBeGreaterThan(0);

        for (var soundKey of allSoundKeys) {
            const result = soundController.playSound(soundKey, { throwErrors: true });
            expect(result).toBe(true);
        }

    });
});