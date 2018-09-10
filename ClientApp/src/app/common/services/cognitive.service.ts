import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AzureHttpClient } from './azureHttpClient';
import { AzureToolkitService } from './azureToolkit.service';
import { BingSearchResponse } from '../models/bingSearchResponse';
import { ComputerVisionRequest, ComputerVisionResponse } from '../models/computerVisionResponse';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class CognitiveService {

    constructor(private http: AzureHttpClient) { }

    searchImages(bingSearchApiKey: string, searchTerm: string): Observable<BingSearchResponse> {
        if (bingSearchApiKey === null) {
            const errorMsg = 'Bing search API key was null.';
            return new ErrorObservable(errorMsg);
        }

        return this.http.get(`https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${searchTerm}`, bingSearchApiKey)
            .map(response => response as BingSearchResponse)
            .catch(this.handleError);
    }

    analyzeImage(computerVisionAPIKey: string, request: ComputerVisionRequest): Observable<ComputerVisionResponse> {
        if (computerVisionAPIKey === null) {
            const errorMsg = 'Bing computer vision API key was null.';
            return new ErrorObservable(errorMsg);
        }

        return this.http.post('https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description,Tags',
            computerVisionAPIKey, request)
            .map(response => response as ComputerVisionResponse)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
