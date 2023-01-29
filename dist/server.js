"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const sqlite3_1 = require("sqlite3");
const AccountMediator_js_1 = __importDefault(require("./backend/mediators/AccountMediator.js"));
const AccountController_js_1 = __importDefault(require("./backend/controllers/AccountController.js"));
const AccountRepository_js_1 = __importDefault(require("./backend/repositories/AccountRepository.js"));
const config_1 = __importDefault(require("./config"));
exports.app = (0, express_1.default)();
exports.app.use((0, express_session_1.default)({
    secret: config_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((req, res, next) => {
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});
const signUpController = new AccountController_js_1.default({
    Mediator: new AccountMediator_js_1.default({
        Repository: new AccountRepository_js_1.default({
            tableName: 'accounts',
            database: new sqlite3_1.Database('storage.db')
        })
    })
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
exports.app.post('/register', signUpController.PostReceiveSignup);
// start the Express server
exports.app.listen(config_1.default.PORT, () => {
    console.log(`server running on ${config_1.default.PORT}`);
});
//# sourceMappingURL=server.js.map