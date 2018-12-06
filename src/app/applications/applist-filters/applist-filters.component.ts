import { Component, OnInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Constants } from 'app/utils/constants';
import { ApplicationService } from 'app/services/application.service';
import { CommentPeriodService } from 'app/services/commentperiod.service';
import { ConfigService } from 'app/services/config.service';
import { UrlService } from 'app/services/url.service';

export interface FiltersType {
  cpStatuses: Array<string>;
  appStatuses: Array<string>;
  applicant: string;
  clidDtid: string;
  purpose: string;
  subpurpose: string;
  publishFrom: Date;
  publishTo: Date;
}

@Component({
  selector: 'app-applist-filters',
  templateUrl: './applist-filters.component.html',
  styleUrls: ['./applist-filters.component.scss']
})

export class ApplistFiltersComponent implements OnInit, OnDestroy {
  @Output() updateFilters = new EventEmitter(); // to applications component

  readonly minDate = moment('2018-03-23').toDate(); // first app created
  readonly maxDate = moment().toDate(); // today

  public isCpStatusCollapsed = true;
  public isAppStatusCollapsed = true;
  public loading = true; // init
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  // search keys for drop-down menus
  public cpStatusKeys: Array<string> = [];
  public appStatusKeys: Array<string> = [];

  // search keys for text boxes
  private purposeKeys: Array<string> = [];
  private subpurposeKeys: Array<string> = [];

  public applicantFilter: string = null;
  public _applicantFilter: string = null; // temporary filters for Cancel feature

  public clidDtidFilter: number = null;
  public _clidDtidFilter: number = null; // temporary filters for Cancel feature

  public purposeFilter: string = null;
  public _purposeFilter: string = null; // temporary filters for Cancel feature

  public subpurposeFilter: string = null;
  public _subpurposeFilter: string = null; // temporary filters for Cancel feature

  public publishFromFilter: Date = null;
  public _publishFromFilter: Date = null; // temporary filters for Cancel feature

  public publishToFilter: Date = null;
  public _publishToFilter: Date = null; // temporary filters for Cancel feature

