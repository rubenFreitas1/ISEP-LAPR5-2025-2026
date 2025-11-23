import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { Organization } from './organization';
import { OrganizationService } from '../../services/organization.service';
import { RepresentativeService } from '../../services/representative.service';
import { ShippingAgentOrganizationWithRepresentativeModel } from '../../models/organization.model';

describe('Organization', () => {
  let component: Organization;
  let fixture: ComponentFixture<Organization>;
  let orgServiceSpy: jasmine.SpyObj<OrganizationService>;
  let repServiceSpy: jasmine.SpyObj<RepresentativeService>;

  beforeEach(async () => {
    orgServiceSpy = jasmine.createSpyObj('OrganizationService', ['getAllOrganizations', 'createOrganization', 'updateOrganization']);
    repServiceSpy = jasmine.createSpyObj('RepresentativeService', ['getRepresentativesByOrganization']);

    orgServiceSpy.getAllOrganizations.and.returnValue(of([]));
    orgServiceSpy.createOrganization.and.returnValue(of({} as any));
    orgServiceSpy.updateOrganization.and.returnValue(of({} as any));
    repServiceSpy.getRepresentativesByOrganization.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Organization, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: OrganizationService, useValue: orgServiceSpy },
        { provide: RepresentativeService, useValue: repServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Organization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load organizations on loadOrganizations', () => {
    const mockOrgs: ShippingAgentOrganizationWithRepresentativeModel[] = [
      { id: 1 as any, code: 'C1', legalName: 'Org 1', alternativeName: '', address: 'A', taxNumber: 'T', representativeName: '', representativeCitizenId: '', representativeNationality: '', representativeEmail: '', representativePhoneNumber: '' }
    ];
    orgServiceSpy.getAllOrganizations.and.returnValue(of(mockOrgs));

    component.loadOrganizations();

    expect(orgServiceSpy.getAllOrganizations).toHaveBeenCalled();
    expect(component.organizations).toEqual(mockOrgs);
    expect(component.filteredOrganizations).toEqual(mockOrgs);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading organizations', () => {
    orgServiceSpy.getAllOrganizations.and.returnValue(throwError(() => new Error('Load error')));

    component.loadOrganizations();

    expect(orgServiceSpy.getAllOrganizations).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.statusMessage).toContain('Error loading organizations');
    expect(component.statusMessageType).toBe('error');
  });

  it('should perform local search and set filteredOrganizations', fakeAsync(() => {
    component.organizations = [
      { id: 2 as any, code: 'X1', legalName: 'SearchOrg', alternativeName: '', address: '', taxNumber: '', representativeName: '', representativeCitizenId: '', representativeNationality: '', representativeEmail: '', representativePhoneNumber: '' }
    ];

    component.searchTerm = 'searchorg';
    component.onSearch();
    tick(300);

    expect(component.filteredOrganizations.length).toBe(1);
  }));

  it('should select organization and load representatives', fakeAsync(() => {
    const org = { id: 3 as any, code: 'C', legalName: 'OrgSel', alternativeName: '', address: '', taxNumber: '', representativeName: '', representativeCitizenId: '', representativeNationality: '', representativeEmail: '', representativePhoneNumber: '' } as any;
    const mockReps = [{ name: 'Rep1', citizenId: 'CID', nationality: 'N', email: 'e', phoneNumber: 'p' } as any];
    repServiceSpy.getRepresentativesByOrganization.and.returnValue(of(mockReps));

    component.selectOrganization(org);
    tick();

    expect(repServiceSpy.getRepresentativesByOrganization).toHaveBeenCalled();
    expect(component.selectedOrganization).toEqual(org);
    expect(component.selectedOrganizationRepresentatives).toEqual(mockReps);

    // selecting same organization toggles off
    component.selectOrganization(org);
    expect(component.selectedOrganization).toBeNull();
  }));

  it('should create new organization when valid', () => {
    component.newOrganization = { code: 'C2', legalName: 'NewOrg', alternativeName: '', address: 'A', taxNumber: 'T' } as any;
    component.newRepresentative = { name: 'R', citizenId: 'CID', nationality: 'N', email: 'e', phoneNumber: 'p' } as any;
    const created = { id: 4 as any, ...component.newOrganization } as any;
    orgServiceSpy.createOrganization.and.returnValue(of(created));

    component.onSaveNewOrganization();

    expect(orgServiceSpy.createOrganization).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('should open edit modal and update organization', () => {
    const sel = { id: 5 as any, code: 'C5', legalName: 'Org5', alternativeName: '', address: 'Addr', taxNumber: 'T5', representativeName: '', representativeCitizenId: '', representativeNationality: '', representativeEmail: '', representativePhoneNumber: '' } as any;
    component.selectedOrganization = sel;

    component.onUpdate();
    expect(component.showEditModal).toBeTrue();

    component.editOrganization = { ...sel } as any;
    component.originalEditOrganization = { ...sel } as any;
    // make a change
    component.editOrganization.legalName = 'Org5 Updated';

    component.onSaveEditOrganization();

    expect(orgServiceSpy.updateOrganization).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });
});
