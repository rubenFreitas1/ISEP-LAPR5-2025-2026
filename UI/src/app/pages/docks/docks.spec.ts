import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Docks } from './docks';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { DocksService } from '../../services/docks.service';
import { VesselTypeService } from '../../services/vesselType.service';
import { DocksModel } from '../../models/docks.model';

describe('Docks', () => {
  let component: Docks;
  let fixture: ComponentFixture<Docks>;
  let docksServiceSpy: jasmine.SpyObj<DocksService>;
  let vesselTypeServiceSpy: jasmine.SpyObj<VesselTypeService>;

  beforeEach(async () => {
    docksServiceSpy = jasmine.createSpyObj('DocksService', ['getAllDocks', 'getDocksByName', 'createDock', 'updateDock']);
    vesselTypeServiceSpy = jasmine.createSpyObj('VesselTypeService', ['getAllVesselTypes']);

    docksServiceSpy.getAllDocks.and.returnValue(of([]));
    docksServiceSpy.getDocksByName.and.returnValue(of([]));
    docksServiceSpy.createDock.and.returnValue(of({ id: 1, name: 'Created Dock', location: '', length: 1, depth: 1, maxDraft: 1, vesselTypesAllowed: [] } as any));
    docksServiceSpy.updateDock.and.returnValue(of({ id: 1, name: 'Updated Dock', location: '', length: 1, depth: 1, maxDraft: 1, vesselTypesAllowed: [] } as any));
    vesselTypeServiceSpy.getAllVesselTypes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Docks, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: DocksService, useValue: docksServiceSpy },
        { provide: VesselTypeService, useValue: vesselTypeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Docks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load docks on init', () => {
    const mockDocks: DocksModel[] = [
      { id: 1 as any, name: 'Dock 1', location: 'Loc 1', length: 100, depth: 10, maxDraft: 8, vesselTypesAllowed: [] }
    ];
    docksServiceSpy.getAllDocks.and.returnValue(of(mockDocks));

    component.loadDocks();

    expect(docksServiceSpy.getAllDocks).toHaveBeenCalled();
    expect(component.docks).toEqual(mockDocks);
    expect(component.filteredDocks).toEqual(mockDocks);
  });

  it('should handle error when loading docks', () => {
    docksServiceSpy.getAllDocks.and.returnValue(throwError(() => new Error('Load error')));

    component.loadDocks();

    expect(docksServiceSpy.getAllDocks).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.statusMessage).toContain('Error loading docks');
    expect(component.statusMessageType).toBe('error');
  });

  it('should perform local search when match exists', fakeAsync(() => {
    const mockDocks: DocksModel[] = [
      { id: 2 as any, name: 'Alpha Dock', location: 'Port A', length: 100, depth: 10, maxDraft: 8, vesselTypesAllowed: [] }
    ];
    component.docks = mockDocks;
    component.searchTerm = 'alpha';

    component.onSearch();
    tick(300);

    expect(component.filteredDocks.length).toBe(1);
    expect(component.filteredDocks[0].name).toBe('Alpha Dock');
  }));

  it('should call service search when no local results', fakeAsync(() => {
    component.docks = [];
    component.searchTerm = 'nope';
    docksServiceSpy.getDocksByName.and.returnValue(of([]));

    component.onSearch();
    tick(300);

    expect(docksServiceSpy.getDocksByName).toHaveBeenCalledWith('nope');
  }));

  it('should clear status message after clearStatusMessage timeout', fakeAsync(() => {
    component.statusMessage = 'some error';
    component.statusMessageType = 'error';

    component.clearStatusMessage();
    // clearStatusMessage sets statusHiding true and then clears after 220ms
    expect(component.statusHiding).toBeTrue();
    tick(220);
    expect(component.statusMessage).toBe('');
    expect(component.statusMessageType).toBe('');
    expect(component.statusHiding).toBeFalse();
  }));

  it('should open create modal and create a new dock', () => {
    // Prepare valid newDock and selectedVesselTypes
    component.selectedVesselTypes = ['Type1'];
    component.newDock = { name: 'New', location: 'L', length: 10, depth: 2, maxDraft: 1, vesselTypesAllowed: [] } as DocksModel;

    component.onSaveNewDock();

    expect(docksServiceSpy.createDock).toHaveBeenCalled();
    // After creation the statusMessageType should be success (component sets it)
    expect(component.statusMessageType).toBe('success');
  });

  it('should open edit modal and update dock', () => {
    const selected = { id: 3 as any, name: 'Dock 1', location: 'L', length: 1, depth: 1, maxDraft: 1, vesselTypesAllowed: [] } as DocksModel;
    component.selectedDock = selected;

    component.onUpdate();
    expect(component.showEditModal).toBeTrue();

    component.editDock = { ...selected, name: 'Dock 1 Updated' } as DocksModel;
    component.originalEditDock = { ...selected } as DocksModel;
    component.editSelectedVesselTypes = [];

    component.onSaveEditDock();

    expect(docksServiceSpy.updateDock).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('should select and unselect a dock', () => {
    const d = { id: 4 as any, name: 'Dock 1', location: 'L', length: 1, depth: 1, maxDraft: 1, vesselTypesAllowed: [] } as DocksModel;
    component.selectDock(d);
    expect(component.selectedDock).toEqual(d);
    // selecting same dock toggles off
    component.selectDock(d);
    expect(component.selectedDock).toBeNull();
  });
});
