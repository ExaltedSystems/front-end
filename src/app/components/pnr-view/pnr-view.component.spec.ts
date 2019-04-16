import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnrViewComponent } from './pnr-view.component';

describe('PnrViewComponent', () => {
  let component: PnrViewComponent;
  let fixture: ComponentFixture<PnrViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnrViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnrViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
