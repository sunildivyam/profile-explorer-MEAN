import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../profile.service';

import {UserProfile} from '../entities/user-profile';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    profiles: Array<UserProfile>;
    imageBaseUrl: string;

    constructor(private profileService: ProfileService) {
        this.profiles = new Array<UserProfile>(); 
        this.imageBaseUrl = this.profileService.getBaseAPIUrl();
    }

    ngOnInit() {
        this.profileService.getUserProfiles().subscribe((res)=> {
            //Next
            const profiles = res['data'];
            this.profiles = new Array<UserProfile>();
            for (let i = 0; i< profiles.length; i++) {
                profiles[i].basicInfo.profileImage = this.profileService.getProfileImageUrl(profiles[i]._id);
                this.profiles.push(Object.assign(new UserProfile(), profiles[i]));
            }
        }, 
        ()=> {
            //Error 
            this.profiles = new Array<UserProfile>();
        }, ()=> {
            //Complete
        }); 
    }

} 
