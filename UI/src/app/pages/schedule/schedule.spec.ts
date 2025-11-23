import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Schedule } from './schedule';
import { VesselVisitNotificationService } from '../../services/vesselVisitNotification.service';
import { ScheduleService } from '../../services/schedule.service';
import { VesselVisitNotificationModel, VisitStatus } from '../../models/vesselVisitNotification.model';

describe('Schedule', () => {
  let component: Schedule;
  let fixture: ComponentFixture<Schedule>;
  let vvServiceSpy: jasmine.SpyObj<VesselVisitNotificationService>;
  let scheduleServiceSpy: jasmine.SpyObj<ScheduleService>;

  beforeEach(async () => {
    vvServiceSpy = jasmine.createSpyObj('VesselVisitNotificationService', ['getAllVesselVisitNotifications']);
    scheduleServiceSpy = jasmine.createSpyObj('ScheduleService', ['getScheduleByTargetDay']);

    vvServiceSpy.getAllVesselVisitNotifications.and.returnValue(of([]));
    scheduleServiceSpy.getScheduleByTargetDay.and.returnValue(of({ entries: [] } as any));

    await TestBed.configureTestingModule({
      imports: [Schedule, RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: VesselVisitNotificationService, useValue: vvServiceSpy },
        { provide: ScheduleService, useValue: scheduleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Schedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load only approved notifications', () => {
    const mock: VesselVisitNotificationModel[] = [
      { id: 1 as any, code: 'A', vesselIMO: 'IMO1', visitStatus: VisitStatus.Approved } as any,
      { id: 2 as any, code: 'B', vesselIMO: 'IMO2', visitStatus: VisitStatus.Submitted } as any
    ];
    vvServiceSpy.getAllVesselVisitNotifications.and.returnValue(of(mock));

    component.loadVesselVisitNotifications();

    expect(vvServiceSpy.getAllVesselVisitNotifications).toHaveBeenCalled();
    expect(component.vesselVisitNotifications.length).toBe(1);
    expect(component.filteredNotifications.length).toBe(1);
  });

  it('should handle error when loading notifications', () => {
    vvServiceSpy.getAllVesselVisitNotifications.and.returnValue(throwError(() => new Error('Load error')));

    component.loadVesselVisitNotifications();

    expect(component.isLoading).toBeFalse();
    expect(component.statusMessageType).toBe('error');
  });

  it('should apply filter and set no-results message', fakeAsync(() => {
    component.vesselVisitNotifications = [ { id: 3 as any, code: 'XYZ', vesselIMO: '111', visitStatus: VisitStatus.Approved } as any ];
    component.searchTerm = 'nomatch';
    component.onSearch();
    tick(250);

    expect(component.filteredNotifications.length).toBe(0);
    expect(component.statusMessageType).toBe('error');
  }));

  it('formatDateForDisplay returns empty for falsy', () => {
    expect(component.formatDateForDisplay(undefined)).toBe('');
    expect(component.formatDateForDisplay(null)).toBe('');
  });

  it('runSchedule shows error when no target day', () => {
    component.targetDayLocal = '';
    component.runSchedule();
    expect(component.statusMessageType).toBe('error');
  });

  it('runSchedule handles schedule with entries', fakeAsync(() => {
    component.targetDayLocal = new Date().toISOString();
    const remote = { entries: [ { vesselName: 'V', startTimeIso: new Date().toISOString(), endTimeIso: new Date(Date.now()+3600*1000).toISOString(), assignedCranes: ['C'], staffNames: ['S'] } ] };
    scheduleServiceSpy.getScheduleByTargetDay.and.returnValue(of(remote as any));

    component.runSchedule();
    tick();

    expect(scheduleServiceSpy.getScheduleByTargetDay).toHaveBeenCalled();
    expect(component.scheduleModel).toBeTruthy();
    expect(component.showScheduleModal).toBeTrue();
  }));

  it('getEntryStyle and join helpers work', () => {
    const entry: any = { arrivalTime: new Date(), departureTime: new Date(Date.now()+3600*1000), assignedCrane: ['Cr1'], assignedStaff: ['St1'] };
    component.scheduleModel = { scheduleEntries: [entry] } as any;
    const style = component.getEntryStyle(entry);
    expect(style.left).toContain('%');
    expect(component.joinAssignedCranes(entry)).toContain('Cr1');
    expect(component.joinAssignedStaff(entry)).toContain('St1');
  });
});
