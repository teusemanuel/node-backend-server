/**
 * Created by maraujo on 12/14/16.
 */

import {Inject} from "typedi";
import {Outcome} from "./outcome";
import {Database} from "../../db";

export abstract class CommonsRepository<T> {

    @Inject() 
    private _db: Database;

    abstract tableName(): string;

    public findById(id: number, type?: new () => T): Promise<Outcome<T>> {
        return this._db.queryFirstTyped(`SELECT * FROM ${this.tableName()} where id = :id`, { id: id }, type );
    }

    public save(object: T): Promise<T> {
        let sql = `INSERT INTO ${this.tableName()} ( `;
        let keys: string[] = this._keysByObject(object);
        let valuesSql: string = '';
        let values = {};
        let firstTime: boolean = true;

        for (let key of keys) {
            if(!firstTime) {
                sql += ', ';
                valuesSql += ', ';
            }

            sql += key;
            valuesSql += `:${key}`;
            values[key] = object[key];

            firstTime = false;
        }

        sql += `) VALUES(${valuesSql});`;

        return this._db.save(sql, values).then((objectId) =>{
            object["id"] = objectId;
            return object;
        })
    }

    public update(object: T, whereClauses: any = {}, ignoreNullValues: boolean = true): Promise<Outcome<number>> {
        if(ignoreNullValues) {

            let sql = `UPDATE ${this.tableName()} SET `;
            let keys: string[] = this._keysByObject(object);
            let values = {};
            let firstTime: boolean = true;

            for (let key of keys) {
                if(!firstTime) {
                    sql += ', ';
                }

                sql += `${key} = :${key}`;
                values[key] = object[key];

                firstTime = false;
            }

            sql += ' WHERE ';

            firstTime = true;
            for (let clause in whereClauses) {
                if(!firstTime) {
                    sql += ', ';
                }

                sql += `${clause} = :clause_${clause}`;
                values[`clause_${clause}`] = object[clause];

                firstTime = false;
            }

            return this._db.update(sql, values).then((result) =>{
                return Outcome.ResultSuccess(result);
            });
        } else {

        }

    }

    public deleteById(id: number): Promise<boolean> {
        let sql = `DELETE FROM ${this.tableName()} WHERE id = :id `;
        return this._db.delete(sql, {id: id}).then((result) => {
            return result > 0;
        });
    }


    get db(): Database {
        return this._db;
    }

    private _keysByObject(object: T): Array<string> {
        let keys: Array<string> = [];

        for (let key in object) {
            if(this._isPrimitiveValue(object[key]) || this._isDateValue(object[key])) {
                keys.push(key);
            }
        }

        return keys;
    }

    private _isPrimitiveValue(value): boolean {
        return (typeof value) == 'number' || (typeof value) == 'boolean' || (typeof value) == 'string';
    }

    private _isDateValue(value): boolean {
        return value.constructor === Date;
    }
}