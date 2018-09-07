import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { User, AADUser } from '../models/user';

@Injectable()
export class UserService {
    private baseUrl: string;
    private aadUser: AADUser;

    constructor(private http: HttpClient, @Inject('BASE_URL')originUrl: string) {
        this.baseUrl = originUrl;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public getUser(): Observable<User> {
        return this.http.get(`${this.baseUrl}.auth/me`)
            .map(response => {
                try {
                    this.aadUser = response[0] as AADUser;

                    const user = new User();
                    user.userId = this.aadUser.user_id;

                    this.aadUser.user_claims.forEach(claim => {
                        switch (claim.typ) {
                            case 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname':
                                user.firstName = claim.val;
                                break;
                            case 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname':
                                user.lastName = claim.val;
                                break;
                        }
                    });

                    return user;
                } catch (Exception) {
                    console.log('Error: ${Exception}');
                }
            }).catch(this.handleError);
    }
}
