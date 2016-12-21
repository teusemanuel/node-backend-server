/**
 * Created by mateus on 11/30/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {SignUpController} from "./signup.controller";
import {RouterConfig, RouterType} from "../routes";
import {Container} from "typedi";


let signup = Container.get(SignUpController);

export const SignUpRoutes: RouterConfig[] = [
    {
        path: 'signUp',
        callback: signup.signUp.bind(signup),
        type: RouterType.POST
    }
];