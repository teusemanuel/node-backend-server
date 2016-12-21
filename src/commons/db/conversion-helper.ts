/**
 * Created by maraujo on 12/8/16.
 */
export class ConversionHelper {
    static toInstance<T>(queryObj: any, obj: T) : T {

        if (typeof obj["Converter"] === "function") {
            obj["Converter"](queryObj);
        }
        else {
            for (var propName in queryObj) {
                obj[propName] = queryObj[propName]
            }
        }

        return obj;
    }
}