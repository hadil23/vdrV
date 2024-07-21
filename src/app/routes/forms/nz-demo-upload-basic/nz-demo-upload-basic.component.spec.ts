import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzDemoUploadBasicComponent } from './nz-demo-upload-basic.component';

describe('NzDemoUploadBasicComponent', () => {
  let component: NzDemoUploadBasicComponent;
  let fixture: ComponentFixture<NzDemoUploadBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzDemoUploadBasicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NzDemoUploadBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
