/**
 * Created by mateus on 12/1/16.
 */
import {Request, Response, NextFunction, Router, RequestHandler, Application} from 'express';
import * as jwt from 'jsonwebtoken';
import {Configuration} from './config';
import {ResultMessageModel} from './commons/index';
import {Database} from "./db";

import {LoginRoutes} from "./login/login.route";
import {UserRoutes} from "./user/user.route";
import {SignUpRoutes} from "./signup/signup.route";
import {HomeRoutes} from "./home/home.route";
import {UsersRoutes} from "./users/users.route";
import {JsonWebTokenError} from "jsonwebtoken";
import {TokenExpiredError} from "jsonwebtoken";
import {NotBeforeError} from "jsonwebtoken";
import {Container} from "typedi";

let db = Container.get(Database);

export interface RouterConfig {
    path: string;
    type?: RouterType;
    callback?: RequestHandler;
    children?: Array<RouterConfig>;
    restrict?: boolean;
    checkRestriction?: Array<RequestHandler>;

}
export const enum RouterType {
    GET,
    POST,
    PUT,
    DELETE
}

export const routes: Array<RouterConfig> = [

    //home page
    ////////////
    ...HomeRoutes,
    
    //login page
    ////////////
    ...LoginRoutes,

    //signUp page
    ////////////
    ...SignUpRoutes,

    //user page
    ////////////
    ...UserRoutes,

    //users page
    ////////////
    ...UsersRoutes
];

function buildRouters(router: Router, routersConfig: Array<RouterConfig>, parentPath?: string): Router {

    for (let routerConf of routersConfig) {

        let path = parentPath ? parentPath + routerConf.path : `/${routerConf.path}`;
        let handlers = [];
        if(routerConf.restrict != false) {
            handlers = routerConf.checkRestriction && routerConf.checkRestriction.length > 0 ? routerConf.checkRestriction : [checkExistAndValidToken]
        }

        handlers.push(routerConf.callback);

        switch (routerConf.type) {
            
            case RouterType.POST:
                router.post(path, handlers);
                break;
            
            case RouterType.PUT:
                router.put(path, handlers);
                break;
            
            case RouterType.DELETE:
                router.delete(path, handlers);
                break;
            
            default:
                router.get(path, handlers);
                break;
        }

        if(routerConf.children && routerConf.children.length > 0) {
            buildRouters(router, routerConf.children, `${path}/`)
        }
    }

    return router;
}


export function checkExistAndValidToken(req: Request, res: Response, next: NextFunction) {
    
    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the tr-access-token header
     *    ...in that order.
     */
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['tr-access-token'];

    if (token) {

        jwt.verify(token, Configuration.secret, {ignoreExpiration: false}, (error, decoded) => {

            if(error) {
                
                console.error('Error on verify token.');
                console.error(error);
                if(error instanceof JsonWebTokenError) {
                    return res.status(403).send(ResultMessageModel.errorMessage('Token not recognized by travelServer.'))
                } else if(error instanceof TokenExpiredError) {
                    return res.status(403).send(ResultMessageModel.errorMessage('Token Expired.'))
                } else if(error instanceof NotBeforeError) {
                    return res.status(403).send(ResultMessageModel.errorMessage(`Token not used before date: ${(error as NotBeforeError).date}.`))    
                } else {
                    return res.status(403).send(ResultMessageModel.errorMessage('Failed to authenticate token.'))
                }
                
            } else {


                db.count('select count(u.id) as userCount from user u where u.id = :id', {id: decoded.id})
                    .then((userCount) => {
                        
                        if (userCount > 0) {
                            let user = decoded;
                            req['user'] = user;
                            return next()
                        } else {
                            console.error('Token not recognized by travelServer.');
                            return res.status(403).send(ResultMessageModel.errorMessage('Token not recognized by travelServer.'));
                        }
                    })
                    .catch((error) => {
                        console.error('Error on valid userToken');
                        console.error(error);
                        return res.status(400).send(ResultMessageModel.errorMessage('No token provided.'));
                    });
            }
        });

    } else {

        return res.status(401).send(ResultMessageModel.errorMessage('No token provided.'));

    }
}

export function bootstrap(app: Application): void {
    let router = buildRouters(Router(), routes);
    let application: any = app;
    application.use('/api/', router);
}