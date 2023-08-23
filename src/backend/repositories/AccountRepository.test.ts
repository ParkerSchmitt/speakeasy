import AccountRepository from './AccountRepository';
import { newDb } from 'pg-mem';
const { Client } = newDb().adapters.createPg();

describe('AccountRepository',  () => {
    let AccountRepositoryCorrectTable : AccountRepository
    const client = new Client;

    it('should create database in memory', async () => {
        await client.query('CREATE TABLE accounts (id SERIAL, email character varying(320), "firstName" character varying(255), "lastName" character varying(255), "passwordHash" character varying(255), "passwordSalt" character varying(32), "emailVerificationToken" character varying (128), "isEmailAuthenticated" boolean)')
        await client.query(`INSERT INTO accounts (email, "firstName", "lastName", "passwordHash", "passwordSalt", "emailVerificationToken", "isEmailAuthenticated") VALUES('duplicate@test.com','Adam','Smith','AAfnsadjni123huh2f3i23r23','sdfdsfds122121f', '', true)`)

        AccountRepositoryCorrectTable = new AccountRepository({
            tableName: 'accounts',
            client: new Client({
                user: 'test',
                host: 'localhost',
                database: 'postgres',
                password: 'test',
                port: 5432,
            }),
        })
    });

    // Makes sure all requests are interpreted correctly
    it.each([
        ["test@test.com", false],
        ["duplicate@test.com", true] // duplicate value,

    ])(
        `should give correct boolean if a email exists or not`,
        async (email, bool) => {
            const result = await AccountRepositoryCorrectTable.emailExists(email);
            expect(result).toEqual(bool);

        }
    );

      // Makes sure all requests are inserted into the database
      it.each([
        ["abc@test.com","John", "Smith", "asnkfjdksfkdsnkj12334231", "dsfdsf13e423"],
        ["gmail.com@test.com","First","Last","abc","def"]
    ])(
        `should insert values into database`,
        async (email, firstName, lastName, passwordHash, passwordSalt) => {
            const insert = await AccountRepositoryCorrectTable.insertAccount(email, firstName, lastName, passwordHash, passwordSalt, 'testToken', false);
            const query = `SELECT email, "firstName", "lastName", "passwordHash", "passwordSalt" FROM ${AccountRepositoryCorrectTable.tableName} WHERE email=$1`;
            const values = [email]
            let result = await client.query(query,values)

            expect(result.rowCount).toEqual(1);
            expect(result.rows[0].email).toEqual(email);
            expect(result.rows[0].firstName).toEqual(firstName);
            expect(result.rows[0].lastName).toEqual(lastName);
            expect(result.rows[0].passwordHash).toEqual(passwordHash);
            expect(result.rows[0].passwordSalt).toEqual(passwordSalt);
        }
    );

     // Makes sure that we can retrieve the email and hash
     it.each([
        ["abc@test.com",2 ,"asnkfjdksfkdsnkj12334231", "dsfdsf13e423"], //from previous test
    ])(
        `should retrieve correct email and hash`,
        async (email, correctAccountId, correctHash,correctSalt) => {
            const responseObj = await AccountRepositoryCorrectTable.retrieveHashAndSalt(email)
    
            expect(responseObj).not.toBeNull()
            expect(responseObj!.id).toEqual(correctAccountId)
            expect(responseObj!.hash).toEqual(correctHash)
            expect(responseObj!.salt).toEqual(correctSalt)
        }
    );

     // Makes sure that we can retrieve an accountId from the token
     it.each([
        ["testToken",0], //from mock
    ])(
        `should retrieve correct account id from token`,
        async (token, correctAccountId) => {
            const accountId = await AccountRepositoryCorrectTable.retrieveAccountIdFromToken(token)
    
            expect(accountId).not.toBeNull()
            expect(accountId).not.toEqual(correctAccountId)
        }
    );

     // Makes sure that we can set a email address as authenticated 
     it(
        `should update emailVerificationToken and isEmailAuthenticated given account ID`,
        async () => {
            let accountId = 1;
            let verifiedStatus = true;
            await AccountRepositoryCorrectTable.setEmailVerified(accountId, verifiedStatus)
    
            const query = `SELECT "emailVerificationToken", "isEmailAuthenticated" FROM ${AccountRepositoryCorrectTable.tableName} WHERE id=$1`;
            const values = [accountId]
            let result = await client.query(query,values)

            expect(result.rowCount).toEqual(1);
            expect(result.rows[0].emailVerificationToken).toEqual("")
            expect(result.rows[0].isEmailAuthenticated).toEqual(verifiedStatus)
        }
    );    
});
