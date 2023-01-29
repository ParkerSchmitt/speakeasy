import { SignUpRequest } from '../controllers/viewmodels/SignUpRequest';
import AccountRepository from '../repositories/account';
import { createHash,  randomBytes } from 'crypto'
export const EmailExistsError: Error = new Error('Email already exists');


export interface AccountMediatorConfig {
    Repository: AccountRepository;
}


class AccountMediator {
    repository: AccountRepository;

    /**
     * Creates the AccountMediator
     * @param config the AccountMediatorConfig- the repository is injected into the mediator as a dependency.
     */
    constructor(config: AccountMediatorConfig) {
        this.repository = config.Repository;
    }

    /**
     * PostReceiveSignup registers an account inside the database
     * @param request the viewmodel of the POST request. Includes email, first name, last name, and password.
     */
    async PostReceiveSignup(request: SignUpRequest) {
        try {
            const exists = await this.repository.emailExists(request.email);
            if (exists !== false) {
                throw EmailExistsError;
            } else {
                //Generate hash and salt for password for security
                let passwordHash : string = createHash('sha256').update(request.password, 'utf8').digest('hex');
                let passwordSalt = randomBytes(32).toString('hex');
                await this.repository.insertAccount(request.firstName, request.lastName, request.email, passwordHash, passwordSalt);
            }
        } catch (error) {
            const message = 'Unknown Error'
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(message);
            }
        }
    }
}



export default AccountMediator;