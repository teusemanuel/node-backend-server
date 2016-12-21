/**
 * Created by maraujo on 12/13/16.
 */

import {Request} from "express";
import {Service, Inject} from "typedi";
import {UserRepository} from "./user.repository";
import {Outcome, IService} from "../commons/index";
import {UserModel} from "./user.model";

@Service()
export class UserService implements IService<UserModel> {

    @Inject()
    _userDAO: UserRepository;

    create(user:UserModel) {
        return this._userDAO.create(user);
    }

    update(user:UserModel) {
        return this._userDAO.update(user, {id: user.id});
    }

    deleteById(id:number) {
        return this._userDAO.deleteById(id);
    }

    findById(id:number) {
        return this._userDAO.findById(id);
    }

    public static loggedUser(req: Request): UserModel {
        if (!req["user"]) {
            let error = new Error("Not logged.");
            throw error;
        }

        let user:UserModel = req["user"];
        return user;
    }

    public static loggedUserId(req: Request): number {
        if (!req["user"]) {
            let error = new Error("Not logged.");
            throw error;
        }

        let user:UserModel = req["user"];
        return user ? user.id : -1;
    }

    public getLoggedUser(req: Request): Promise<Outcome<UserModel>> {
        let user = UserService.loggedUser(req);
        
        return this._userDAO.getById(user.id);
    }
}