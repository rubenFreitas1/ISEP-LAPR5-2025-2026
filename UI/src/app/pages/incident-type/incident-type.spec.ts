import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentType } from './incident-type';

describe('IncidentType', () => {
  let component: IncidentType;
  let fixture: ComponentFixture<IncidentType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
