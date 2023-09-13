"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(express_1.default.json({ limit: '50mb' }));
app.get('/ping', (req, res) => {
    console.log("Hola");
    res.send("Hola mundo");
});
server.listen(() => {
    console.log(`Running on port => http://localhost:${process.env.PORT}`);
});
