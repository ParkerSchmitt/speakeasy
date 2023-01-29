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
const AccountMediator_1 = require("../mediators//AccountMediator");
const SignUpRequest_1 = require("./viewmodels/SignUpRequest");
class AccountController {
    /**
       * Creates the AccountController
       * @param config the AccountConfig- the mediator is injected into the controller as a dependency.
       */
    constructor(config) {
        /**
           * PostReceiveSignup converts the JSON request to a viewmodel and attempts to upload it to the DB via the mediator.
           * @param req the Express request
           * @param res the Express response
           * @param next the next middleware
           * @returns a void promise
           */
        this.PostReceiveSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body == null) {
                res.status(400).json({ code: 400, response: 'No body found' });
                return;
            }
            try {
                const requestObj = SignUpRequest_1.Convert.toSignUpRequest(req.body);
                yield this.mediator.PostReceiveSignup(requestObj);
            }
            catch (error) {
                const message = 'Could not process request';
                if (error instanceof Error) {
                    // We want to keep this the same as a succesful response to prevent users from knowing emails associated with this application
                    // However, want to throw an error still for unit testing
                    if (error === AccountMediator_1.AccountExistsError) {
                        res.status(200).json({ code: 200, response: 'Signed up' });
                        return;
                    }
                    res.status(400).json({ code: 400, error: error.message });
                    return;
                }
                res.status(500).json({ code: 500, error: message });
                return;
            }
            res.status(200).json({ code: 200, response: 'Signed up' });
        });
        this.mediator = config.Mediator;
    }
}
exports.default = AccountController;
//# sourceMappingURL=AccountController.js.map