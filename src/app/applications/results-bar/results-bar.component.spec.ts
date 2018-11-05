import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsBarComponent } from './results-bar.component';

describe('ResultsBarComponent', () => {
  let component: ResultsBarComponent;
  let fixture: ComponentFixture<ResultsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
