import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyExpensesComponent } from './weekly-expenses.component';

describe('WeeklyExpensesComponent', () => {
  let component: WeeklyExpensesComponent;
  let fixture: ComponentFixture<WeeklyExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
