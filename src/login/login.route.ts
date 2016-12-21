/**
 * Created by mateus on 11/30/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {LoginController} from "./login.controller";
import {RouterConfig, RouterType} from "../routes";
import {Container} from "typedi";


let login = Container.get(LoginController);

export const LoginRoutes: RouterConfig[] = [
    {
        path: 'signIn',
        callback: login.signIn.bind(login),
        type: RouterType.POST,
        restrict: false
    }
];