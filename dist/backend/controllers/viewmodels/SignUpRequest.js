"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = exports.InvalidPasswordTypeError = exports.InvalidLastNameTypeError = exports.InvalidFirstNameTypeError = exports.InvalidEmailTypeError = exports.MissingPasswordError = exports.MissingLastNameError = exports.MissingFirstNameError = exports.InvalidEmailError = exports.MissingEmailError = void 0;
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable no-prototype-builtins */
const EmailValidator = __importStar(require("email-validator"));
exports.MissingEmailError = new Error('Missing email from request');
exports.InvalidEmailError = new Error('Email is not valid');
exports.MissingFirstNameError = new Error('Missing first name from request');
exports.MissingLastNameError = new Error('Missing last name from request');
exports.MissingPasswordError = new Error('Missing password  from request');
exports.InvalidEmailTypeError = new Error('Email must be a string');
exports.InvalidFirstNameTypeError = new Error('First name must be a string');
exports.InvalidLastNameTypeError = new Error('Last name must be a string');
exports.InvalidPasswordTypeError = new Error('Password must be a string');
// Converts JSON strings to this viewmodel
// and asserts the results and throws errors if it is invalid
class Convert {
    static toSignUpRequest(json) {
        const emailKey = 'email';
        const firstNameKey = 'firstName';
        const lastNameKey = 'lastName';
        const passwordKey = 'password';
        if (!json.hasOwnProperty('email')) {
            throw exports.MissingEmailError;
        }
        if (typeof json[emailKey] !== 'string') {
            throw exports.InvalidEmailTypeError;
        }
        if (!EmailValidator.validate(json[emailKey])) {
            throw exports.InvalidEmailError;
        }
        if (!json.hasOwnProperty('firstName')) {
            throw exports.MissingFirstNameError;
        }
        if (typeof json[firstNameKey] !== 'string') {
            throw exports.InvalidFirstNameTypeError;
        }
        if (!json.hasOwnProperty('lastName')) {
            throw exports.MissingLastNameError;
        }
        if (typeof json[lastNameKey] !== 'string') {
            throw exports.InvalidLastNameTypeError;
        }
        if (!json.hasOwnProperty('password')) {
            throw exports.MissingPasswordError;
        }
        if (typeof json[passwordKey] !== 'string') {
            throw exports.InvalidPasswordTypeError;
        }
        return json;
    }
}
exports.Convert = Convert;
//# sourceMappingURL=SignUpRequest.js.map