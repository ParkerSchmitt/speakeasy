import AccountRepository from './AccountRepository';
import { newDb } from 'pg-mem';
const { Client } = newDb().adapters.createPg();

describe('AccountRepository',  () => {
    let AccountRepositoryCorrectTable : AccountRepository
    const client = new Client;

    it('should create database in memory', async () => {
        await client.query('CREATE TABLE accounts (id SERIAL, email character varying(320), "firstName" character varying(255), "lastName" character varying(255), "passwordHash" character varying(255), "passwordSalt" character varying(32))')
        await client.query(`INSERT INTO accounts (email, "firstName", "lastName", "passwordHash", "passwordSalt") VALUES('duplicate@test.com','Adam','Smith','AAfnsadjni123huh2f3i23r23','sdfdsfds122121f')`)

        AccountRepositoryCorrectTable = new AccountRepository({
            tableName: 'accounts',
            client: client
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
            const insert = await AccountRepositoryCorrectTable.insertAccount(email, firstName, lastName, passwordHash, passwordSalt);
            const query = `SELECT email, "firstName", "lastName", "passwordHash", "passwordSalt" FROM ${AccountRepositoryCorrectTable.tableName} WHERE email=$1`;
            const values = [email]
            let result = await client.query(query,values)
            console.log(result);
            expect(result.rowCount).toEqual(1);
            expect(result.rows[0].email).toEqual(email);
            expect(result.rows[0].firstName).toEqual(firstName);
            expect(result.rows[0].lastName).toEqual(lastName);
            expect(result.rows[0].passwordHash).toEqual(passwordHash);
            expect(result.rows[0].passwordSalt).toEqual(passwordSalt);
        }
    );

          // Makes sur
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



});
