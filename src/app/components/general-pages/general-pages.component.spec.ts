import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPagesComponent } from './general-pages.component';

describe('GeneralPagesComponent', () => {
  let component: GeneralPagesComponent;
  let fixture: ComponentFixture<GeneralPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
