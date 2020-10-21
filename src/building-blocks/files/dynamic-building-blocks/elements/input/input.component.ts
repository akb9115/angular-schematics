import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../interface/field.interface';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'intg-input',
  exportAs:'intg-input',
  template: `

  <div class="{{field.divClass}}" [formGroup]="group">
        <div *ngIf="field.label">
            <label class="label">{{field.label}}</label>
        </div>
        <div *ngIf="field.inputType==='text'">
            <input [formControlName]="field.name" field.tags [placeholder]="field.placeholder" [type]="field.inputType" class="{{field.class}}" (click)="changeTouch()">
        </div>
        <div *ngIf="field.inputType==='password'">
            <div *ngIf="show">
                <i class="fa fa-eye pwd_icon" style="color: #337ab7;" title="Hide password" (click)="showOrHidePassword()"></i>
            </div>
            <div *ngIf="!show">
                <i class="fa fa-eye-slash pwd_icon" style="color: #337ab7;" title="Show password" (click)="showOrHidePassword()"></i>
            </div>
            <input [formControlName]="field.name" field.tags [placeholder]="field.placeholder" [type]="show?'text':'password'" class="{{field.class}}" (click)="changeTouch()">


        </div>
    </div>
  
  
  `,
  styles: []
  
})
export class InputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  isTouched=false;
  show:boolean;

  constructor() {
  
   }

  ngOnInit() { 
    this.show=false; 
  }

  changeTouch()
  {
    this.isTouched=true;
  }
  showOrHidePassword(){
    this.show=!this.show
  }
}

