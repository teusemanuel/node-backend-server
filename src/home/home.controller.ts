/**
 * Created by maraujo on 12/5/16.
 */
/// <reference path="../_all.d.ts" />
"use strict";
import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import {ResultModel, ResultMessageModel} from "../commons/index";
import {Database} from "../db";
import {Configuration} from "../config";
import {Service} from "typedi";

@Service()
export class HomeController {

    public index(req: Request, res: Response, next: NextFunction) {
        res.render('index', {title: 'Node JS API'});
    }

}