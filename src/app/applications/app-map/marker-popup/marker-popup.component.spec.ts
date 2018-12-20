import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxTextOverflowClampModule } from 'ngx-text-overflow-clamp';

import { MarkerPopupComponent } from './marker-popup.component';
import { VarDirective } from 'app/utils/ng-var.directive';
import { ApplicationService } from 'app/services/application.service';
import { CommentPeriodService } from 'app/services/commentperiod.service';

xdescribe('MarkerPopupComponent', () => {
  let component: MarkerPopupComponent;
  let fixture: ComponentFixture<MarkerPopupComponent>;
  const stubApplicationService = {
    getStatusCode() {
      return 'AC';
    },

    isAccepted() {
      return true;
    },

    isDispGoodStanding() { return false; },
    isOffered() { return true; },
    isOfferAccepted() { return true; },
    isAbandoned() { return false; },
    isDisallowed() { return false; },
    isSuspended() { return false; },
    isUnknown() { return false; },
  };

  const stubCommentPeriodService = {
    isOpen() {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MarkerPopupComponent,
        VarDirective
      ],
      imports: [NgxTextOverflowClampModule, RouterTestingModule],
      providers: [
        { provide: ApplicationService, useValue: stubApplicationService },
        { provide: CommentPeriodService, useValue: stubCommentPeriodService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
