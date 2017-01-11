/// <reference path="_all.d.ts" />
"use strict";

require("es6-shim");
require("reflect-metadata");
import * as bodyParser from "body-parser";
import * as express from "express";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import { Application, Router, Request, Response, NextFunction} from "express";
import * as path from "path";
import {Container} from "typedi";

import {Database, DatabaseState} from "./db";
import * as routes from './routes';

/**
 * The server.
 *
 * @class Server
 */
class Server {

    public app: Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //save expressjs application
        //////////////////////////////
        this.app = express();

        //configure application
        ///////////////////////
        this.config();

        //configure routes
        //////////////////
        this.routes();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    private config() {
        //configure jade
        let application: any = this.app; 
        application.set("views", path.join(__dirname, "views"));
        application.set("view engine", "jade");

        //mount logger
        //////////////
        application.use(logger('dev'));
        application.use(cookieParser());

        //mount json form parser
        ////////////////////////
        application.use(bodyParser.json());

        //mount query string parser
        ///////////////////////////
        /*application.use(bodyParser.urlencoded({ extended: true }));*/
        application.use(bodyParser.urlencoded({ extended: false }));

        //add static paths
        //////////////////
        application.use(express.static(path.join(__dirname, "public")));
        application.use(express.static(path.join(__dirname, "bower_components")));
        //app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

        // catch 404 and forward to error handler
        ///////////////////////////////////////////
        application.use(function(err: any, req: Request, res: Response, next: NextFunction) {
            let error: any;
            error = new Error("Not Found");
            error.status = 404;
            next(error);
        });

        // error handler
        //////////////////
        application.use(function(err: any, req: Request, res: Response, next: NextFunction) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            let reqApp: any = req.app;
            res.locals.error = reqApp.get("env") === "development" ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render("error");
        });


        // Connect to MySQL on start
        /////////////////////////////
        let db = Container.get(Database);
        db.connect(Database.MODE_TEST)
            .then((state: DatabaseState) => {
                console.log('connected to MySQL in mode ' + state.mode);
            })
            .catch(error => {
                console.log('Unable to connect to MySQL.');
                console.error(error);
                process.exit(1);
            });
    }

    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {

        //build routes
        ////////////
        routes.bootstrap(this.app);
        
    }
}

export = Server.bootstrap().app;