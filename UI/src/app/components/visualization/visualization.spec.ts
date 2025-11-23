import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortVisualizationComponent } from './visualization';

import * as threeMain from '../../threejs/main';
import * as threePort from '../../threejs/port';
import * as threeSea from '../../threejs/sea';
import * as threeSeaBed from '../../threejs/seaBed';
import * as threeVessel from '../../threejs/vessel';
import * as threeDock from '../../threejs/dock';
import * as threeWarehouse from '../../threejs/warehouse';
import * as threeYard from '../../threejs/yard';
import { PortLayoutService } from '../../services/portLayout.service';
import { TextureService } from '../../services/texture.service';

describe('PortVisualizationComponent', () => {
  let component: PortVisualizationComponent;
  let fixture: ComponentFixture<PortVisualizationComponent>;

  const portLayoutSpy = { getLayout: jasmine.createSpy('getLayout') };
  const textureSpy = { fetchTextureModel: jasmine.createSpy('fetchTextureModel') };

  beforeEach(async () => {
    // Avoid spying on module exports which may be non-writable in the test bundle.
    // Provide service stubs and create the component without triggering heavy three.js lifecycle.
    portLayoutSpy.getLayout.and.returnValue(Promise.resolve({ dockPositions: [], storageAreas: [] }));
    textureSpy.fetchTextureModel.and.returnValue(Promise.resolve({ dock: {}, port: {}, seaBed: {} } as any));

    await TestBed.configureTestingModule({
      imports: [PortVisualizationComponent],
      providers: [
        { provide: PortLayoutService, useValue: portLayoutSpy },
        { provide: TextureService, useValue: textureSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortVisualizationComponent);
    component = fixture.componentInstance;
    // do NOT call fixture.detectChanges() to avoid running ngAfterViewInit (three.js) in the test environment
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    // ensure fixture is destroyed if created
    if (fixture && typeof fixture.destroy === 'function') {
      fixture.destroy();
    }
  });
});
