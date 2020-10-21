import { ButtonComponent } from '../elements/button/button.component';
import { InputComponent } from '../elements/input/input.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents:[InputComponent,ButtonComponent]
})
export class DynamicElementsModule { }