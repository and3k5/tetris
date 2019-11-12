export function executeTick(game, runEvent) {
    var brick = game.getMovingBrick();
    if (brick != null)
        brick.movedown();
    runEvent("tick");
}
export function gameControlDown(game, runEvent) {
    const func = () => {
        if (game.setup.clickTick !== true)
            executeTick(game, runEvent);
        setTimeout(func, game.movingSpeed);
    };
    func();
}