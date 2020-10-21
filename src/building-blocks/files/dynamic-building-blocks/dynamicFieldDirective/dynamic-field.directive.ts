import { ButtonComponent } from '../elements/button/button.component';
import { InputComponent } from '../elements/input/input.component';
import { Directive, ComponentFactoryResolver,
          Input,
          OnInit,
          ViewContainerRef } from '@angular/core';
import { FieldConfig } from '../interface/field.interface';
import { FormGroup } from '@angular/forms';

const componentMapper = {
  input: InputComponent ,
  button: ButtonComponent 
};
@Directive({
  selector: '[intgDynamicField]',
  exportAs:'[intgDynamicField]'
})


export class DynamicFieldDirective implements OnInit {

  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {
  }
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]

    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }

}
