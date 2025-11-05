import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Docks } from "./docks";

describe("Docks", () => {
  let component: Docks;
  let fixture: ComponentFixture<Docks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Docks],
    }).compileComponents();

    fixture = TestBed.createComponent(Docks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
