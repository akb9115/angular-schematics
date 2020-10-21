import { FieldConfig } from './../dynamic-building-blocks/interface/field.interface';
import { DynamicFormComponent } from './../dynamic-building-blocks/dynamic-form/dynamic-form.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import PropertyValueData from './form-structure/loginFormStructure.json';

@Component({
  selector: 'app-<%= name %>',
  templateUrl: './<%= name %>.component.html',
  styleUrls: ['./<%= name %>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild(DynamicFormComponent, { static: false }) form: DynamicFormComponent;
  regConfig: FieldConfig[];
  returnUrl: string;
  error='';
  stored_properties=PropertyValueData;
  constructor() {}

  ngOnInit() {
    this.regConfig= this.stored_properties as FieldConfig[];
  }

  submit(value: any) {
    alert("username: "+this.form.value.username+",password: "+this.form.value.password)
  }


}
