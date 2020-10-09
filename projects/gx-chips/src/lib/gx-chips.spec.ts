import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GxChipsComponent } from "./gx-chips.component";

describe("GxChipsComponent", () => {
  let component: GxChipsComponent;
  let fixture: ComponentFixture<GxChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GxChipsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GxChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
