import { game } from "tetris-core";
const { init: { init } } = game;

const options = {};

import { NodeGraphicEngine } from "../src/tetris/graphics/node/node-engine.js";
const graphicEngine = new NodeGraphicEngine();

init(options, graphicEngine);