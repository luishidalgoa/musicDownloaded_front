import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadInputComponent } from './download-input.component';

describe('DownloadInputComponent', () => {
  let component: DownloadInputComponent;
  let fixture: ComponentFixture<DownloadInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
