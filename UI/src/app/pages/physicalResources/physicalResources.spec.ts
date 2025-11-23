import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { PhysicalResources } from './physicalResources';
import { PhysicalResourcesService } from '../../services/physicalResources.service';
import { QualificationService } from '../../services/qualification.service';
import { StorageAreaService } from '../../services/storageArea.service';
import { DocksService } from '../../services/docks.service';
import { PhysicalResourceModel, PhysicalResourceKind, ResourceStatus } from '../../models/physicalResources.model';

describe('PhysicalResources', () => {
  let component: PhysicalResources;
  let fixture: ComponentFixture<PhysicalResources>;
  let physServiceSpy: jasmine.SpyObj<PhysicalResourcesService>;
  let qualServiceSpy: jasmine.SpyObj<QualificationService>;
  let storageServiceSpy: jasmine.SpyObj<StorageAreaService>;
  let docksServiceSpy: jasmine.SpyObj<DocksService>;

  beforeEach(async () => {
    physServiceSpy = jasmine.createSpyObj('PhysicalResourcesService', ['getAllPhysicalResources', 'getPhysicalResourcesByDescription', 'createPhysicalResource', 'updatePhysicalResource']);
    qualServiceSpy = jasmine.createSpyObj('QualificationService', ['getAllQualifications']);
    storageServiceSpy = jasmine.createSpyObj('StorageAreaService', ['getAllStorageAreas']);
    docksServiceSpy = jasmine.createSpyObj('DocksService', ['getAllDocks']);

    physServiceSpy.getAllPhysicalResources.and.returnValue(of([]));
    physServiceSpy.getPhysicalResourcesByDescription.and.returnValue(of([]));
    physServiceSpy.createPhysicalResource.and.returnValue(of({ code: 'R1' } as any));
    physServiceSpy.updatePhysicalResource.and.returnValue(of({} as any));
    qualServiceSpy.getAllQualifications.and.returnValue(of([]));
    storageServiceSpy.getAllStorageAreas.and.returnValue(of([]));
    docksServiceSpy.getAllDocks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PhysicalResources, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: PhysicalResourcesService, useValue: physServiceSpy },
        { provide: QualificationService, useValue: qualServiceSpy },
        { provide: StorageAreaService, useValue: storageServiceSpy },
        { provide: DocksService, useValue: docksServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load physical resources on loadPhysicalResources', () => {
    const mock: PhysicalResourceModel[] = [
      { id: 1 as any, code: 'PR1', name: 'Res1', description: 'd', kind: PhysicalResourceKind.Other, setupTimeMinutes: 0, operationalCapacity: 1, assignedArea: '', qualificationCode: '', operationalWindow: { startDay:1, endDay:5, startTime:'08:00', endTime:'17:00'}, status: ResourceStatus.Available }
    ];
    physServiceSpy.getAllPhysicalResources.and.returnValue(of(mock));

    component.loadPhysicalResources();

    expect(physServiceSpy.getAllPhysicalResources).toHaveBeenCalled();
    expect(component.physicalResources).toEqual(mock);
    expect(component.filteredPhysicalResources).toEqual(mock);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading physical resources', () => {
    physServiceSpy.getAllPhysicalResources.and.returnValue(throwError(() => new Error('Load error')));

    component.loadPhysicalResources();

    expect(physServiceSpy.getAllPhysicalResources).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.statusMessage).toContain('Error loading physical resources');
  });

  it('should perform local search when matches exist', fakeAsync(() => {
    component.physicalResources = [ { id: 2 as any, code: 'C1', name: 'Alpha', description: '', kind: PhysicalResourceKind.Other, setupTimeMinutes:0, operationalCapacity:1, assignedArea:'', qualificationCode:'', operationalWindow:{startDay:1,endDay:5,startTime:'08:00',endTime:'17:00'}, status: ResourceStatus.Available } ];
    component.searchTerm = 'alpha';
    component.onSearch();
    tick(300);

    expect(component.filteredPhysicalResources.length).toBe(1);
  }));

  it('should call remote search when no local results', fakeAsync(() => {
    component.physicalResources = [];
    component.searchTerm = 'none';
    physServiceSpy.getPhysicalResourcesByDescription.and.returnValue(of([]));

    component.onSearch();
    tick(300);

    expect(physServiceSpy.getPhysicalResourcesByDescription).toHaveBeenCalledWith('none');
  }));

  it('should select and unselect physical resource', () => {
    const r = { id: 3 as any, code: 'C3', name: 'R3', description: '', kind: PhysicalResourceKind.Other, setupTimeMinutes:0, operationalCapacity:1, assignedArea:'', qualificationCode:'', operationalWindow:{startDay:1,endDay:5,startTime:'08:00',endTime:'17:00'}, status: ResourceStatus.Available } as any;
    component.selectPhysicalResource(r);
    expect(component.selectedPhysicalResource).toEqual(r);
    component.selectPhysicalResource(r);
    expect(component.selectedPhysicalResource).toBeNull();
  });

  it('should create new physical resource when valid', () => {
    component.newPhysicalResource = { id: undefined as any, code: 'NEW', name: 'New', description: 'd', kind: PhysicalResourceKind.Other, setupTimeMinutes:0, operationalCapacity:1, assignedArea:'', qualificationCode:'Q', operationalWindow:{startDay:1,endDay:5,startTime:'08:00',endTime:'17:00'}, status: ResourceStatus.Available } as any;
    physServiceSpy.createPhysicalResource.and.returnValue(of({ code: 'NEW' }));

    component.onSaveNewPhysicalResource();

    expect(physServiceSpy.createPhysicalResource).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('should update existing physical resource', () => {
    const sel = { id: 5 as any, code: 'U1', name: 'Up', description: 'd', kind: PhysicalResourceKind.Other, setupTimeMinutes:0, operationalCapacity:1, assignedArea:'', qualificationCode:'Q', operationalWindow:{startDay:1,endDay:5,startTime:'08:00',endTime:'17:00'}, status: ResourceStatus.Available } as any;
    component.selectedPhysicalResource = sel;
    component.editPhysicalResource = { ...sel } as any;
    component.originalEditPhysicalResource = { ...sel } as any;
    component.editPhysicalResource.name = 'Updated';

    physServiceSpy.updatePhysicalResource.and.returnValue(of({}));

    component.onSaveEditPhysicalResource();

    expect(physServiceSpy.updatePhysicalResource).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('getAvailableAreas returns docks for STSCrane and storage areas for Truck', () => {
    component.availableDocks = [ { id:1 as any, name: 'DockA' } as any ];
    component.availableStorageAreas = [ { id:2 as any, code: 'Area1' } as any ];

    component.showCreateModal = true;
    component.newPhysicalResource.kind = PhysicalResourceKind.STSCrane;
    expect(component.getAvailableAreas()).toEqual(['DockA']);

    component.newPhysicalResource.kind = PhysicalResourceKind.Truck;
    expect(component.getAvailableAreas()).toEqual(['Area1']);
  });
});
