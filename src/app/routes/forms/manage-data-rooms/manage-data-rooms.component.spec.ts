import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDataRoomsComponent } from './manage-data-rooms.component';

describe('ManageDataRoomsComponent', () => {
  let component: ManageDataRoomsComponent;
  let fixture: ComponentFixture<ManageDataRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDataRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDataRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
