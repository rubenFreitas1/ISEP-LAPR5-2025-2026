import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { Staff } from './staff';
import { StaffService } from '../../services/staff.service';
import { QualificationService } from '../../services/qualification.service';

describe('Staff', () => {
  let component: Staff;
  let fixture: ComponentFixture<Staff>;
  let staffServiceSpy: jasmine.SpyObj<StaffService>;
  let qualificationServiceSpy: jasmine.SpyObj<QualificationService>;

  beforeEach(async () => {
    staffServiceSpy = jasmine.createSpyObj('StaffService', ['getAllStaff', 'getStaffByName', 'getStaffById', 'createStaff', 'updateStaff']);
    qualificationServiceSpy = jasmine.createSpyObj('QualificationService', ['getAllQualifications']);

    // Default spies
    staffServiceSpy.getAllStaff.and.returnValue(of([]));
    staffServiceSpy.getStaffByName.and.returnValue(of([]));
    staffServiceSpy.getStaffById.and.returnValue(of({} as any));
    staffServiceSpy.createStaff.and.returnValue(of({} as any));
    staffServiceSpy.updateStaff.and.returnValue(of({} as any));
    qualificationServiceSpy.getAllQualifications.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Staff, RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: StaffService, useValue: staffServiceSpy },
        { provide: QualificationService, useValue: qualificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Staff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads staffs on loadStaffs success', () => {
    const mock = [{ id: 1, name: 'Alice', email: 'a@x.com', phone: '123' }] as any;
    staffServiceSpy.getAllStaff.and.returnValue(of(mock));

    component.loadStaffs();

    expect(staffServiceSpy.getAllStaff).toHaveBeenCalled();
    expect(component.staffs.length).toBe(1);
    expect(component.filteredStaffs.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('handles error when loadStaffs fails', () => {
    staffServiceSpy.getAllStaff.and.returnValue(throwError(() => new Error('boom')));

    component.loadStaffs();

    expect(component.isLoading).toBeFalse();
    expect(component.statusMessageType).toBe('error');
  });

  it('search with no local match triggers server search and shows no-results', fakeAsync(() => {
    component.staffs = [{ id: 1, name: 'Bob', email: 'b@x.com', phone: '555' } as any];
    staffServiceSpy.getStaffByName.and.returnValue(of([]));

    component.searchTerm = 'nomatch';
    component.onSearch();
    tick(350);

    expect(staffServiceSpy.getStaffByName).toHaveBeenCalledWith('nomatch');
    expect(component.filteredStaffs.length).toBe(0);
    expect(component.statusMessageType).toBe('error');
  }));

  it('searchByName returns results', fakeAsync(() => {
    staffServiceSpy.getStaffByName.and.returnValue(of([{ id: 2, name: 'Carol' } as any]));
    component.searchTerm = 'carol';
    component.onSearch();
    tick(350);

    expect(component.filteredStaffs.length).toBe(1);
    expect(component.statusMessageType).not.toBe('error');
  }));

  it('selectStaff fetches full staff when id present', () => {
    const s = { id: 5, name: 'D' } as any;
    staffServiceSpy.getStaffById.and.returnValue(of({ id: 5, name: 'Delta' } as any));

    component.selectStaff(s);

    expect(staffServiceSpy.getStaffById).toHaveBeenCalledWith(5);
    expect(component.selectedStaff?.name).toBe('Delta');
  });

  it('toggleQualificationForNew toggles selection', () => {
    component.selectedQualificationsNew = [];
    component.toggleQualificationForNew('Q1');
    expect(component.selectedQualificationsNew).toContain('Q1');
    component.toggleQualificationForNew('Q1');
    expect(component.selectedQualificationsNew).not.toContain('Q1');
  });
});
