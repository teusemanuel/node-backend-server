/**
 * Created by maraujo on 12/6/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {UsersController} from "./users.controller";
import {RouterConfig, RouterType} from "../routes";
import {Container} from "typedi";


let users = Container.get(UsersController);

export const UsersRoutes: RouterConfig[] = [
    {
        path: 'users',
        callback: users.index.bind(users),
        children: [{
            path: ':id',
            callback: users.getById.bind(users)
        }]
    }
];