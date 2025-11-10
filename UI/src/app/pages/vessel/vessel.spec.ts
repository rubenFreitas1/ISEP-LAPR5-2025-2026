import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vessel } from './vessel';

describe('Vessel', () => {
  let component: Vessel;
  let fixture: ComponentFixture<Vessel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vessel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vessel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
