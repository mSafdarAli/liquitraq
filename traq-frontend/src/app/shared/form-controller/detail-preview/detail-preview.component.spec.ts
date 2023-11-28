import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPreviewComponent } from './detail-preview.component';

describe('DetailPreviewComponent', () => {
  let component: DetailPreviewComponent;
  let fixture: ComponentFixture<DetailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
