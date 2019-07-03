import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCalculatorComponent } from './tour-calculator.component';

describe('TourCalculatorComponent', () => {
  let component: TourCalculatorComponent;
  let fixture: ComponentFixture<TourCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
