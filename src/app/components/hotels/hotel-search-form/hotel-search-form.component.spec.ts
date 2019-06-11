import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchFormComponent } from './hotel-search-form.component';

describe('HotelSearchFormComponent', () => {
  let component: HotelSearchFormComponent;
  let fixture: ComponentFixture<HotelSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
