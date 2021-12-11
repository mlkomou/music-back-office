import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {ApiResponse} from "../model/apiResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService {

    apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

    signIn(user: User): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.apiUrl + 'users/login', user);
    }
}
