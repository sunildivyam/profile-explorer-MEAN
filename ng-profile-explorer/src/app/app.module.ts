import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {DndModule} from 'ng2-dnd';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile.service';
import { BasicInfoFormComponent } from './basic-info-form/basic-info-form.component';
import { EmployersFormComponent } from './employers-form/employers-form.component';
import { SocialMediaFormComponent } from './social-media-form/social-media-form.component';
import { ProjectsFormComponent } from './projects-form/projects-form.component';
import { SkillsFormComponent } from './skills-form/skills-form.component';
import { ExtendedListFormComponent } from './extended-list-form/extended-list-form.component';
import { RatingFormComponent } from './rating-form/rating-form.component';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';
import { EducationFormComponent } from './education-form/education-form.component';
import { AdditionalsFormComponent } from './additionals-form/additionals-form.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProfileComponent,
    BasicInfoFormComponent,
    EmployersFormComponent,
    SocialMediaFormComponent,
    ProjectsFormComponent,
    SkillsFormComponent,
    ExtendedListFormComponent,
    RatingFormComponent,
    ProfilePreviewComponent,
    EducationFormComponent,
    AdditionalsFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DndModule.forRoot()
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
