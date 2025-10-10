import { Options } from "@tetris/core/game/init";
import "./engine/style/tetris.css";
import { initOptionsFromUrl } from "./initOptionsFromUrl";
import Game from "./engine/game.vue";
import { createApp } from "vue";

const container = document.querySelector<HTMLDivElement>("#container");
createApp(Game).mount(container);
