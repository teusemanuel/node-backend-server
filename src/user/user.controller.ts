/**
 * Created by mateus on 11/29/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";

import {Request, Response, NextFunction} from "express";
import {Service, Inject, Require} from "typedi";
import {Database} from "../db";
import {ResultModel, ResultMessageModel} from "../commons/index";
import {UserModel} from "./user.model";
import {Outcome} from "../commons/db/outcome";
import {UserService} from "./user.service";
import {Deserialize} from "cerialize/dist/serialize";

@Service()
export class UserController {

    @Inject()
    _userService: UserService;

    public index(req: Request, res: Response, next: NextFunction) {
        res.json(ResultModel.success("Index Route"));
    }

    public getCurrent(req: Request, res: Response, next: NextFunction) {
        this._userService.getLoggedUser(req)
            .then((outcome: Outcome<UserModel>) => {
                
                res.json(ResultModel.successOutcome(outcome));
                
            }).catch(function (error) {
            
                let errorMessage: string = error.message;
                res.json(ResultMessageModel.errorMessage(errorMessage));
            
            });
    }

    public getById(req: Request, res: Response, next: NextFunction) {
        let userId = UserService.loggedUserId(req);
        this._userService.findById(userId)
            .then((outcome: Outcome<UserModel>) => {
                
                res.json(ResultModel.successOutcome(outcome));
                
            }).catch(function (error) {
            
                let errorMessage: string = error.message;
                res.json(ResultMessageModel.errorMessage(errorMessage));
            
            });
    }

    public create(req: Request, res: Response, next: NextFunction) {
        let user = Deserialize(req.body, UserModel);
        this._userService.create(user)
            .then((result: UserModel) => {
                
                res.json(ResultModel.success(result));
                
            }).catch(function (error) {
            
                let errorMessage: string = error.message;
                res.json(ResultMessageModel.errorMessage(errorMessage));
            
            });
    }

    public update(req: Request, res: Response, next: NextFunction) {
        let userId = UserService.loggedUserId(req);
        let user = Deserialize(req.body, UserModel);
        user.id = userId;

        this._userService.update(user)
            .then((outcome: Outcome<number>) => {
                
                res.json(ResultModel.successOutcome(outcome));
                
            }).catch(function (error) {
            
                let errorMessage: string = error.message;
                res.json(ResultMessageModel.errorMessage(errorMessage));
            
            });
    }

    public remove(req: Request, res: Response, next: NextFunction) {
        let userId = UserService.loggedUserId(req);
        this._userService.deleteById(userId)
            .then((result) => {
                
                res.json(ResultModel.success(result));
                
            }).catch(function (error) {
            
                let errorMessage: string = error.message;
                res.json(ResultMessageModel.errorMessage(errorMessage));
            
            });
    }
}