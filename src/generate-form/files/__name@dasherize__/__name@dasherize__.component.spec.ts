import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { <%= classify(name) %>Component } from './<%= classify(name) %>.component';

describe('LoginComponent', () => {
  let component: <%= classify(name) %>Component ;
  let fixture: ComponentFixture<<%= classify(name) %>Component >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>Component  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(name) %>Component );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
