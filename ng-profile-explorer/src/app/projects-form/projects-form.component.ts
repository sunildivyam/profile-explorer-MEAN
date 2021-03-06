import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {Project} from '../entities/project';


@Component({
  selector: 'projects-form',
  templateUrl: './projects-form.component.html',
  styleUrls: ['./projects-form.component.css']
})
export class ProjectsFormComponent implements OnInit {
  @Input() projects:Array<Project>;
  @Output() onSave = new EventEmitter();

  formData: Array<Project>;
  dragOperationRolesEnabled: boolean;
  saveStarted: boolean;
  saveSuccess: boolean;

  onSaveSuccess() {
    console.log("Projects Saved");
    this.saveStarted = false;
    this.saveSuccess = true;
  }

  onSaveNext() {
    console.log("Projects Saving");
    this.saveStarted = false;
    this.saveSuccess = true;
  }

  onSaveError() {
    console.log("Projects Error occured");
    this.saveStarted = false;
    this.saveSuccess = false;
  }

  constructor() { 
    this.formData = new Array<Project>();
    this.dragOperationRolesEnabled = false;
    this.saveStarted = false;
    this.saveSuccess = null;    
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.formData = JSON.parse(JSON.stringify(this.projects)) || new Array<Project>();
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

  onRemoveClick(event, index) { 
    event && event.preventDefault();  
    this.formData.splice(index, 1); 
  }

  onAddClick(event) { 
    event && event.preventDefault();    
    this.formData.push(new Project());    
  }

  onRolesChange(event, projectIndex) {
    this.formData[projectIndex].roles = event.items;
  }

  onTechnologiesChange(event, projectIndex) {
    this.formData[projectIndex].technologies = event.items;
  }
}
