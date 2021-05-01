export const { Phaser } = globalThis;

export const BLOCK_SIZE = 32;
export const BLOCKS_X = 25;
export const BLOCKS_Y = 16;

export const SCENE_WIDTH = 800;
export const SCENE_HEIGHT = 512;

export const STATIC = 1;
export const DYNAMIC = 0;

export const SCORE_TICK = 0.2;
export const SCORE_START = 500;
export const SCORE_COIN = 200;
export const SCORE_FIRST = 100;

export const PLAYER_STATUS = {
    Alive: "Alive",
    Dead: "Dead",
};

export const PRERUN_COUNTDOWN = 5;
export const RESULTS_COUNTDOWN = 1;

export const PHASES = {
    Initial: "Intial",
    PreRun: "PreRun",
    Run: "Run",
    Results: "Results",
};

export const PHASE_TEXTS = {
    Initial: "Intial Setup",
    PreRun: "Countdown",
    Run: "Run!",
    Results: "Results",
};

export const LEVELS = {
    0: {
        id: 0,
        name: "The first Level",
        preview: "./assets/preview/level_0.png",
    },
    1: {
        id: 1,
        name: "The second Level",
        preview: "./assets/preview/level_1.png",
    },
};

export const PLAYER_SKINS = {
    bear: { id: "bear", name: "Bear" },
    buffalo: { id: "buffalo", name: "Buffalo" },
    chick: { id: "chick", name: "Chick" },
    chicken: { id: "chicken", name: "Chicken" },
    cow: { id: "cow", name: "Cow" },
    crocodile: { id: "crocodile", name: "Crocodile" },
    dog: { id: "dog", name: "Dog" },
    duck: { id: "duck", name: "Duck" },
    elephant: { id: "elephant", name: "Elephant" },
    frog: { id: "frog", name: "Frog" },
    giraffe: { id: "giraffe", name: "Giraffe" },
    goat: { id: "goat", name: "Goat" },
    gorilla: { id: "gorilla", name: "Gorilla" },
    hippo: { id: "hippo", name: "Hippo" },
    horse: { id: "horse", name: "Horse" },
    monkey: { id: "monkey", name: "Monkey" },
    moose: { id: "moose", name: "Moose" },
    narwhal: { id: "narwhal", name: "Narwhal" },
    owl: { id: "owl", name: "Owl" },
    panda: { id: "panda", name: "Panda" },
    parrot: { id: "parrot", name: "Parrot" },
    penguin: { id: "penguin", name: "Penguin" },
    pig: { id: "pig", name: "Pig" },
    rabbit: { id: "rabbit", name: "Rabbit" },
    rhino: { id: "rhino", name: "Rhino" },
    sloth: { id: "sloth", name: "Sloth" },
    snake: { id: "snake", name: "Snake" },
    walrus: { id: "walrus", name: "Walrus" },
    whale: { id: "whale", name: "Whale" },
    zebra: { id: "zebra", name: "Zebra" },
};
