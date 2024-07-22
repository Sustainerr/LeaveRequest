import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpSomeoneComponent } from './add-emp-someone.component';

describe('AddEmpSomeoneComponent', () => {
  let component: AddEmpSomeoneComponent;
  let fixture: ComponentFixture<AddEmpSomeoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmpSomeoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpSomeoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
