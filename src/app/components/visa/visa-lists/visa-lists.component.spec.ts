import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaListsComponent } from './visa-lists.component';

describe('VisaListsComponent', () => {
  let component: VisaListsComponent;
  let fixture: ComponentFixture<VisaListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
