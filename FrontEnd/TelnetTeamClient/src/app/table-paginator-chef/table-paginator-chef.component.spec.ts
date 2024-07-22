import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePaginatorChefComponent } from './table-paginator-chef.component';

describe('TablePaginatorChefComponent', () => {
  let component: TablePaginatorChefComponent;
  let fixture: ComponentFixture<TablePaginatorChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePaginatorChefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePaginatorChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
