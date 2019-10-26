import "regenerator-runtime";
import { receiver, transmitter } from "./tetris/log-com.js";

if (process.argv.filter(a => a === "--test").length > 0) {
    transmitter();
} else {
    receiver();
}
