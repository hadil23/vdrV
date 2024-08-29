import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRoomComponent } from './guest-room.component';

describe('GuestRoomComponent', () => {
  let component: GuestRoomComponent;
  let fixture: ComponentFixture<GuestRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
