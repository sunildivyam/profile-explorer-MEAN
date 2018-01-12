import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {BasicInfo} from '../entities/basic-info';
import { ProfileService } from '../profile.service';


@Component({
  selector: 'basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.css']
})
export class BasicInfoFormComponent implements OnInit {
  @Input() info:BasicInfo;
  @Output() onSave = new EventEmitter<BasicInfo>();

  formData: BasicInfo;
  saveStarted: boolean;
  saveSuccess: boolean;
  

  onSaveSuccess() {
    console.log("Basic info Saved");
    this.saveStarted = false;
    this.saveSuccess = true;
  }

  onSaveNext() {
    console.log("Basic info Saving");
    this.saveStarted = false;
    this.saveSuccess = true;
  }

  onSaveError() {
    console.log("Basic info Error occured");
    this.saveStarted = false;
    this.saveSuccess = false;
  }

  constructor(private profileService: ProfileService) {
    this.formData = new BasicInfo();
    this.saveStarted = false;
    this.saveSuccess = null;
   }

  ngOnInit() {
  }

  ngOnChanges() {
    this.formData = JSON.parse(JSON.stringify(this.info)) || new BasicInfo();
  }

  onSaveClick(event) { 
    if (this.saveStarted === true) {
      return false;
    } 
    
    this.saveStarted = true;
    this.saveSuccess = null;

    event && event.preventDefault();
    event.formData = this.formData;
    event.onSaveSuccess = this.onSaveSuccess.bind(this);
    event.onSaveNext = this.onSaveNext.bind(this);
    event.onSaveError = this.onSaveError.bind(this);

    this.onSave.emit(event);       
  }
}
