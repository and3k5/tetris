export function executeTick(game, runEvent) {
    game.getMovingBrick().movedown();
    runEvent("tick");
}
export function gameControlDown(game, g, runEvent) {
    if (game.setup.clickTick === true) {
        g.addEventListener("click", function () {
            executeTick(game, runEvent);
        });
    } else {
        let GAMECONTROLDOWN = false;
        if (GAMECONTROLDOWN == false) {
            const func = () => {
                GAMECONTROLDOWN = true;
                executeTick(game, runEvent);
                setTimeout(func, game.movingSpeed);
            };
            func();
        }
    }
}