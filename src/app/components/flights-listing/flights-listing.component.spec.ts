import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsListingComponent } from './flights-listing.component';

describe('FlightsListingComponent', () => {
  let component: FlightsListingComponent;
  let fixture: ComponentFixture<FlightsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
