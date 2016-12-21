/**
 * Created by maraujo on 12/13/16.
 */

import {Service, Inject} from "typedi";
import {UserModel} from "./user.model";
import {Outcome, CommonsRepository} from "../commons/index";

@Service()
export class UserRepository  extends CommonsRepository<UserModel> {

    tableName(): string {
        return 'user';
    }

    public getById(id: number): Promise<Outcome<UserModel>> {
        return super.findById(id, UserModel).then((outcome: Outcome<UserModel>) => {
            if(outcome.hasNoResult()) {
                let error = new Error("User not found.");
                throw error;
            }

            return outcome;

        });
    }

    public findById(id: number): Promise<Outcome<UserModel>> {
        return super.findById(id, UserModel);
    }

    public loginUser(email: string, password: string): Promise<Outcome<UserModel>> {
        let sql = "SELECT u.* FROM user u where email = :email and password = :password";
        let params = {email: email, password: password};
        
        return this.db.queryFirstTyped(sql, params, UserModel).then((outcome: Outcome<UserModel>) => {
            if(outcome.hasNoResult()) {
                let error = new Error("User not found or invalid password.");
                throw error;
            }

            return outcome.getResult();

        });
    }
}