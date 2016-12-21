/**
 * Created by mateus on 11/25/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {UserController} from "./user.controller";
import {RouterConfig, RouterType} from "../routes";
import {Container} from "typedi";


let user = Container.get(UserController);

export const UserRoutes: RouterConfig[] = [
    {
        path: 'user',
        callback: user.getById.bind(user),
        children: [
            {
                path: 'friends',
                callback: user.getById.bind(user)
            },{
                path: 'providers',
                callback: user.getById.bind(user)
            },
        ]
    },
    {
        path: 'user',
        callback: user.create.bind(user),
        type: RouterType.POST
    },
    {
        path: 'user',
        callback: user.update.bind(user),
        type: RouterType.PUT
    },
    {
        path: 'user',
        callback: user.remove.bind(user),
        type: RouterType.DELETE
    }
];