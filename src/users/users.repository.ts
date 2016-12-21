/**
 * Created by maraujo on 12/19/16.
 */
import {Service} from "typedi";
import {UserModel} from "../user/user.model";
import {Outcome, CommonsRepository} from "../commons/index";

@Service()
export class UsersRepository  extends CommonsRepository<UserModel> {

    tableName(): string {
        return 'user';
    }

    public allUsers(): Promise<Outcome<UserModel>> {
        return this.db.queryTyped("SELECT * FROM user", UserModel).then((outcome:Outcome<UserModel>) => {

            return outcome;

        });
    }
}