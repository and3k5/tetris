export function executeTick(game, runEvent) {
    var brick = game.getMovingBrick();
    brick.movedown();
    runEvent("tick");
}
export function gameControlDown(game, g, runEvent) {
    g.addEventListener("click", function () {
        if (game.setup.clickTick === true)
            executeTick(game, runEvent);
    });

    const func = () => {
        if (game.setup.clickTick !== true)
            executeTick(game, runEvent);
        setTimeout(func, game.movingSpeed);
    };
    func();
}