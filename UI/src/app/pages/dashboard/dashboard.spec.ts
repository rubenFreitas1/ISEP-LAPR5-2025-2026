import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a calendar with correct number of days', () => {
    const daysInMonth = new Date(component.year, component.month + 1, 0).getDate();
    const flattened = component.weeks.flat();
    const dayCount = flattened.filter(d => d !== null && d !== undefined).length;
    expect(dayCount).toBe(daysInMonth);
  });

  it('should navigate to visualization on goToVisualization', () => {
    component.goToVisualization();
    expect(router.navigate).toHaveBeenCalledWith(['v']);
  });

  it('should go to previous month and adjust year when needed', () => {
    // set to January
    component.month = 0;
    component.year = 2021;
    component.prevMonth();
    expect(component.month).toBe(11);
    expect(component.year).toBe(2020);
  });

  it('should go to next month and adjust year when needed', () => {
    // set to December
    component.month = 11;
    component.year = 2021;
    component.nextMonth();
    expect(component.month).toBe(0);
    expect(component.year).toBe(2022);
  });

  it('monthName should return a non-empty string', () => {
    const name = component.monthName();
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});
