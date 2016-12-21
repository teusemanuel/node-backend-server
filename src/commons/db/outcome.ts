/**
 * Created by maraujo on 12/14/16.
 */
import { Serialize } from "cerialize/dist/serialize";
import { ConversionHelper } from "./conversion-helper";

export class Outcome<T> {


    private result: T;
    private results: Array<T>;

    private resultCount: number;
    
    private serializedResult: any;

    constructor(queryResult: any = null, type: { new(result: any): T ;} = null) {

        if (type && queryResult) {

            // handle arrays
            if (queryResult.constructor === Array) {
                let tempArray: Array<T> = [];
                for (var i = 0; i < queryResult.length; i++) {
                    var newObject = new type(queryResult[i]);
                    tempArray.push(newObject);
                }
                
                this.results = tempArray;
                this.resultCount = tempArray.length;
                
                this.serializedResult = Serialize(this.results);
                
            } else { // handle single object
                this.result = new type(queryResult);
                this.resultCount = 1;
                
                this.serializedResult = Serialize(this.result);
            }
        }
    }

    // GETTERS
    //////////
    hasResult(): boolean {
        return !this.hasNoResult();
    }

    hasNoResult(): boolean {
        return !this.resultCount; // || this.resultCount <= 0;
    }

    size(): number {
        return this.resultCount;
    }

    getResult(): T {
        return this.result;
    }

    getResults(): Array<T> {
        return this.results;
    }

    getSerializedResults() {
        return this.serializedResult;
    }

    // STATIC HELPERS
    /////////////////
    static ResultSuccess<T>(result: T) {
        let outcome = new Outcome<T>(null);
        outcome.resultCount = 1;
        outcome.result = result;
        outcome.serializedResult = Serialize(outcome.result);
        return outcome;
    }

    static ResultsSuccess<T>(results: Array<T>) {
        let outcome = new Outcome<T>(null);
        outcome.resultCount = results ? results.length : 0;
        outcome.results = results;
        outcome.serializedResult = Serialize(outcome.results);
        return outcome;
    }

    //
    static Deserialize<E>(queryResult: any = null, type: { new(): E ;} = null): Outcome<E> {

        let outcome = new Outcome<E>();

        if (type && queryResult) {

            // handle arrays
            if (queryResult.constructor === Array) {
                let results: Array<E> = [];
                for (let object of queryResult) {
                    results.push(ConversionHelper.toInstance(object, Object.create(new (<any>type)())))
                }

                outcome.results = results;
                outcome.resultCount = results.length;

                outcome.serializedResult = Serialize(outcome.results);

            } else {
                outcome.result = ConversionHelper.toInstance(queryResult, new (<any>type)());
                outcome.resultCount = 1;

                outcome.serializedResult = Serialize(outcome.result);
            }
        }

        return outcome;
    }

    static Error<E>(): Outcome<E> {
        return new Outcome<E>();
    }
}