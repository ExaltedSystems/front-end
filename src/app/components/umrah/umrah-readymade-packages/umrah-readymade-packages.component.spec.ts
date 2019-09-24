import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmrahReadymadePackagesComponent } from './umrah-readymade-packages.component';

describe('UmrahReadymadePackagesComponent', () => {
  let component: UmrahReadymadePackagesComponent;
  let fixture: ComponentFixture<UmrahReadymadePackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmrahReadymadePackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmrahReadymadePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
