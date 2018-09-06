import { Injectable } from '@angular/core'
import { Http } from '@angular/http/http'
import { Observable } from 'rxjs/Observable'

@Injectable
export class DateService{
    
    constructor(private http: Http){

    }

    public getCurrentDate(): Date{
        return new Date();
    }

    public getCurrentDateFromServer(): Observable<IServerResponse> {
        return this.http.get('/serverTime').map((result) => {
            return result.json() as IServerResponse
        })
    }
}

interface IServerResponse{
    currentDate: string;
    currentTime: string;
}