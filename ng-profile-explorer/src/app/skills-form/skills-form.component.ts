import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {Skill} from '../entities/skill';


@Component({
  selector: 'skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.css']
})
export class SkillsFormComponent implements OnInit {
  @Input() skills:Array<Skill>;
  @Output() onSave = new EventEmitter();

  formData: Array<Skill>;
  isListMode: boolean;
  saveStarted: boolean;
  saveSuccess: boolean;

  private onSaveSuccess() {
    console.log("Skills Saved");
    this.saveStarted = false;
    this.saveSuccess = true;
  }

  private onSaveNext() {
    console.log("Skills Saving");
    this.saveStarted = false;
    this.saveSuccess = true;
  }

  private onSaveError() {
    console.log("Skills Error occured");
    this.saveStarted = false;
    this.saveSuccess = false;
  }

  constructor() { 
    this.formData = new Array<Skill>();
    this.isListMode = false;
    this.saveStarted = false;
    this.saveSuccess = null;    
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.formData = JSON.parse(JSON.stringify(this.skills)) || new Array<Skill>();
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
    this.formData.push(new Skill());    
  }

  onRatingChange(event, skillIndex) {
    this.formData[skillIndex].rating = event.rating || 0;
  }
}
