<template>
    <div class="tetris-logo"></div>
    <p class="scorelbl">Score: <span id="score" ref="score">0</span></p>
    <div class="screen">
        <div class="holding">
            <p>Hold:</p>
            <canvas id="holding" ref="holdingCanvas"></canvas>
        </div>
        <div class="game-canvas-container">
            <canvas id="game" ref="gameCanvas"></canvas>
        </div>
        <div class="next">
            <p>Next:</p>
            <canvas id="next" ref="nextCanvas"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initOptionsFromUrl } from '@/initOptionsFromUrl';
import { Options } from '@tetris/core/game/init';


const worker = new Worker(new URL('@/worker.ts', import.meta.url), { type: 'module' });

worker.addEventListener("error", (err) => {
    console.error('Worker error:', err);
});
worker.addEventListener("messageerror", (err) => {
    console.error('Worker message error:', err);
});
worker.addEventListener("message", (event) => {
    const { type, data } = event.data;
    // if (type === "init") {
    //     document.body.removeChild(document.querySelector("#loading"));
    //     document.body.appendChild(data);
    // } else if (type === "log") {
    //     console.log(...data);
    // } else if (type === "error") {
    //     console.error(...data);
    // }
});

const gameCanvas = ref<HTMLCanvasElement>();
const holdingCanvas = ref<HTMLCanvasElement>();
const nextCanvas = ref<HTMLCanvasElement>();

const options = new Options();
const url = new URL(location.href);
initOptionsFromUrl(url, options);

onMounted(() => {
    const gameCanvasOffscreen = gameCanvas.value.transferControlToOffscreen();
    const holdingCanvasOffscreen = holdingCanvas.value.transferControlToOffscreen();
    const nextCanvasOffscreen = nextCanvas.value.transferControlToOffscreen();

    worker.postMessage({
        code: "start", options, gameCanvasOffscreen,
        holdingCanvasOffscreen,
        nextCanvasOffscreen,
    }, [gameCanvasOffscreen,
        holdingCanvasOffscreen,
        nextCanvasOffscreen]);

});
</script>