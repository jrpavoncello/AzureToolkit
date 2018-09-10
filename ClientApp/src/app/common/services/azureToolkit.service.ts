import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AzureToolkitService {
    private baseUrl: string;

    constructor(private http: HttpClient, @Inject('BASE_URL')originUrl: string) {
        this.baseUrl = originUrl;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public saveImage(imagePostRequest: { url: string, id: string, encodingFormat: string}): Observable<boolean> {
        return this.http.post<Response>(`${this.baseUrl}api/images`, imagePostRequest)
            .map(response => {
                return response == null ? false : (response as Response).ok;
            }).catch(this.handleError);
    }
}
