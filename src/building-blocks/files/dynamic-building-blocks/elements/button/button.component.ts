import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../interface/field.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'intg-button',
  template: `
  <div [formGroup]="group">
        <button type="submit" class="{{field.class}}">
            <i class="glyphicon glyphicon-log-in"></i>{{field.label}}</button>
    </div>
  `,
  styles: [],
  exportAs:'intg-button'
})
export class ButtonComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
