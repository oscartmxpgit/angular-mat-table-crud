import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTextsComponent } from './help-texts.component';

describe('HelpTextsComponent', () => {
  let component: HelpTextsComponent;
  let fixture: ComponentFixture<HelpTextsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpTextsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
