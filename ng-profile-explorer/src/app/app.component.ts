import { Component } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Profile Explorer';
  isFullScreen: boolean;
  backupStarted: boolean;
  backupSuccess: boolean;


  constructor(private profileService: ProfileService) {
    profileService.getFullScreenStatus.subscribe((status)=> {
      this.isFullScreen = status;
    });
  }

  onBackupClick(event) { 
    event && event.preventDefault();   
    if (this.backupStarted === true) {
      return false;
    } 
    this.backupStarted = true;
    this.backupSuccess = null;

    this.profileService.backupProfiles().subscribe(
      ()=> {
        console.log("Backing up...");
        this.backupStarted = false;
        this.backupSuccess = true;
      },
      ()=> {
        console.log("Backup Error");
        this.backupStarted = false;
        this.backupSuccess = false;
      },
      ()=> {
        console.log("Backup Complete");
        this.backupStarted = false;
        this.backupSuccess = true;
      })
  }
}
