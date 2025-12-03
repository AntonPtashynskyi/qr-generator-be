"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const qrcodes_router_1 = __importDefault(require("./qr-codes/qrcodes.router"));
const users_router_1 = __importDefault(require("./users/users.router"));
const mongoose_1 = __importDefault(require("mongoose"));
const { PORT, MONGO_URL } = process.env;
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    xPoweredBy: false,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(users_router_1.default);
app.use(qrcodes_router_1.default);
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URL);
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log("Server Listen PORT:", PORT);
        });
    }
    catch (error) {
        console.log('Error on server init', error);
    }
});
init();
