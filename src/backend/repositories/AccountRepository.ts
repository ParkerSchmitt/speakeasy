import { Request, Response, NextFunction } from 'express'
import {Database } from 'sqlite3'

export interface AccountRepositoryConfig {
    TableName: string
}


class AccountRepository {
    tableName: string
    database: Database

    /**
     * Creates the SignUpRepository
     * @param config the SignUpRepositoryConfig- the Client is injected into the repository as a dependency, and the table name is given.
     */
    constructor(config: AccountRepositoryConfig) {
      this.tableName = config.TableName;
      this.database = new Database(':memory:');
    }

    /**
     * emailExists checks to see if a account exists inside of the database
     * @param email the email to check for
     * @returns a boolean promise. TRUE if there is an email found, FALSE if there isn't.
     */
    async emailExists(email: string) : Promise<boolean> {
        const query = `SELECT id FROM ${this.tableName} WHERE email=$value`;
        let rowCount  = await new Promise<any[]>((resolve,reject) => {this.database.all(query,{
            'value': email
        }, (error, result) => {
            if (error) {
                reject(error)
              } else {
                resolve(result)
              }
        })
    });


        if (rowCount.length !== 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * insertEmail puts a email and agent into the database.
     * @param email The email to insert
     * @param agent The agent attatched to the signup request (Chrome, Firefox, Edge, etc. Used for analytical purpose and potentially email design limitations)
     */
    async  insertEmail(email: string, agent: string) : Promise<void> {
        const query = `INSERT INTO ${this.tableName}(email,agent) VALUES($1,$2)`;
        const values = [email,agent];
        this.client.query(query, values, (err, res) => {
            if (err) {
                throw err;
            }
        });
    }
}

export default SignUpRepository;