  // (arrow) functions to return type-ahead results
  // ref: https://ng-bootstrap.github.io/#/components/typeahead/api
  public purposeSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.purposeKeys.filter(key => key.indexOf(this._purposeFilter.toUpperCase()) > -1) // .slice(0, 10)
      );

  public subpurposeSearch = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 1 ? []
        : this.subpurposeKeys.filter(key => key.indexOf(this._subpurposeFilter.toUpperCase()) > -1) // .slice(0, 10)
      );

  constructor(
    private applicationService: ApplicationService,
    public commentPeriodService: CommentPeriodService, // also used in template
    public configService: ConfigService, // used in template
    private urlService: UrlService,
    private elementRef: ElementRef
  ) {
    // populate the keys we want to display
    this.cpStatusKeys.push(this.commentPeriodService.OPEN);
    this.cpStatusKeys.push(this.commentPeriodService.NOT_OPEN);

    this.appStatusKeys.push(this.applicationService.APPLICATION_UNDER_REVIEW);
    this.appStatusKeys.push(this.applicationService.APPLICATION_REVIEW_COMPLETE);
    this.appStatusKeys.push(this.applicationService.DECISION_APPROVED);
    this.appStatusKeys.push(this.applicationService.DECISION_NOT_APPROVED);
    this.appStatusKeys.push(this.applicationService.ABANDONED);

    Object.getOwnPropertyNames(Constants.subpurposes).forEach(purpose => {
      this.purposeKeys.push(purpose.toUpperCase());
    });

    Object.getOwnPropertyNames(Constants.subpurposes).forEach(purpose => {
      Constants.subpurposes[purpose].forEach(subpurpose => {
        this.subpurposeKeys.push(subpurpose.toUpperCase());
      });
    });

    // watch for URL param changes
    this.urlService.onNavEnd$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        // load initial and updated filters
        this._resetAllFilters(false);
      });
  }

  // full height = top of app-applist-filters.app-filters + height of div.app-filters__header
  get clientHeight(): number {
    return this.elementRef.nativeElement.offsetTop + this.elementRef.nativeElement.firstElementChild.firstElementChild.clientHeight;
  }

  public ngOnInit() { }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getFilters(): FiltersType {
    return {
      cpStatuses: [],
      appStatuses: [],
      applicant: null, // this.applicantFilter && this.applicantFilter.trim() || null, // convert empty string to null
      clidDtid: this.clidDtidFilter ? this.clidDtidFilter.toString() : null,
      purpose: null,
      subpurpose: null,
      publishFrom: null,
      publishTo: null
    };
  }

  //
  // The following are to "Apply" the temporary filters: copy the temporary values to the actual variables, etc.
  //
  public applyClidDtidFilter(doApply: boolean = true) {
    this.clidDtidFilter = this._clidDtidFilter;
    if (doApply) { this._applyAllFilters(); }
  }

  public applyAllFilters(doApply: boolean = true) {
    this.applicantFilter = this._applicantFilter;
    this.clidDtidFilter = this._clidDtidFilter;
    this.purposeFilter = this._purposeFilter;
    this.subpurposeFilter = this._subpurposeFilter;
    this.publishFromFilter = this._publishFromFilter;
    this.publishToFilter = this._publishToFilter;

    if (doApply) { this._applyAllFilters(); }
  }

  private _applyAllFilters() {
    // notify applications component
    this.updateFilters.emit(this.getFilters());

    // save new filters
    this._saveFilters();
  }

  private _saveFilters() {
    this.urlService.save('applicant', this.applicantFilter && this.applicantFilter.trim());
    this.urlService.save('clidDtid', this.clidDtidFilter && this.clidDtidFilter.toString());
    this.urlService.save('purpose', this.purposeFilter && this.purposeFilter.trim());
    this.urlService.save('subpurpose', this.subpurposeFilter && this.subpurposeFilter.trim());
    this.urlService.save('publishFrom', this.publishFromFilter && moment(this.publishFromFilter).format('YYYY-MM-DD'));
    this.urlService.save('publishTo', this.publishToFilter && moment(this.publishToFilter).format('YYYY-MM-DD'));
  }

  //
  // The following are to "Cancel" the temporary filters: just reset the values.
  //
  public cancelAllFilters() {
    this._applicantFilter = this.applicantFilter;
    this._clidDtidFilter = this.clidDtidFilter;
    this._purposeFilter = this.purposeFilter;
    this._subpurposeFilter = this.subpurposeFilter;
    this._publishFromFilter = this.publishFromFilter;
    this._publishToFilter = this.publishToFilter;
  }

  // (re)sets all filters from current URL
  private _resetAllFilters(doApply: boolean) {
    this.applicantFilter = this.urlService.query('applicant');
    this.clidDtidFilter = this.urlService.query('clidDtid') ? +this.urlService.query('clidDtid') : null;
    this.purposeFilter = this.urlService.query('purpose');
    this.subpurposeFilter = this.urlService.query('subpurpose');
    this.publishFromFilter = this.urlService.query('publishFrom') ? moment(this.urlService.query('publishFrom')).toDate() : null;
    this.publishToFilter = this.urlService.query('publishTo') ? moment(this.urlService.query('publishTo')).toDate() : null;

    // copy all data from actual to temporary properties
    this._applicantFilter = this.applicantFilter;
    this._clidDtidFilter = this.clidDtidFilter;
    this._purposeFilter = this.purposeFilter;
    this._subpurposeFilter = this.subpurposeFilter;
    this._publishFromFilter = this.publishFromFilter;
    this._publishToFilter = this.publishToFilter;

    // if called from UI, apply new filters
    // otherwise this was called internally (eg, init)
    if (doApply) { this._applyAllFilters(); }
  }

  //
  // The following are to "Clear" the temporary filters.
  //
  public clearAllFilters() {
    if (this.filterCount() > 0) {
      this._applicantFilter = null;
      this._clidDtidFilter = null;
      this._purposeFilter = null;
      this._subpurposeFilter = null;
      this._publishFromFilter = null;
      this._publishToFilter = null;

      this.applyAllFilters(true);
    }
  }

  public applicantFilterCount(): number {
    const applicantFilter = this.applicantFilter && this.applicantFilter.trim(); // returns null or empty
    return applicantFilter ? 1 : 0;
  }

  public clidDtidFilterCount(): number {
    return (this.clidDtidFilter && this.clidDtidFilter.toString().length > 0) ? 1 : 0;
  }

  public purposeFilterCount(): number {
    const purposeFilter = this.purposeFilter && this.purposeFilter.trim();  // returns null or empty
    return purposeFilter ? 1 : 0;
  }

  public subpurposeFilterCount(): number {
    const subpurposeFilter = this.subpurposeFilter && this.subpurposeFilter.trim();  // returns null or empty
    return subpurposeFilter ? 1 : 0;
  }

  public publishFilterCount(): number {
    return (this.publishFromFilter || this.publishToFilter) ? 1 : 0;
  }

  public filterCount(): number {
    return this.applicantFilterCount()
      + this.clidDtidFilterCount()
      + this.purposeFilterCount()
      + this.subpurposeFilterCount()
      + this.publishFilterCount();
  }

  public onLoadStart() { this.loading = true; }

  public onLoadEnd() { this.loading = false; }
}
