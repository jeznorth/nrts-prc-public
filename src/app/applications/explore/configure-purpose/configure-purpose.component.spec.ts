import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePurposeComponent } from './configure-purpose.component';

describe('ConfigurePurposeComponent', () => {
  let component: ConfigurePurposeComponent;
  let fixture: ComponentFixture<ConfigurePurposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurePurposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurePurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
