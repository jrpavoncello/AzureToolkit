import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { SettingsResponse, SettingsRequest } from '../models/settingsResponse';
import { ImagePostRequest } from '../models/imagePostRequest';
import { SavedImage } from '../models/savedImage';

@Injectable()
export class AzureToolkitService {
    private baseUrl: string;

    constructor(private http: HttpClient, @Inject('BASE_URL')originUrl: string) {
        this.baseUrl = originUrl;
    }

    public getSettings(settingsRequest: SettingsRequest): Observable<SettingsResponse> {
        return this.http.post<SettingsResponse>(`${this.baseUrl}api/settings`, settingsRequest)
        .catch(this.handleError);
    }

    public getImages(userId: string): Observable<SavedImage[]> {
        return this.http.get<SavedImage[]>(`${this.baseUrl}/api/images/${userId}`)
            .catch(this.handleError);
    }

    public saveImage(imagePostRequest: ImagePostRequest): Observable<boolean> {
        return this.http.post<Response>(`${this.baseUrl}api/images`, imagePostRequest)
            .map(response => {
                return response == null ? false : (response as Response).ok;
            }).catch(this.handleError);
    }
    
    public searchImage(userId: string, searchTerm: string): Observable<SavedImage[]> {
        return this.http.post<SavedImage[]>(`${this.baseUrl}/api/images/search/${userId}/${searchTerm}`, null)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
