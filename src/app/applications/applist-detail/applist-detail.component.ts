import { Component, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Application } from 'app/models/application';
import { ConfigService } from 'app/services/config.service';
import { ApplicationService } from 'app/services/application.service';
import { CommentPeriodService } from 'app/services/commentperiod.service';
// import { AddCommentComponent } from 'app/application/add-comment/add-comment.component';

@Component({
  selector: 'app-applist-detail',
  templateUrl: './applist-detail.component.html',
  styleUrls: ['./applist-detail.component.scss']
})
export class ApplistDetailComponent implements OnChanges, OnDestroy {

  @Input() appId: string;

  public isLoading: boolean;
  public application: Application;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  // private ngbModal: NgbModalRef = null;

  constructor(
    // private modalService: NgbModal,
    public configService: ConfigService,
    public applicationService: ApplicationService, // used in template
    public commentPeriodService: CommentPeriodService // used in template
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.application = null;

    // guard against null app ID
    if (changes.appId.currentValue) {
      this.isLoading = true;
      // reload application so we get extra data (documents, decision, features)
      this.applicationService.getById(this.appId, true)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          application => {
            this.isLoading = false;
            this.application = application;
          },
          error => {
            this.isLoading = false;
            console.log('error =', error);
            alert('Uh-oh, couldn\'t load application');
          }
        );
    }
  }

  ngOnDestroy() {
    // if (this.ngbModal) { this.ngbModal.dismiss('component destroyed'); }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // private addComment() {
  //   if (this.application.currentPeriod) {
  //     // open modal
  //     this.ngbModal = this.modalService.open(AddCommentComponent, { backdrop: 'static', size: 'lg' });
  //     // set input parameter
  //     (<AddCommentComponent>this.ngbModal.componentInstance).currentPeriod = this.application.currentPeriod;
  //     // check result
  //     this.ngbModal.result.then((value) => {
  //       // saved
  //       console.log(`Success, value = ${value}`);
  //     }, (reason) => {
  //       // cancelled
  //       console.log(`Cancelled, reason = ${reason}`); // see ModalDismissReasons
  //     });
  //   }
  // }

}
