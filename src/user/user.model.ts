/**
 * Created by maraujo on 12/8/16.
 */

import {deserialize, autoserialize, autoserializeAs} from "cerialize/dist/serialize";
import {DateUtils} from "../commons/date/date-utils";

export class UserModel {

    @autoserialize
    id: number;

    @autoserialize
    name: string;

    @autoserialize
    email:string;

    @deserialize
    password: string;

    birthday: Date;

    @autoserializeAs("photoUrl")
    photo_url: string;

    @autoserialize
    token: string;

    public static OnSerialized(instance : UserModel, json : any) : void {
        json.birthday = DateUtils.dateOnlyTextFromDate(instance.birthday);
    }

    public static OnDeserialized(instance : UserModel, json : any) : void {
        instance.birthday = DateUtils.dateOnlyFromDateText(json.birthday);
    }
}