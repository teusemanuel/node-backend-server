/**
 * Created by mateus on 11/27/16.
 */

import {Outcome} from "../db/outcome";
import { Serialize } from "cerialize/dist/serialize";

export class ResultModel<T> {

    result: T;
    status: boolean;

    constructor(result: T = null, status: boolean = true) {
        this.result = result;
        this.status = status;
    }

    public static success<T>(result: T): ResultModel<T> {
        return new ResultModel(Serialize(result));
    }

    public static successOutcome<T>(resultOut: Outcome<T>): ResultModel<T> {
        let result = null;
        if(resultOut.hasResult()) {
            result = resultOut.getSerializedResults();
        }
        return new ResultModel(result);
    }
}