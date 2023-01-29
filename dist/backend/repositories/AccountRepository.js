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
class AccountRepository {
    /**
       * Creates the SignUpRepository
       * @param config the SignUpRepositoryConfig- the Client is injected into the repository as a dependency, and the table name is given.
       */
    constructor(config) {
        this.tableName = config.tableName;
        this.database = config.database;
    }
    /**
       * emailExists checks to see if a account exists inside of the database
       * @param email the email to check for
       * @returns a boolean promise. TRUE if there is an email found, FALSE if there isn't.
       */
    emailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id FROM ${this.tableName} WHERE email=$value`;
            const rowCount = yield new Promise((resolve, reject) => {
                this.database.all(query, {
                    $value: email
                }, (error, result) => {
                    if (error !== null) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            if (rowCount.length !== 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    /**
       * insertAccount puts a account into the database.
       * @param email The email to insert
       * @param firstName The first name to insert
       * @param lastName the last name to insert
       * @param passwordHash the hash of the password to insert
       * @param passwordSalt the salt for the password to insert
       */
    insertAccount(email, firstName, lastName, passwordHash, passwordSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO ${this.tableName}(email, firstName, lastName, passwordHash, passwordSalt) VALUES($email, $firstName, $lastName, $passwordHash, $passwordSalt)`;
            yield new Promise((resolve, reject) => {
                this.database.run(query, {
                    $email: email,
                    $firstName: firstName,
                    $lastName: lastName,
                    $passwordHash: passwordHash,
                    $passwordSalt: passwordSalt
                }, (err) => {
                    if (err !== null) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
}
exports.default = AccountRepository;
//# sourceMappingURL=AccountRepository.js.map