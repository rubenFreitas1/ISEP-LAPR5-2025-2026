import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { Qualification } from './qualification';
import { QualificationService } from '../../services/qualification.service';
import { QualificationModel } from '../../models/qualification.model';

describe('Qualification', () => {
  let component: Qualification;
  let fixture: ComponentFixture<Qualification>;
  let qualServiceSpy: jasmine.SpyObj<QualificationService>;

  beforeEach(async () => {
    qualServiceSpy = jasmine.createSpyObj('QualificationService', ['getAllQualifications', 'getQualificationsByName', 'createQualification', 'updateQualification']);

    qualServiceSpy.getAllQualifications.and.returnValue(of([]));
    qualServiceSpy.getQualificationsByName.and.returnValue(of([]));
    qualServiceSpy.createQualification.and.returnValue(of({ code: 'Q1' } as any));
    qualServiceSpy.updateQualification.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [Qualification, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: QualificationService, useValue: qualServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Qualification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load qualifications on loadQualifications', () => {
    const mock: QualificationModel[] = [ { id: 1 as any, code: 'C1', name: 'Name1', description: 'Desc' } as any ];
    qualServiceSpy.getAllQualifications.and.returnValue(of(mock));

    component.loadQualifications();

    expect(qualServiceSpy.getAllQualifications).toHaveBeenCalled();
    expect(component.qualifications).toEqual(mock);
    expect(component.filteredQualifications).toEqual(mock);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading qualifications', () => {
    qualServiceSpy.getAllQualifications.and.returnValue(throwError(() => new Error('Load error')));

    component.loadQualifications();

    expect(qualServiceSpy.getAllQualifications).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.statusMessage).toContain('Error loading qualifications');
    expect(component.statusMessageType).toBe('error');
  });

  it('should perform local search when match exists', fakeAsync(() => {
    component.qualifications = [ { id: 2 as any, code: 'X', name: 'SearchQ', description: 'd' } as any ];
    component.searchTerm = 'searchq';
    component.onSearch();
    tick(300);
    expect(component.filteredQualifications.length).toBe(1);
  }));

  it('should call remote search when no local results', fakeAsync(() => {
    component.qualifications = [];
    component.searchTerm = 'none';
    qualServiceSpy.getQualificationsByName.and.returnValue(of([]));
    component.onSearch();
    tick(300);
    expect(qualServiceSpy.getQualificationsByName).toHaveBeenCalledWith('none');
  }));

  it('should select and unselect qualification', () => {
    const q = { id: 3 as any, code: 'Q3', name: 'Q3', description: 'd' } as any;
    component.selectQualification(q);
    expect(component.selectedQualification).toEqual(q);
    component.selectQualification(q);
    expect(component.selectedQualification).toBeNull();
  });

  it('should create new qualification when valid', () => {
    component.newQualification = { code: 'NEW', name: 'New', description: 'd' } as any;
    qualServiceSpy.createQualification.and.returnValue(of({ code: 'NEW' } as any));

    component.onSaveNewQualification();

    expect(qualServiceSpy.createQualification).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('should update existing qualification', () => {
    const sel = { id: 5 as any, code: 'C5', name: 'N', description: 'd' } as any;
    component.selectedQualification = sel;
    component.editQualification = { ...sel } as any;
    component.originalEditQualification = { ...sel } as any;
    component.editQualification.name = 'Updated';

    qualServiceSpy.updateQualification.and.returnValue(of({} as any));

    component.onSaveEditQualification();

    expect(qualServiceSpy.updateQualification).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });
});

