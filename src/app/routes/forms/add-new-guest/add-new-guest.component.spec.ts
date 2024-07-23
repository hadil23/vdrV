import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGuestComponent } from './add-new-guest.component';

describe('AddNewGuestComponent', () => {
  let component: AddNewGuestComponent;
  let fixture: ComponentFixture<AddNewGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
