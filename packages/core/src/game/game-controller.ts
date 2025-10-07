export function executeTick(game) {
    const brick = game.getMovingBrick();
    if (brick != null)
        brick.movedown();
    game.runEvent("tick", null);
}
export function gameControlDown(game) {
    const func = () => {
        if (game.setup.clickTick !== true)
            executeTick(game);
        setTimeout(func, game.movingSpeed);
    };
    func();
}