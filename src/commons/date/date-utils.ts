/**
 * Created by maraujo on 12/14/16.
 */
import * as moment from 'moment';

export class DateUtils {


    static _defaultDateTimePattern = "YYYY-MM-DD HH:mm:ss";

    static dateOnlyFormat = "L"; // Locale aware month, year, day
    static timeOnlyFormat = "LT"; // Locale aware time with PM AM


    constructor() {
    }

    static dateTextFromDate(date: Date, dateTimePattern?: string): string {
        if (!dateTimePattern || dateTimePattern.length == 0) {
            dateTimePattern = DateUtils._defaultDateTimePattern;
        }
        return moment(date).format(dateTimePattern);
    }

    static dateOnlyTextFromDate(date: Date, dateTimePattern? : string): string {
        return DateUtils.dateTextFromDate(date, DateUtils.dateOnlyFormat);
    }

    static dateOnlyFromDateText(date: string, dateTimePattern? : string): Date {
        return DateUtils.dateFromDateText(date, DateUtils.dateOnlyFormat);
    }

    static timeOnlyTextFromDate(date: Date, dateTimePattern? : string): string {
        return DateUtils.dateTextFromDate(date, DateUtils.timeOnlyFormat);
    }

    static dateFromDateText(dateText: string, format?: string): Date {
        if (!dateText || dateText.length == 0) {
            return null;
        }
        let out;
        if(format) {
            out = moment(dateText, format);           
        } else {
            out = moment(dateText, this._defaultDateTimePattern);
        }
        if(!out.isValid()){
            out = moment(dateText);
        }

        return out.toDate();
    }

    static dateTextFromNow(dateText): string {

        if (!dateText || dateText.length == 0) {
            return null;
        }
        return moment(dateText, this._defaultDateTimePattern).fromNow();
    }

    static dateTextIsBeforeNow(dateText: string): boolean {
        if (!dateText || dateText.length == 0) {
            return null;
        }
        return moment(dateText, this._defaultDateTimePattern).isBefore(moment());
    }

    static dateTimeFromUTCText(dateText: string): Date {
        if (!dateText || dateText.length == 0) {
            return null;
        }
        return moment.utc(dateText, this._defaultDateTimePattern).toDate();
    }

    static dateTextUTCFromDate(date: Date, format?: string): string {
        return moment.utc(date).format((format ? format : DateUtils._defaultDateTimePattern));
    }

    static dateTextUTCFromDateText(date: string, format?: string): string {
        let d = new Date(date);
        if (date && date.length > 0) {
            return moment.utc(d).format((format ? format : DateUtils._defaultDateTimePattern));
        }
        return date;
    }

    static dateTextFromUTCText(dateText: string, dateTimePattern?: string): string {
        if (!dateTimePattern || dateTimePattern.length == 0) {
            dateTimePattern = DateUtils._defaultDateTimePattern;
        }
        return DateUtils.dateTextFromDate(DateUtils.dateTimeFromUTCText(dateText), dateTimePattern);
    }

    static dateAddDays(date: Date, days: number): Date {
        let tmp = moment(date).add(days, 'days');
        return tmp.toDate();
    }

    static dateAddMonths(date: Date, months: number): Date {
        let tmp = moment(date).add(months, 'months');
        return tmp.toDate();
    }

    static dayOfWeek(date: Date): number {
        let tmp = moment(date);
        return tmp.weekday();
    }

    static isDateValid(year: number, month: number, day: number){
        return moment([year,month,day]).isValid();
    }

    static isValid(date: Date){
        return moment(date).isValid();
    }

    static minutesFromTime(time: string) {
        return moment.duration(time).asMinutes();
    }

    static dateComparison(a: Date, b: Date): number {
        let mA = moment(a);
        let mB = moment(b);
        let out = 0;
        if(mA.isBefore(mB)) {
            out = -1;
        }
        if(mB.isBefore(mA)) {
            out = 1;
        }
        return out;
    }

}