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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountExistsError = void 0;
const crypto_1 = require("crypto");
exports.AccountExistsError = new Error('Account already exists');
class AccountMediator {
    /**
       * Creates the AccountMediator
       * @param config the AccountMediatorConfig- the repository is injected into the mediator as a dependency.
       */
    constructor(config) {
        this.repository = config.Repository;
    }
    /**
       * PostReceiveSignup registers an account inside the database
       * @param request the viewmodel of the POST request. Includes email, first name, last name, and password.
       */
    PostReceiveSignup(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield this.repository.emailExists(request.email);
                if (exists) {
                    throw exports.AccountExistsError;
                }
                else {
                    // Generate hash and salt for password for security
                    const passwordHash = (0, crypto_1.createHash)('sha256').update(request.password, 'utf8').digest('hex');
                    const passwordSalt = (0, crypto_1.randomBytes)(32).toString('hex');
                    yield this.repository.insertAccount(request.firstName, request.lastName, request.email, passwordHash, passwordSalt);
                }
            }
            catch (error) {
                const message = 'Unknown Error';
                if (error instanceof Error) {
                    throw error;
                }
                else {
                    throw new Error(message);
                }
            }
        });
    }
}
exports.default = AccountMediator;
//# sourceMappingURL=AccountMediator.js.map