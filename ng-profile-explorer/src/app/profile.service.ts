import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import {User} from './user';


@Injectable()
export class ProfileService {
	private baseAPIUrl= 'http://localhost:3000/api/';
	private getUsersUrl= 'users';

  constructor(private http: HttpClient) { }

  getUserProfiles():Observable<User[]> {  
  	const url = this.baseAPIUrl + this.getUsersUrl;
  	console.log(url);	
  		return this.http.get<User[]>(url);
  }
}
