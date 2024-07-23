import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVirtualRoomComponent } from './create-virtual-room.component';

describe('CreateVirtualRoomComponent', () => {
  let component: CreateVirtualRoomComponent;
  let fixture: ComponentFixture<CreateVirtualRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVirtualRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVirtualRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
