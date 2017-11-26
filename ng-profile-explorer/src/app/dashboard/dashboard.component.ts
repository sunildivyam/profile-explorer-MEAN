import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../profile.service';

import {User} from '../user';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    profiles: User[];

    constructor(private profileService: ProfileService) { }

    ngOnInit() {
        this.profileService.getUserProfiles().subscribe((res)=> {
            this.profiles = res.data;
            console.log(this.profiles);
        }); 
    }

} 
