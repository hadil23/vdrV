import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualDataRoomComponent } from './virtual-data-room.component';

describe('VirtualDataRoomComponent', () => {
  let component: VirtualDataRoomComponent;
  let fixture: ComponentFixture<VirtualDataRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualDataRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualDataRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
