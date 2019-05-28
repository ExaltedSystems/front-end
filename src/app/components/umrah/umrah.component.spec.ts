import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmrahComponent } from './umrah.component';

describe('UmrahComponent', () => {
  let component: UmrahComponent;
  let fixture: ComponentFixture<UmrahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmrahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmrahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
