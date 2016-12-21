/**
 * Created by mateus on 11/30/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {Request, Response, NextFunction} from "express";
import {Service, Inject} from "typedi";
import {ResultModel, ResultMessageModel} from "../commons/index";
import {UserService, UserModel} from "../user/index";
import {Deserialize} from "cerialize";

@Service()
export class SignUpController {

    @Inject()
    private userService: UserService;

    public signUp(req: Request, res: Response, next: NextFunction) {

        let user: UserModel = Deserialize(req.body, UserModel);

        this.userService.create(user).then(function (result) {

            res.json(ResultModel.success(result));
        }).catch(function (error) {
            
            let errorMessage: string = error.message;
            res.json(ResultMessageModel.errorMessage(errorMessage));
        });
    }

}