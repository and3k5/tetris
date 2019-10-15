export function gameControlDown(game) {
    let GAMECONTROLDOWN = false;
    if (GAMECONTROLDOWN == false) {
        const func = () => {
            GAMECONTROLDOWN = true;
            game.getMovingBrick().movedown();
            setTimeout(func, game.movingSpeed);
        };
        func();
    }
}