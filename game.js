// Initialize Kaboom.js
kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
});

// Constants
const MOVE_SPEED = 150;
const JUMP_FORCE = 400;

// Load assets
loadSprite("player", "https://i.imgur.com/Wb1qfhK.png");
loadSprite("block", "https://i.imgur.com/pogC9x5.png");
loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");

// Main game scene
scene("game", () => {
    // Layers
    layers(["bg", "obj", "ui"], "obj");

    // Level layout
    const level = [
        "                         ",
        "                         ",
        "       @                 ",
        "    =====                ",
        "                         ",
        "            =====        ",
        "         =====           ",
        "=========================",
    ];

    const levelConfig = {
        width: 20,
        height: 20,
        "=": [sprite("block"), solid()],
        "@": [sprite("coin"), "coin"],
    };

    const gameLevel = addLevel(level, levelConfig);

    // Player
    const player = add([
        sprite("player"),
        pos(20, 0),
        body(),
        origin("bot"),
    ]);

    let score = 0;
    const scoreLabel = add([
        text("Score: 0"),
        pos(10, 10),
        layer("ui"),
        {
            value: score,
        },
    ]);

    // Player controls
    keyDown("left", () => {
        player.move(-MOVE_SPEED, 0);
    });

    keyDown("right", () => {
        player.move(MOVE_SPEED, 0);
    });

    keyPress("space", () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    // Coin collection
    player.collides("coin", (coin) => {
        destroy(coin);
        scoreLabel.value++;
        scoreLabel.text = `Score: ${scoreLabel.value}`;
    });

    // Fall out of screen
    player.action(() => {
        if (player.pos.y > height()) {
            go("lose", { score: scoreLabel.value });
        }
    });
});

// Lose scene
scene("lose", ({ score }) => {
    add([
        text(`Game Over!\nScore: ${score}`, 24),
        origin("center"),
        pos(width() / 2, height() / 2),
    ]);
});

// Start the game
start("game");
