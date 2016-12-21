/**
 * Created by maraujo on 12/5/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {HomeController} from "./home.controller";
import {RouterConfig, RouterType} from "../routes";
import {Container} from "typedi";


let home = Container.get(HomeController);

export const HomeRoutes: RouterConfig[] = [
    {
        path: '',
        callback: home.index.bind(home),
        restrict: false
    }
];