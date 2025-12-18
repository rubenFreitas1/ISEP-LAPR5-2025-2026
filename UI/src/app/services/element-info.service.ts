import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PickableObject } from '../threejs/object-picker';
import { PermissionService } from './permission.service';
import { DocksService } from './docks.service';
import { StorageAreaService } from './storageArea.service';
import { PhysicalResourcesService } from './physicalResources.service';
import { PhysicalResourceKind } from '../models/physicalResources.model';
import { firstValueFrom } from 'rxjs';

export interface ElementInfo {
  name: string;
  type: string;
  description?: string;
  // Restricted info (only for PortAuthority or LogisticOperator)
  status?: string;
  eta?: string;
  etd?: string;
  ongoingOperations?: string[];
  currentCapacity?: number;
  maxCapacity?: number;
  // Dock specific
  location?: string;
  length?: number;
  depth?: number;
  maxDraft?: number;
  vesselTypesAllowed?: string;
  // Storage Area specific
  code?: string;
  storageType?: string;
  utilization?: string;
  // Dock specific (id)
  dockId?: number;
  // Storage Area specific (id)
  storageAreaId?: number;
  // Crane specific
  craneId?: number;
  craneCode?: string;
  craneKind?: string;
  operationalCapacity?: number;
  setupTimeMinutes?: number;
  assignedDockName?: string;
  assignedStorageAreaCode?: string;
  qualifications?: string;
  // Crane list navigation
  cranesList?: any[];
  currentCraneIndex?: number;
  // Common
  lastModified?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ElementInfoService {
  private currentElement$ = new BehaviorSubject<PickableObject | null>(null);
  private elementInfo$ = new BehaviorSubject<ElementInfo | null>(null);
  private overlayVisible$ = new BehaviorSubject<boolean>(false);

  constructor(
    private permissionService: PermissionService,
    private docksService: DocksService,
    private storageAreaService: StorageAreaService,
    private physicalResourcesService: PhysicalResourcesService
  ) {}

  setCurrentElement(element: PickableObject | null) {
    this.currentElement$.next(element);
    if (element) {
      this.loadElementInfo(element);
    } else {
      this.elementInfo$.next(null);
    }
  }

  toggleOverlay() {
    const current = this.overlayVisible$.value;
    const newState = !current;
    this.overlayVisible$.next(newState);
    
    // Reload element info when opening overlay to get fresh data
    if (newState && this.currentElement$.value) {
      this.loadElementInfo(this.currentElement$.value);
    }
  }

  isOverlayVisible(): Observable<boolean> {
    return this.overlayVisible$.asObservable();
  }

  getElementInfo(): Observable<ElementInfo | null> {
    return this.elementInfo$.asObservable();
  }

  private async loadElementInfo(element: PickableObject) {
    const userRole = this.permissionService.getRole();
    const canSeeRestrictedInfo = 
      userRole === 'PortAuthorityOfficer' || 
      userRole === 'LogisticOperator' ||
      userRole === 'Admin';

    console.log('[ElementInfo Debug]', {
      userRole,
      canSeeRestrictedInfo,
      elementType: element.type,
      elementName: element.name,
      elementUserData: (element as any).userData
    });

    let info: ElementInfo = {
      name: element.name,
      type: this.getTypeLabel(element.type),
      description: `${this.getTypeLabel(element.type)} element`
    };

    try {
      switch (element.type) {
        case 'dock':
          info = await this.loadDockInfo(element, canSeeRestrictedInfo);
          break;
        case 'storage-area':
          info = await this.loadStorageAreaInfo(element, canSeeRestrictedInfo);
          break;
        case 'vessel':
          info = await this.loadVesselInfo(element, canSeeRestrictedInfo);
          break;
        case 'crane':
          info = await this.loadCraneInfo(element, canSeeRestrictedInfo);
          break;
        default:
          console.warn('[Loading] Unknown element type:', element.type);
      }
    } catch (error) {
      console.error('Error loading element info:', error);
    }

    this.elementInfo$.next(info);
  }

  private async loadDockInfo(element: PickableObject, canSeeRestricted: boolean): Promise<ElementInfo> {
    try {
      const docks = await firstValueFrom(this.docksService.getAllDocks());

      // Prefer an explicit identifier from userData
      const dockNameFromUserData = (element as any).userData?.dockName;
      const rawMeshName = element.name?.replace(/_/g, ' ').replace(/^Dock\s*/i, '').replace(/\s*Mesh$/i, '').trim();

      let dock = null as any;
      if (dockNameFromUserData) {
        dock = (docks as any[]).find(d => d.name === dockNameFromUserData || d.location === dockNameFromUserData);
      }
      if (!dock) {
        dock = (docks as any[]).find(d => rawMeshName && (rawMeshName.includes(d.name) || (d.location && rawMeshName.includes(d.location))));
      }

      const info: ElementInfo = {
        name: dock?.name || element.name,
        type: 'Dock',
        description: dock?.location ? `Dock located at ${dock.location}` : 'Port docking facility'
      };

      // Load technical info only for authorized users
      if (canSeeRestricted && dock) {
        info.dockId = dock.id;
        info.location = dock.location;
        info.length = dock.length;
        info.depth = dock.depth;
        info.maxDraft = dock.maxDraft;
        info.vesselTypesAllowed = dock.vesselTypesAllowed?.map((vt: any) => vt.name || vt).join(', ') || 'N/A';
        info.lastModified = dock.lastModifiedAt ? new Date(dock.lastModifiedAt).toLocaleDateString() : undefined;
      }

      console.log('[Dock Debug]', { elementName: element.name, dockNameFromUserData, rawMeshName, matched: dock?.name });
      return info;
    } catch (error) {
      console.error('Error loading dock info:', error);
      return {
        name: element.name,
        type: 'Dock',
        description: 'Port docking facility'
      };
    }
  }

  private async loadStorageAreaInfo(element: PickableObject, canSeeRestricted: boolean): Promise<ElementInfo> {
    try {
      // Get all storage areas from backend
      const areas = await firstValueFrom(this.storageAreaService.getAllStorageAreas());
      
      // Find by code (unique identifier)
      let area = null;
      const searchCode = element.userData?.storageAreaCode;
      
      console.log('[StorageArea Debug] Search criteria', {
        searchCode,
        userData: element.userData,
        allAreas: areas.map((a: any) => ({ code: a.code, location: a.location }))
      });
      
      if (searchCode) {
        area = areas.find((a: any) => a.code === searchCode);
      }

      console.log('[StorageArea Debug] Result', {
        canSeeRestricted,
        elementName: element.name,
        foundArea: area ? { code: area.code, location: area.location } : null
      });

      const displayName = area?.location ? area.location : (area?.code || element.name);
      const info: ElementInfo = {
        name: displayName,
        type: 'Storage Area',
        description: area?.code ? `Storage area ${area.code} - ${area.storageAreaType}` : 'Port storage facility'
      };

      // Load technical info only for authorized users
      if (canSeeRestricted && area) {
        info.storageAreaId = area.id;
        info.code = area.code;
        info.location = area.location;
        info.storageType = area.storageAreaType;
        info.currentCapacity = area.currentCapacity;
        info.maxCapacity = area.maxCapacity;
        info.lastModified = area.lastModifiedAt ? new Date(area.lastModifiedAt).toLocaleDateString() : undefined;
        const utilizationPercent = (area.maxCapacity && area.maxCapacity > 0 && area.currentCapacity)
          ? ((area.currentCapacity / area.maxCapacity) * 100).toFixed(1)
          : '0';
        info.utilization = `${utilizationPercent}%`;
        console.log('[StorageArea Info Loaded]', info);
      }

      return info;
    } catch {
      return {
        name: element.name,
        type: 'Storage Area',
        description: 'Port storage facility'
      };
    }
  }

  private async loadVesselInfo(element: PickableObject, canSeeRestricted: boolean): Promise<ElementInfo> {
    const info: ElementInfo = {
      name: element.name,
      type: 'Vessel',
      description: 'Maritime vessel'
    };

    if (canSeeRestricted) {
      // TODO: Fetch from vessel API when available
      info.status = 'Docked';
      info.eta = new Date().toISOString();
      info.etd = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      info.ongoingOperations = ['Loading cargo', 'Refueling'];
    }

    return info;
  }

  private async loadCraneInfo(element: PickableObject, canSeeRestricted: boolean): Promise<ElementInfo> {
    try {
      console.log('[loadCraneInfo] Starting...', { element: element.name, userData: (element as any).userData });
      
      // Fetch all STS cranes and docks from backend
      const stsCranes = await firstValueFrom(this.physicalResourcesService.getPhysicalResourcesByKind(PhysicalResourceKind.STSCrane));
      const docks = await firstValueFrom(this.docksService.getAllDocks());
      console.log('[loadCraneInfo] Fetched STS cranes:', stsCranes.length);

      // Determine which dock/element was selected to get dock name
      let dockName = null;
      
      // If selected from a dock, get the dock name
      if (element.type === 'dock') {
        dockName = element.name;
      } else if (element.type === 'crane') {
        // If selected from crane directly, get from userData (dockName is stored when crane is created)
        dockName = (element as any).userData?.dockName;
        console.log('[loadCraneInfo] Crane selected from dock:', dockName);
      }

      console.log('[loadCraneInfo] Dock name detected:', dockName);

      // Find dock info to get description
      const dockInfo = docks.find((d: any) => d.name === dockName);
      const dockDescription = dockInfo?.location ? `Dock located at ${dockInfo.location}` : 'Port docking facility';

      // Filter cranes by assigned dock (try both assignedArea and assignedDockName fields)
      const cranesForDock = dockName 
        ? (stsCranes as any[]).filter(c => 
            (c.assignedArea === dockName || c.assignedArea?.includes(dockName)) ||
            (c.assignedDockName === dockName || c.assignedDockName?.includes(dockName))
          )
        : stsCranes as any[];

      console.log('[loadCraneInfo] Cranes for dock:', cranesForDock.length, 'All cranes:', stsCranes.map((c: any) => ({ code: c.code, area: c.assignedArea })));

      // Store crane list and get first crane
      const cranesToShow = cranesForDock.length > 0 ? cranesForDock : stsCranes;
      
      let info: ElementInfo = {
        name: cranesToShow.length > 0 ? cranesToShow[0].name : 'STS Crane',
        type: 'Crane',
        description: cranesToShow.length > 0 ? cranesToShow[0].description : 'STS crane equipment',
        cranesList: cranesToShow,
        currentCraneIndex: 0
      };

      // Load first crane info
      if (canSeeRestricted && cranesToShow.length > 0) {
        const currentCrane = cranesToShow[0];
        info.craneId = currentCrane.id;
        info.craneCode = currentCrane.code;
        info.craneKind = currentCrane.kind ? currentCrane.kind.toString() : '';
        info.status = currentCrane.status;
        info.operationalCapacity = currentCrane.operationalCapacity;
        info.setupTimeMinutes = currentCrane.setupTimeMinutes;
        info.assignedDockName = currentCrane.assignedArea || currentCrane.assignedDockName;
        info.assignedStorageAreaCode = currentCrane.assignedStorageAreaCode;
        info.qualifications =
          currentCrane.qualificationCode ||
          (Array.isArray(currentCrane.qualification)
            ? currentCrane.qualification.map((q: any) => q.name || q).join(', ')
            : undefined);
        const lm = (currentCrane.lastModifiedAt || currentCrane.lastModified);
        info.lastModified = lm ? new Date(lm).toLocaleDateString() : undefined;
      }

      return info;
    } catch (error) {
      console.error('Error loading crane info:', error);
      return {
        name: 'STS Cranes',
        type: 'Crane',
        description: 'STS crane equipment'
      };
    }
  }

  nextCrane() {
    const current = this.elementInfo$.value;
    if (!current || !current.cranesList || current.cranesList.length === 0) return;

    let nextIndex = (current.currentCraneIndex || 0) + 1;
    if (nextIndex >= current.cranesList.length) nextIndex = 0;

    this.updateCraneIndex(nextIndex);
  }

  previousCrane() {
    const current = this.elementInfo$.value;
    if (!current || !current.cranesList || current.cranesList.length === 0) return;

    let prevIndex = (current.currentCraneIndex || 0) - 1;
    if (prevIndex < 0) prevIndex = current.cranesList.length - 1;

    this.updateCraneIndex(prevIndex);
  }

  private updateCraneIndex(index: number) {
    const current = this.elementInfo$.value;
    if (!current || !current.cranesList) return;

    const crane = current.cranesList[index];
    const updated: ElementInfo = {
      ...current,
      currentCraneIndex: index,
      name: crane.name,
      description: crane.description,
      craneId: crane.id,
      craneCode: crane.code,
      craneKind: crane.kind ? crane.kind.toString() : '',
      status: crane.status,
      operationalCapacity: crane.operationalCapacity,
      setupTimeMinutes: crane.setupTimeMinutes,
      assignedDockName: crane.assignedArea || crane.assignedDockName,
      assignedStorageAreaCode: crane.assignedStorageAreaCode,
      qualifications:
        crane.qualificationCode ||
        (Array.isArray(crane.qualification)
          ? crane.qualification.map((q: any) => q.name || q).join(', ')
          : undefined),
      lastModified: (crane.lastModifiedAt || crane.lastModified) ? new Date(crane.lastModifiedAt || crane.lastModified).toLocaleDateString() : undefined
    };

    this.elementInfo$.next(updated);
  }

  private getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'dock': 'Dock',
      'storage-area': 'Storage Area',
      'vessel': 'Vessel',
      'crane': 'Crane'
    };
    return labels[type] || type;
  }
}
