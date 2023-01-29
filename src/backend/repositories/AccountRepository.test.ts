import { Database } from 'sqlite3'; /*eslint: ignore */
import AccountRepository from './AccountRepository';

describe('AccountRepository',  () => {
    let AccountRepositoryCorrectTable : AccountRepository
    let database = new Database(':memory:')

    it('should create database in memory', async () => {

    await new Promise<void>((resolve,reject) => {database.exec("CREATE TABLE accounts (id SERIAL, email varchar(255), firstName varchar(255), lastName varchar(255), passwordHash varchar(255), passwordSalt varchar(32))", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })

    await new Promise<void>((resolve,reject) => { database.exec("INSERT INTO accounts (id, email, firstName, lastName, passwordHash, passwordSalt) VALUES('1', 'duplicate@test.com','Adam','Smith','AAfnsadjni123huh2f3i23r23','sdfdsfds122121f')", (err) => {
        if (err) {
            reject(err)
        } else {
            resolve()
        }})
    })


     AccountRepositoryCorrectTable = new AccountRepository({
        tableName: 'accounts',
        database: database,
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

            const query = `SELECT email, firstName, lastName, passwordHash, passwordSalt FROM ${AccountRepositoryCorrectTable.tableName} WHERE email=$value`;

            let rows  = await new Promise<any[]>((resolve,reject) => {database.all(query,{
                '$value': email
            }, (error, result) => {
                if (error) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
            })
        })
    
            expect(rows.length).toEqual(1);
            expect(rows[0].email).toEqual(email);
            expect(rows[0].firstName).toEqual(firstName);
            expect(rows[0].lastName).toEqual(lastName);
            expect(rows[0].passwordHash).toEqual(passwordHash);
            expect(rows[0].passwordSalt).toEqual(passwordSalt);

        }
    );
});
