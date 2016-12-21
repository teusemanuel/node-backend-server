/**
 * Created by mateus on 11/25/16.
 */
/// <reference path="_all.d.ts" />
"use strict";

import { IPool, IConnection } from "mysql";
import * as MySql from "mysql";
import {Configuration} from "./config";
import {Outcome} from "./commons/db/outcome";
import {Service} from "typedi";

export class DatabaseState {

    pool: IPool;
    mode: string;

    constructor(pool:IPool, mode:string) {
        this.pool = pool;
        this.mode = mode;
    }
}

@Service()
export class Database {

    public static MODE_TEST: string = 'mode_test';
    public static MODE_PRODUCTION: string = 'mode_production';
    
    protected state: DatabaseState = new DatabaseState(null, null);

    constructor() {
    }

    public connect(mode: string): Promise<DatabaseState> {
         
         let connection = {
             host: Configuration.host,
             user: Configuration.user,
             password: Configuration.password,
             database: mode === Database.MODE_PRODUCTION ? Configuration.database_production : Configuration.database_test
         };

         return new Promise<DatabaseState>((resolve, reject) => {
             this.state.pool = MySql.createPool(connection);

             this.state.mode = mode;
             
             if(!this.state.pool) 
                 reject(new Error("Error: Error on create Connection. Pool Not created"));
             else 
                 resolve(this.state);
         });
    }

    public getPool(): Promise<IConnection> {
        return new Promise<IConnection>((resolve, reject) => {
            if(!this.state.pool) reject(new Error("Error not exists connection"));
            else this.state.pool.getConnection((err, connection: IConnection) => {
                if(err) {
                    connection.release();
                    console.error(err);
                    reject(err);
                }
                else {
                    console.log('[CONN] – Connection created with id:'+ connection.threadId);
                    connection.config.queryFormat = (query, values) => {
                        if (!values) return query;
                        let querySql = query.replace(/\:(\w+)/g, (txt, key) => {
                            if (values.hasOwnProperty(key)) {
                                return connection.escape(values[key]);
                            }
                            return txt;
                        });

                        console.log('- Query: ' + querySql);
                        return querySql;
                    };
                    resolve(connection);
                    connection.release();
                }
            });
        });
    }
    
    public transaction(): Promise<Transaction> {

        return new Promise<Transaction>((resolve, reject) => {
            this.getPool().then((connection) => {

                connection.beginTransaction((error) => {

                    if (error) {
                        console.log('Error On Open Transaction');
                        console.log(error);
                        reject(error);
                    } else {
                        
                        let transaction: Transaction = new Transaction(connection);
                        transaction.state = this.state;

                        resolve(transaction);
                    }
                });
            })
        });

    }

