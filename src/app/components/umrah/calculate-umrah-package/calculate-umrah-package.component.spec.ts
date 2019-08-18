import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateUmrahPackageComponent } from './calculate-umrah-package.component';

describe('CalculateUmrahPackageComponent', () => {
  let component: CalculateUmrahPackageComponent;
  let fixture: ComponentFixture<CalculateUmrahPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateUmrahPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateUmrahPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
