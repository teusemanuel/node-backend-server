/**
 * Created by mateus on 11/30/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import {Service, Inject} from "typedi";
import {ResultModel, ResultMessageModel} from "../commons/index";
import {Configuration} from "../config";
import {UserModel} from "../user/user.model";
import {UserRepository, UserModel} from "../user/index";

@Service()
export class LoginController {

    @Inject()
    private userRepository: UserRepository;

    public signIn(req: Request, res: Response, next: NextFunction) {
        let email: string =  req.body.email;
        let password: string =  req.body.password;

        this.userRepository.loginUser(email, password).then((user: UserModel) => {

            let token = jwt.sign(user, Configuration.secret, { expiresIn: "2h"/*expires in 24 hours*/});
            user.token = token;
            res.json(ResultModel.success(user));

        }).catch((error) => {

            let errorMessage: string = error.message;
            res.json(ResultMessageModel.errorMessage(errorMessage));

        });

    }

}