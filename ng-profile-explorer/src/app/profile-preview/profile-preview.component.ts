import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../entities/user-profile';
import { retry } from 'rxjs/operators/retry';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.css']
})
export class ProfilePreviewComponent implements OnInit {
  @Input() profile: UserProfile;

  preview: UserProfile;
  isFullScreen:boolean;

  constructor(private profileService:ProfileService) { 
    this.profile = new UserProfile();
    this.preview = JSON.parse(JSON.stringify(this.profile));
  }

  ngOnInit() {      
    this.profileService.getFullScreenStatus.subscribe((status)=> {
      this.isFullScreen = status;
    });

    this.profileService.onSectionSaved.subscribe((sectionDetail)=> {
      this.profile[sectionDetail.sectionName] = sectionDetail.section;
      this.preview = this.processProfile(JSON.parse(JSON.stringify( this.profile)));
    });
  }

  ngOnChanges() {
    this.preview = this.processProfile(JSON.parse(JSON.stringify( this.profile)));
  }
  
  processProfile(profile) {
    profile.basicInfo.profileImage = this.profileService.getProfileImageUrl(profile._id);
    // Employers
    let totalExperience = {
      years: 0,
      months: 0
    };

    profile.employers.filter((employer:any)=> {
      let toDate;   
      if (!employer.to) {
        toDate = new Date();
        profile.basicInfo.currentDesignation = employer.designation;
      } else {
        toDate = new Date(employer.to);
      }

      let exp = this.dateDiff(employer.from, toDate.toString());
      totalExperience = this.addExperience(totalExperience, exp);
      employer.experience = (exp.years?exp.years + ' years': '') + (exp.years && exp.months? ', ': '') + (exp.months?exp.months + ' months': '');
    });
    profile.basicInfo.experience = (totalExperience.years?totalExperience.years + ' years': '') + (totalExperience.years && totalExperience.months? ', ': '') + (totalExperience.months?totalExperience.months + ' months': '');;
    
    
    // Skills
    profile.skills.filter((skill:any)=> {
      let toDate;   
      if (!skill.to) {
        toDate = new Date();
      } else {
        toDate = new Date(skill.to);
      }

      let exp = this.dateDiff(skill.from, toDate.toString());
      skill.experience = (exp.years?exp.years + ' years': '') + (exp.years && exp.months? ', ': '') + (exp.months?exp.months + ' months': '');
    });


    // Projects
    profile.projects.filter((project:any)=> {
      let toDate;   
      if (!project.to) {
        toDate = new Date();
      } else {
        toDate = new Date(project.to);
      }

      let exp = this.dateDiff(project.from, toDate.toString());
      project.duration = (exp.years?exp.years + ' years': '') + (exp.years && exp.months? ', ': '') + (exp.months?exp.months + ' months': '');
    });


    // Education/Academics
    profile.education.filter((educationItem:any)=> {
      let toDate;   
      if (!educationItem.to) {
        toDate = new Date();
      } else {
        toDate = new Date(educationItem.to);
      }

      let exp = this.dateDiff(educationItem.from, toDate.toString());
      educationItem.duration = (exp.years?exp.years + ' years': '') + (exp.years && exp.months? ', ': '') + (exp.months?exp.months + ' months': '');
    });


    return profile;
  }

  dateDiff(fromDate, toDate) {
    let fDate = new Date(fromDate);
    let tDate = new Date(toDate);
    let fYears = fDate.getFullYear();
    let fMonths = fDate.getMonth();
    let fDays = fDate.getDate();
    
    let tYears = tDate.getFullYear();
    let tMonths = tDate.getMonth();
    let tDays = tDate.getDate();
    
    if (tDays < fDays) {
      tDays+=30;
      tMonths--;
    }
    
    if (tMonths < fMonths) {
      tMonths+=12;
      tYears--;
    }
    let days = tDays - fDays;
    let months = tMonths - fMonths;
    let years = tYears - fYears;
    
    if (days >= 15) {
      months++;		
    }
    
    days = 0;
    
    if (months >=12) {
      years++;
      months = 0;
    }
    return {
      years: years,
      months: months
    };
  }

  addExperience(prevExperience, exp) {
    if (!prevExperience) {
      return exp;
    }

    let tExp = Object.assign({}, prevExperience);
    let m= tExp.months + exp.months;
    let y = tExp.years + exp.years;

    if (m>=12) {
      y++;
      m = m-12;
    }

    tExp.years = y;
    tExp.months = m;

    return tExp;
  }

  onFullScreenClick(event) {
    this.isFullScreen = !this.isFullScreen;
    this.profileService.setFullScreenStatus(this.isFullScreen);
  }
}
