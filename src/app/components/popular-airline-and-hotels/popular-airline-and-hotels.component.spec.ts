import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularAirlineAndHotelsComponent } from './popular-airline-and-hotels.component';

describe('PopularAirlineAndHotelsComponent', () => {
  let component: PopularAirlineAndHotelsComponent;
  let fixture: ComponentFixture<PopularAirlineAndHotelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularAirlineAndHotelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularAirlineAndHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
