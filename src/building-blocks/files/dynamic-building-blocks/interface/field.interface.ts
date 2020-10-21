export interface Validator {
    name: string;
    validator: any;
    message: string;
  }
  export interface FieldConfig {
    type: string;
    inputType?: string;
    for?:string;
    name?: string;
    label?: string;
    placeholder?:string;
    value?: any;
    class?:string;
    divClass?:string;
    tags?:string;
    options?: string[];
    collections?: any;
    action?:string;
    body?:any[];
    validations?: Validator[];
  
  }
  
