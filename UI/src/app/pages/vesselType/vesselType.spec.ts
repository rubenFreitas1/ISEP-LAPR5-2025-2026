import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { VesselType } from './vesselType';
import { VesselTypeService } from '../../services/vesselType.service';

describe('VesselType', () => {
  let component: VesselType;
  let fixture: ComponentFixture<VesselType>;
  let vtServiceSpy: jasmine.SpyObj<VesselTypeService>;

  beforeEach(async () => {
    vtServiceSpy = jasmine.createSpyObj('VesselTypeService', ['getAllVesselTypes', 'getVesselTypeByName', 'createVesselType', 'updateVesselType']);

    vtServiceSpy.getAllVesselTypes.and.returnValue(of([]));
    vtServiceSpy.getVesselTypeByName.and.returnValue(of([] as any));
    vtServiceSpy.createVesselType.and.returnValue(of({} as any));
    vtServiceSpy.updateVesselType.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [VesselType, RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: VesselTypeService, useValue: vtServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VesselType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads vessel types on loadVesselTypes success', () => {
    const arr = [{ id: 1, name: 'T1', description: 'd' } as any];
    vtServiceSpy.getAllVesselTypes.and.returnValue(of(arr));

    component.loadVesselTypes();

    expect(vtServiceSpy.getAllVesselTypes).toHaveBeenCalled();
    expect(component.vesselTypes.length).toBe(1);
    expect(component.filteredVesselTypes.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('handles error when loadVesselTypes fails', () => {
    vtServiceSpy.getAllVesselTypes.and.returnValue(throwError(() => new Error('load fail')));

    component.loadVesselTypes();

    expect(component.isLoading).toBeFalse();
    expect(component.statusMessageType).toBe('error');
  });

  it('performSearch finds local results and clears error', fakeAsync(() => {
    component.vesselTypes = [{ name: 'Alpha', description: 'desc', capacity: 10, maxRows: 1, maxBays: 1, maxTiers: 1 } as any];
    component.searchTerm = 'Alpha';
    component.onSearch();
    tick(350);

    expect(component.filteredVesselTypes.length).toBe(1);
    expect(component.statusMessageType).not.toBe('error');
  }));

  it('searchByName falls back to service and sets no-results', fakeAsync(() => {
    vtServiceSpy.getVesselTypeByName.and.returnValue(of([]));

    component.searchByName('Nope');
    tick();

    expect(component.filteredVesselTypes.length).toBe(0);
    expect(component.statusMessageType).toBe('error');
  }));

  it('onSaveNewVesselType validates and calls createVesselType', () => {
    component.newVesselType = { name: 'N', description: 'd', capacity: 1, maxRows: 1, maxBays: 1, maxTiers: 1 } as any;
    vtServiceSpy.createVesselType.and.returnValue(of({ name: 'N' } as any));

    component.onSaveNewVesselType();

    expect(vtServiceSpy.createVesselType).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });
});
