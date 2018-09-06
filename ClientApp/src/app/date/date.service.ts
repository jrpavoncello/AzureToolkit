import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

@Injectable()
export class DateService{
    
    constructor(private httpClient: HttpClient){

    }

    public getCurrentDate(): Date{
        this.getCurrentDateFromServer().subscribe((result) => {
            return result.currentDate;
        });

        return new Date();
    }

    public getCurrentDateFromServer(): Observable<IServerResponse> {
        return this.httpClient.get('/serverTime').map(result => {
            return result as IServerResponse;
        });
    }
}

interface IServerResponse{
    currentDate: string;
    currentTime: string;
}