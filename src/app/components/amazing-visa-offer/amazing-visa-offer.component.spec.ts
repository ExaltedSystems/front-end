import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazingVisaOfferComponent } from './amazing-visa-offer.component';

describe('AmazingVisaOfferComponent', () => {
  let component: AmazingVisaOfferComponent;
  let fixture: ComponentFixture<AmazingVisaOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmazingVisaOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazingVisaOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
