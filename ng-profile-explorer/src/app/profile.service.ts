import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { UserProfile } from './entities/user-profile';

@Injectable()
export class ProfileService {
	private baseAPIUrl= 'http://localhost:3000/';
	private apiUrl= 'http://localhost:3000/api/';
	private getUsersUrl= 'users';
	private getProfileUrl= 'user';
	private saveProfileUrl = 'user';
	private backupProfilesUrl = 'backup';
	private uploadProfileImageUrl = 'uploadprofileimage';
	private fullScreenStatusSource = new BehaviorSubject<boolean>(false);
	private profileSectionSaved = new BehaviorSubject<any>({"section": {}, "sectionName": "basicInfo"});

  	constructor(private http: HttpClient) { }

	getUserProfiles():Observable<void> {  
		const url = this.apiUrl + this.getUsersUrl;
		return this.http.get<void>(url);
	}
	
	getUserProfile(userId:string):Observable<void> {  
		const url = this.apiUrl + this.getProfileUrl + '/' + userId;		
		return this.http.get<void>(url);
	}

	getBaseAPIUrl() {
		return this.baseAPIUrl;
	}

	saveUserProfile(userProfile:UserProfile):Observable<void> {
		const url = this.apiUrl + this.saveProfileUrl;		
		return this.http.post<void>(url, userProfile);
	}


	// FullScreen Status
	getFullScreenStatus = this.fullScreenStatusSource.asObservable();

	setFullScreenStatus(status:boolean) {
		this.fullScreenStatusSource.next(status);
	}

	// SectionSaved notification
	onSectionSaved = this.profileSectionSaved.asObservable();
	setSectionSaved(sectionDetail: any) {
		this.profileSectionSaved.next(sectionDetail);
	}

	getProfileImageUrl(userId) {
		return this.apiUrl + 'profileimage/' + userId;
	}

	backupProfiles():Observable<void> {
		const url = this.apiUrl + this.backupProfilesUrl;		
		return this.http.post<void>(url, {});
	}

	uploadProfileImage(profileId:string, profileImageData:any):Observable<void> {
		let fd: FormData = new FormData();
		
		if ( profileImageData && profileImageData.length) {
			for (let i = 0; i < profileImageData.length; i++) {
				fd.append("uploadFile", profileImageData[i], profileImageData[i].name);
			}
		}

		const url = this.apiUrl + this.uploadProfileImageUrl + "/" + profileId;		
		return this.http.post<void>(url, fd);
	}
}
