import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelInlineSearchFormComponent } from './hotel-inline-search-form.component';

describe('HotelInlineSearchFormComponent', () => {
  let component: HotelInlineSearchFormComponent;
  let fixture: ComponentFixture<HotelInlineSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelInlineSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelInlineSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
