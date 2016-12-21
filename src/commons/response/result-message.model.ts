/**
 * Created by mateus on 11/27/16.
 */
"use strict";

import {ResultModel} from "./Result.model";

export class ResultMessageModel<T> extends ResultModel<T> {

    message: string;
    errors: Map<string, Array<Error>>;
    errorCode: number;

    constructor(message: string, status: boolean = false, errors: Map<string, Array<Error>> = null, errorCode:number = null) {
        super(null);
        this.message = message;
        this.errors = errors;
        this.errorCode = errorCode;
        this.status = status;
    }

    public static errorMessage<T>(message: string): ResultMessageModel<T> {
        let result = new ResultMessageModel<T>(message);
        delete result["errorCode"];
        delete result["errors"];
        delete result["result"];
        return result;
    }

    public static message<T>(message: string, status: boolean): ResultMessageModel<T> {
        let result = new ResultMessageModel<T>(message, status);
        delete result["errorCode"];
        delete result["errors"];
        delete result["result"];
        return result;
    }
}