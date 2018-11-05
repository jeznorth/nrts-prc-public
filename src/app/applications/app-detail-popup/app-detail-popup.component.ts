import { Component, Output, EventEmitter } from '@angular/core';
import { Application } from 'app/models/application';
import { ApplicationService } from 'app/services/application.service';
import { CommentPeriodService } from 'app/services/commentperiod.service';
import { ConfigService } from 'app/services/config.service';

@Component({
  selector: 'app-detail-popup',
  templateUrl: './app-detail-popup.component.html',
  styleUrls: ['./app-detail-popup.component.scss']
})

export class AppDetailPopupComponent {
  @Output() setCurrentApp = new EventEmitter(); // to applications component

  public app: Application = null; // set externally (when popup is created)

  constructor(
    public applicationService: ApplicationService, // used in template
    public commentPeriodService: CommentPeriodService, // used in template
    public configService: ConfigService
  ) { }

  public openAppDetail() {
    this.configService.isApplistDetailVisible = true;
    this.setCurrentApp.emit(this.app);
  }
}
