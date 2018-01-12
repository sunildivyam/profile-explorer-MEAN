import { Component, OnInit, ElementRef, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as $ from 'jquery';

import {ProfileService} from '../profile.service';
import { UserProfile } from '../entities/user-profile';
import { BasicInfo } from '../entities/basic-info';
import { SocialMedia } from '../entities/social-media';
import { Employer } from '../entities/employer';
import { Skill } from '../entities/skill';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  orginalProfile: UserProfile;
  profile: UserProfile;
  imageBaseUrl: string;
  currentSection: string;
  defaultSection = 'basic-info-section';
  isFullScreen: boolean;
  duplicateBtnText: string;

  uploadStatus: boolean;
  isUploading: boolean;
  profileImageData: any;
  failureMessage: string;
  
  private saveProfile(profile: UserProfile, successCb:Function, nextCb:Function, errorCb:Function, propertyName:string) {
    this.profileService.saveUserProfile(profile).subscribe(
      ()=> {
        console.log("Profile Saving...");
        nextCb();
      },
      ()=> {
        console.log("Profile Save Error");
        errorCb();
      },
      ()=> {
        console.log("Profile Save Complete");
        if (propertyName) {
          this.profileService.setSectionSaved({
            "section": profile[propertyName],
            "sectionName": propertyName
          });
        }
        successCb();
      });
  }

  constructor(private profileService: ProfileService, private elementRef: ElementRef, private route:ActivatedRoute, private location:Location, private router: Router) { 
    this.imageBaseUrl = this.profileService.getBaseAPIUrl();    
    this.profile = new UserProfile(); 
    this.duplicateBtnText = "Create New from this Profile";  
        
    this.uploadStatus = undefined;
    this.isUploading = false;  
    this.failureMessage = ""; 
  }

  ngOnInit() {
    this.profileService.getFullScreenStatus.subscribe((status)=> {
      this.isFullScreen = status;
    });


    this.route.url.subscribe(url =>{
      this.profileService.setFullScreenStatus(false);
      this.changeSection(this.defaultSection);
      const id = this.route.snapshot.paramMap.get('userId');    
      this.profileService.getUserProfile(id).subscribe((res)=> {
        //Next     
        this.orginalProfile = Object.assign(new UserProfile(), res['data'])
        this.profile = Object.assign(new UserProfile(), this.orginalProfile); 
        this.duplicateBtnText = "Create New from this Profile";
      },
      ()=>{
        //Error
        this.orginalProfile = new UserProfile();
        this.profile = this.orginalProfile; 
        this.duplicateBtnText = "Create New from this Profile";
      },
      ()=>{
        //Complete
        
      });
    });
  }

  ngAfterViewChecked() {
    // 
  }

  onSectionChange(event, sectionName) {
    event && event.preventDefault();
    this.changeSection(sectionName);
  }

  changeSection(sectionName) {
    const prevSection = this.currentSection;
    this.currentSection = sectionName;
    if (prevSection) $('#' + prevSection).slideUp();
    if (this.currentSection) $('#' + this.currentSection).slideDown();
    if (sectionName==='preview-section') {
      this.profileService.setFullScreenStatus(true);
    }    
  }

  onSaveBasicInfo(event:any) {
    this.orginalProfile.basicInfo = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "basicInfo");
  }
  
  onSaveSocialMedia(event:any) {
    this.orginalProfile.socialMedia = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "socialMedia");
  }  

  onSaveEmployers(event:any) {
    this.orginalProfile.employers = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "employers");
  }  

  onSaveProjects(event) {
    this.orginalProfile.projects = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "projects");
  } 

  onSaveEducation(event) {
    this.orginalProfile.education = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "education");
  } 

  onSaveSkills(event) {
    this.orginalProfile.skills = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "skills");
  }  

  onSaveAdditionals(event) {
    this.orginalProfile.additionals = JSON.parse(JSON.stringify(event.formData));
    this.saveProfile(this.orginalProfile, event.onSaveSuccess, event.onSaveNext, event.onSaveError, "additionals");
  } 

  onDuplicate(event) {
    event && event.preventDefault();
    if (this.duplicateBtnText === 'Duplicating...') {
      return false;
    }
    this.duplicateBtnText = "Duplicating...";
    this.orginalProfile._id = "0";        
    this.saveProfile(this.orginalProfile, ()=> {      
      this.duplicateBtnText = "Create New from this Profile";
      this.router.navigate(["dashboard"]);      
    }, ()=> {}, ()=> {}, "basicInfo");
  }

  //Upload Image
  onUploadClick(event) {
    this.isUploading = true;
    this.uploadStatus = undefined;

    this.profileService.uploadProfileImage(this.profile._id, this.profileImageData).subscribe(
      (res) => {
        this.completeCallback(true, "Uploaded Successfully");  
        console.log(res);    
      }, (err) => {
        console.log(err);
        this.completeCallback(false, err && err.data && err.message); 
      }, ()=>{
        this.completeCallback(true, "Uploaded Successfully Finally");
      }
    );
  };

  completeCallback(status, message?) {
    this.uploadStatus = status;
    this.failureMessage = message || '';
    this.isUploading = false;
  } 

  onFileInputChange(event) {
    if (event.srcElement.files.length <= 0) {
      this.profileImageData = undefined;
      return false;
    }
    this.profileImageData = event.srcElement.files;
  }
}
