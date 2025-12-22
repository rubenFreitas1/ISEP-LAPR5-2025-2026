import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplementaryTaskCategory } from './complementaryTaskCategory';

describe('ComplementaryTaskCategory', () => {
  let component: ComplementaryTaskCategory;
  let fixture: ComponentFixture<ComplementaryTaskCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplementaryTaskCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplementaryTaskCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
