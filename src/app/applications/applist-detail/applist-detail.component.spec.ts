import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplistDetailComponent } from './applist-detail.component';

describe('ApplistDetailComponent', () => {
  let component: ApplistDetailComponent;
  let fixture: ComponentFixture<ApplistDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApplistDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
