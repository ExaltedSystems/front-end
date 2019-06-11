import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequstCallBackFormComponent } from './requst-call-back-form.component';

describe('RequstCallBackFormComponent', () => {
  let component: RequstCallBackFormComponent;
  let fixture: ComponentFixture<RequstCallBackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequstCallBackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequstCallBackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
