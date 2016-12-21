/**
 * Created by maraujo on 12/6/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";

import {Request, Response, NextFunction} from "express";
import {Service, Inject} from "typedi";
import {ResultModel, ResultMessageModel} from "../commons/index";
import {UserRepository} from "../user/user.repository";
import {UsersRepository} from "./users.repository";
import {UserService} from "../user/user.service";

@Service()
export class UsersController {

    @Inject()
    private userRepository: UserRepository;
    
    @Inject()
    private usersRepository: UsersRepository;

    public index(req: Request, res: Response, next: NextFunction) {
        this.usersRepository.allUsers().then(function (result) {
            
            res.json(ResultModel.successOutcome(result));
        }).catch(function (error) {
            
            let errorMessage: string = error.message;
            res.json(ResultMessageModel.errorMessage(errorMessage));
        });
    }

    public getById(req: Request, res: Response, next: NextFunction) {
        let userId = UserService.loggedUserId(req);
        this.userRepository.getById(userId).then((outcome) =>{

            res.json(ResultModel.successOutcome(outcome));
        }).catch(function (error) {
            
            let errorMessage: string = error.message;
            res.json(ResultMessageModel.errorMessage(errorMessage));
        });
    }
}