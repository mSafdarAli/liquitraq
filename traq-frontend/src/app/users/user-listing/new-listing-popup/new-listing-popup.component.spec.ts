import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewListingPopupComponent } from './new-listing-popup.component';

describe('NewListingPopupComponent', () => {
  let component: NewListingPopupComponent;
  let fixture: ComponentFixture<NewListingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewListingPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewListingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
