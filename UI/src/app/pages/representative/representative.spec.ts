import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { Representative } from './representative';
import { RepresentativeService } from '../../services/representative.service';
import { OrganizationService } from '../../services/organization.service';
import { RepresentativeModel } from '../../models/representative.model';
import { ShippingAgentOrganizationWithRepresentativeModel } from '../../models/organization.model';

describe('Representative', () => {
  let component: Representative;
  let fixture: ComponentFixture<Representative>;
  let repServiceSpy: jasmine.SpyObj<RepresentativeService>;
  let orgServiceSpy: jasmine.SpyObj<OrganizationService>;

  beforeEach(async () => {
    repServiceSpy = jasmine.createSpyObj('RepresentativeService', ['getAllRepresentatives', 'createRepresentative', 'updateRepresentative']);
    orgServiceSpy = jasmine.createSpyObj('OrganizationService', ['getAllOrganizations']);

    repServiceSpy.getAllRepresentatives.and.returnValue(of([]));
    repServiceSpy.createRepresentative.and.returnValue(of({ name: 'Created' } as any));
    repServiceSpy.updateRepresentative.and.returnValue(of({} as any));
    orgServiceSpy.getAllOrganizations.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Representative, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: RepresentativeService, useValue: repServiceSpy },
        { provide: OrganizationService, useValue: orgServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Representative);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load representatives on loadRepresentatives', () => {
    const mock: RepresentativeModel[] = [ { id: 1 as any, organizationName: 'Org', name: 'Rep1', citizenId: 'CID', nationality: 'N', email: 'e', phoneNumber: 'p' } as any ];
    repServiceSpy.getAllRepresentatives.and.returnValue(of(mock));

    component.loadRepresentatives();

    expect(repServiceSpy.getAllRepresentatives).toHaveBeenCalled();
    expect(component.representatives).toEqual(mock);
    expect(component.filteredRepresentatives).toEqual(mock);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading representatives', () => {
    repServiceSpy.getAllRepresentatives.and.returnValue(throwError(() => new Error('Load error')));

    component.loadRepresentatives();

    expect(repServiceSpy.getAllRepresentatives).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.statusMessage).toContain('Error loading representatives');
  });

  it('should perform local search when match exists', fakeAsync(() => {
    component.representatives = [ { id: 2 as any, organizationName: 'OrgX', name: 'Alice', citizenId: 'C1', nationality: 'N', email: 'e', phoneNumber: 'p' } as any ];
    component.searchTerm = 'alice';
    component.onSearch();
    tick(300);
    expect(component.filteredRepresentatives.length).toBe(1);
  }));

  it('should set status message when no search results', fakeAsync(() => {
    component.representatives = [];
    component.searchTerm = 'nope';
    component.onSearch();
    tick(300);
    expect(component.statusMessage).toContain('No results found');
    expect(component.statusMessageType).toBe('error');
  }));

  it('should select and unselect representative', () => {
    const r = { id: 3 as any, organizationName: 'O', name: 'R', citizenId: 'CID', nationality: 'N', email: 'e', phoneNumber: 'p' } as any;
    component.selectRepresentative(r);
    expect(component.selectedRepresentative).toEqual(r);
    component.selectRepresentative(r);
    expect(component.selectedRepresentative).toBeNull();
  });

  it('should create new representative when valid', () => {
    component.newRepresentative = { organizationName: 'Org1', name: 'New', citizenId: 'CID', nationality: 'N', email: 'e', phoneNumber: 'p' } as any;
    repServiceSpy.createRepresentative.and.returnValue(of({ name: 'New' } as any));

    component.onSaveNewRepresentative();

    expect(repServiceSpy.createRepresentative).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('should update representative when valid', () => {
    const sel = { id: 5 as any, organizationName: 'Org5', name: 'R5', citizenId: 'C', nationality: 'N', email: 'e', phoneNumber: 'p' } as any;
    component.selectedRepresentative = sel;
    component.editRepresentative = { ...sel } as any;
    component.originalEditRepresentative = { ...sel } as any;
    component.editRepresentative.name = 'Updated';

    repServiceSpy.updateRepresentative.and.returnValue(of({} as any));

    component.onSaveEditRepresentative();

    expect(repServiceSpy.updateRepresentative).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });
});