    public query<T>(sql, params?:any, maxResults?:number, startAt?:number): Promise<T> {
        return new Promise<T>((resolve, reject) => {

            this.getPool().then((connection) => {

                if(sql.indexOf(" limit ") == -1 && (maxResults || startAt)) {
                    if (maxResults && startAt) {
                        sql += ` LIMIT ${maxResults} OFFSET ${startAt} `;
                    } else if(maxResults) {
                        sql += ` LIMIT ${maxResults} `;
                    } else {
                        sql += ` OFFSET ${startAt} `;
                    }
                }

                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                })
            })
        });
    }

    /**
     *
     * @param sql query with the insert attributes
     * @param params inserted in database
     * @returns {Promise<number>} if you are inserting a row into a table with an auto increment primary key, you can retrieve the insert id
     */
    public save(sql, params?:any): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            this.getPool().then((connection) => {

                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(result.insertId);
                })
            })
        });
    }

    /**
     *
     * @param sql query with the insert attributes
     * @param params inserted in database
     * @returns {Promise<number>} you can get the number of changed rows from an update statement.
     */
    public update(sql, params?:any): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            this.getPool().then((connection) => {

                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(result.changedRows);
                })
            })
        });
    }

    /**
     *
     * @param sql query with the insert attributes
     * @param params inserted in database
     * @returns {Promise<number>} you can get the number of affected rows from an delete statement.
     */
    public delete(sql, params?:any): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            this.getPool().then((connection) => {

                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(result.affectedRows);
                })
            })
        });
    }

    /**
     *
     * @param sql query for search result in the database
     * @param params for use in where clause
     * @param maxResults used for paginated results
     * @returns {Promise<T>}
     */
    public queryTyped<T>(sql, params?:any, type?: new () => T, maxResults?:number, startAt?:number): Promise<Outcome<T>> {
        return new Promise<Outcome<T>>((resolve, reject) => {

            this.getPool().then((connection) => {

                if(sql.indexOf(" limit ") == -1 && (maxResults || startAt)) {
                    if (maxResults && startAt) {
                        sql += ` LIMIT ${maxResults} OFFSET ${startAt} `;
                    } else if(maxResults) {
                        sql += ` LIMIT ${maxResults} `;
                    } else {
                        sql += ` OFFSET ${startAt} `;
                    }
                }

                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                        //TODO Create paginated result
                    else resolve(Outcome.Deserialize(result, type));
                })
            })
        });
    }

    /**
     *
     * @param sql query for search result in the database
     * @param params for use in where clause
     * @returns {Promise<boolean>} <code>true</code> if return any row of the database, <code>false</code> if not return nothing
     */
    public exists(sql, params?:any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            this.getPool().then((connection) => {
                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(result && result.length > 0);
                })
            })
        });
    }

    /**
     *
     * @param sql query for search result in the database
     * @param params for use in where clause
     * @param paramsAlias utilized for counting in the database result
     * ---------
     * Ex:
     *
     * sql = 'select count(c.id) as id, count(c.name) as userName from user where id = :id';
     * params = {id: 1};
     * paramsAlias = "userName";
     *
     *  return userName counts
     *  ---------
     *
     * @returns {Promise<number>} number of result found by query
     */
    public count(sql, params?:any, paramsAlias?:string): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            this.getPool().then((connection) => {
                connection.query(sql, params, (err, result) => {
                    if(err) 
                        reject(err);
                    else if(!result || result.length <= 0 || !result[0]) 
                        resolve(0);
                    else {
                        let obj = result[0];
                        resolve( paramsAlias ? obj[paramsAlias] : obj[Object.keys(obj)[0]]);
                    }
                })
            })
        });
    }


    /**
     * @param sql query for search result in the database
     * @param params for use in where clause
     * @returns {Promise<T>} first result founded in the database
     */
    public queryFirst<T>(sql, params?:any): Promise<T> {
        return new Promise<T>((resolve, reject) => {

            this.getPool().then((connection) => {
                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(result[0] || null);
                })
            })
        });
    }


    /**
     * @param sql query for search result in the database
     * @param params for use in where clause
     * @returns {Promise<T>} first result founded in the database
     */
    public queryFirstTyped<T>(sql, params?:any, type?: new () => T): Promise<Outcome<T>> {
        return new Promise<Outcome<T>>((resolve, reject) => {

            this.getPool().then((connection) => {
                connection.query(sql, params, (err, result) => {
                    if(err) reject(err);
                    else resolve(Outcome.Deserialize(result[0], type));
                })
            })
        });
    }

}

@Service()
export class Transaction extends Database {

    connection: IConnection;

    constructor(connection: IConnection) {
        super();
        this.connection = connection;
    }

    public begin(): Promise<Transaction> {

        return new Promise<Transaction>((resolve, reject) => {
            this.getPool().then((connection:IConnection) => {
                connection.beginTransaction((error) => {

                    if (error) {
                        console.log('Error On Open Transaction');
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(this);
                    }
                });
            }).catch((error) => {
                console.log('Error in Open Connection with Transaction');
                console.log(error);
                reject(error);
            });
        });
    }

    public getPool() {
        return new Promise<IConnection>((resolve, reject) => {
            if (!this.state.pool) reject(new Error("Error not exists connection"));
            else {
                if(this.connection) {
                    resolve(this.connection);
                } else {
                    this.state.pool.getConnection((err, connection:IConnection) => {
                        if (err) {
                            connection.release();
                            console.error(err);
                            reject(err);
                        }
                        else {
                            console.log('[CONN] – Connection created with id:' + connection.threadId);
                            connection.config.queryFormat = (query, values) => {
                                if (!values) return query;
                                let querySql = query.replace(/\:(\w+)/g, (txt, key) => {
                                    if (values.hasOwnProperty(key)) {
                                        return connection.escape(values[key]);
                                    }
                                    return txt;
                                });

                                console.log('- Query: ' + querySql);
                                return querySql;
                            };

                            this.connection = connection;
                            resolve(connection);
                        }
                    });
                }
            }
        });
    }

    public commit(commitWithErrors: boolean = false): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            if(this.connection == null) {
                console.log('Connection not opened yet.');
                reject(new Error('Connection not opened yet.'));
            }

            this.getPool().then((connection:IConnection) => {
                connection.commit((error) => {

                    if (error) {
                        console.log('Error On Commit Transaction');
                        console.log(error);

                        if(!commitWithErrors) {
                            connection.rollback(() => {
                                reject(error);
                            });
                        } else {
                            reject(error);
                        }

                    } else {
                        resolve(true);
                    }
                });
            }).catch((error) => {
                console.log('Error on Get Current Connection with Transaction');
                console.log(error);
                reject(error);
            });
        });
    }

    public rollback(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if(this.connection == null) {
                console.log('Connection not opened yet.');
                reject(new Error('Connection not opened yet.'));
            }

            this.getPool().then((connection:IConnection) => {
                connection.rollback(() => {
                    resolve(true);
                });
            }).catch((error) => {
                console.log('Error on Get Current Connection with Transaction');
                console.log(error);
                reject(error);
            });
        });
    }
}

