import { TestBed, inject } from '@angular/core/testing';
import { ApplicationService } from './application.service';
import { ApiService } from 'app/services/api';
import { DocumentService } from './document.service';
import { CommentPeriodService } from './commentperiod.service';
import { DecisionService } from './decision.service';
import { FeatureService } from './feature.service';

fdescribe('ApplicationService', () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationService,
        { provide: ApiService },
        { provide: DocumentService },
        { provide: CommentPeriodService },
        { provide: DecisionService },
        { provide: FeatureService },
      ]
    });

    service = TestBed.get(ApplicationService);
  });

  it('should be created', inject([ApplicationService], (appService: ApplicationService) => {
    expect(appService).toBeTruthy();
  }));

  describe('getStatusCode()', () => {
    it('with "ABANDONED" status it returns "AB" code', () => {
      expect(service.getStatusCode('ABANDONED')).toEqual(service.ABANDONED);
    });

    it('with "CANCELLED" status it returns "AB" code', () => {
      expect(service.getStatusCode('CANCELLED')).toEqual(service.ABANDONED);
    });

    it('with "OFFER NOT ACCEPTED" status it returns "AB" code', () => {
      expect(service.getStatusCode('OFFER NOT ACCEPTED')).toEqual(service.ABANDONED);
    });

    it('with "OFFER RESCINDED" status it returns "AB" code', () => {
      expect(service.getStatusCode('OFFER RESCINDED')).toEqual(service.ABANDONED);
    });

    it('with "RETURNED" status it returns "AB" code', () => {
      expect(service.getStatusCode('RETURNED')).toEqual(service.ABANDONED);
    });

    it('with "REVERTED" status it returns "AB" code', () => {
      expect(service.getStatusCode('REVERTED')).toEqual(service.ABANDONED);
    });

    it('with "SOLD" status it returns "AB" code', () => {
      expect(service.getStatusCode('SOLD')).toEqual(service.ABANDONED);
    });

    it('with "SUSPENDED" status it returns "AB" code', () => {
      expect(service.getStatusCode('SUSPENDED')).toEqual(service.ABANDONED);
    });

    it('with "WITHDRAWN" status it returns "AB" code', () => {
      expect(service.getStatusCode('WITHDRAWN')).toEqual(service.ABANDONED);
    });

    it('with "ACCEPTED" status it returns "AUR" code', () => {
      expect(service.getStatusCode('ACCEPTED')).toEqual(service.APPLICATION_UNDER_REVIEW);
    });

    it('with "ALLOWED" status it returns "AUR" code', () => {
      expect(service.getStatusCode('ALLOWED')).toEqual(service.APPLICATION_UNDER_REVIEW);
    });

    it('with "PENDING" status it returns "AUR" code', () => {
      expect(service.getStatusCode('PENDING')).toEqual(service.APPLICATION_UNDER_REVIEW);
    });

    it('with "RECEIVED" status it returns "AUR" code', () => {
      expect(service.getStatusCode('RECEIVED')).toEqual(service.APPLICATION_UNDER_REVIEW);
    });

    it('with "OFFER ACCEPTED" status it returns "ARC" code', () => {
      expect(service.getStatusCode('OFFER ACCEPTED')).toEqual(service.APPLICATION_REVIEW_COMPLETE);
    });

    it('with "OFFERED" status it returns "ARC" code', () => {
      expect(service.getStatusCode('OFFERED')).toEqual(service.APPLICATION_REVIEW_COMPLETE);
    });

    it('with "ACTIVE" status it returns "DA" code', () => {
      expect(service.getStatusCode('ACTIVE')).toEqual(service.DECISION_APPROVED);
    });

    it('with "COMPLETED" status it returns "DA" code', () => {
      expect(service.getStatusCode('COMPLETED')).toEqual(service.DECISION_APPROVED);
    });

    it('with "DISPOSITION IN GOOD STANDING" status it returns "DA" code', () => {
      expect(service.getStatusCode('DISPOSITION IN GOOD STANDING')).toEqual(service.DECISION_APPROVED);
    });

    it('with "EXPIRED" status it returns "DA" code', () => {
      expect(service.getStatusCode('EXPIRED')).toEqual(service.DECISION_APPROVED);
    });

    it('with "HISTORIC" status it returns "DA" code', () => {
      expect(service.getStatusCode('HISTORIC')).toEqual(service.DECISION_APPROVED);
    });

    it('with "DISALLOWED" status it returns "DNA" code', () => {
      expect(service.getStatusCode('DISALLOWED')).toEqual(service.DECISION_NOT_APPROVED);
    });

    it('with "NOT USED" status it returns "UN" code', () => {
      expect(service.getStatusCode('NOT USED')).toEqual(service.UNKNOWN);
    });

    it('with "PRE-TANTALIS" status it returns "UN" code', () => {
      expect(service.getStatusCode('PRE-TANTALIS')).toEqual(service.UNKNOWN);
    });

    it('returns "UN" if no status passed', () => {
      expect(service.getStatusCode('')).toEqual(service.UNKNOWN);
    });

    it('returns "UN" if the passed in status is undefined', () => {
      expect(service.getStatusCode(undefined)).toEqual(service.UNKNOWN);
    });

    it('returns "UN" if the passed in status is null', () => {
      expect(service.getStatusCode(null)).toEqual(service.UNKNOWN);
    });
  });

  describe('getTantalisStatus()', () => {
    it('with "AB" status it returns Abandoned codes', () => {
      expect(service.getTantalisStatus(service.ABANDONED)).toEqual(
        ['ABANDONED', 'CANCELLED', 'OFFER NOT ACCEPTED', 'OFFER RESCINDED', 'RETURNED', 'REVERTED', 'SOLD', 'SUSPENDED', 'WITHDRAWN']
      );
    });

    it('with "AUR" status it returns Application Under Review codes', () => {
      expect(service.getTantalisStatus(service.APPLICATION_UNDER_REVIEW)).toEqual(
        ['ACCEPTED', 'ALLOWED', 'PENDING', 'RECEIVED']
      );
    });

    it('with "ARC" status it returns Application Review Complete codes', () => {
      expect(service.getTantalisStatus(service.APPLICATION_REVIEW_COMPLETE)).toEqual(
        ['OFFER ACCEPTED', 'OFFERED']
      );
    });

    it('with "DA" status it returns Decision Approved codes', () => {
      expect(service.getTantalisStatus(service.DECISION_APPROVED)).toEqual(
        ['ACTIVE', 'COMPLETED', 'DISPOSITION IN GOOD STANDING', 'EXPIRED', 'HISTORIC']
      );
    });

    it('with "DNA" status it returns Decision Not Approved codes', () => {
      expect(service.getTantalisStatus(service.DECISION_NOT_APPROVED)).toEqual(
        ['DISALLOWED']
      );
    });
  });

  describe('getShortStatusString()', () => {
    it('with "AB" code it returns "Abandoned" string', () => {
      expect(service.getShortStatusString(service.ABANDONED)).toBe('Abandoned');
    });

    it('with "AUR" code it returns "Under Review" string', () => {
      expect(service.getShortStatusString(service.APPLICATION_UNDER_REVIEW)).toBe('Under Review');
    });

    it('with "ARC" code it returns "Decision Pending" string', () => {
      expect(service.getShortStatusString(service.APPLICATION_REVIEW_COMPLETE)).toBe('Decision Pending');
    });

    it('with "DA" code it returns "Approved" string', () => {
      expect(service.getShortStatusString(service.DECISION_APPROVED)).toBe('Approved');
    });

    it('with "DNA" code it returns "Not Approved" string', () => {
      expect(service.getShortStatusString(service.DECISION_NOT_APPROVED)).toBe('Not Approved');
    });

    it('with "UN" code it returns "Unknown" string', () => {
      expect(service.getShortStatusString(service.UNKNOWN)).toBe('Unknown');
    });
  });

  describe('getLongStatusString()', () => {
    it('with "AB" code it returns "Abandoned" string', () => {
      expect(service.getLongStatusString(service.ABANDONED)).toBe('Abandoned');
    });

    it('with "AUR" code it returns "Application Under Review" string', () => {
      expect(service.getLongStatusString(service.APPLICATION_UNDER_REVIEW)).toBe('Application Under Review');
    });

    it('with "ARC" code it returns "Application Review Complete - Decision Pending" string', () => {
      expect(service.getLongStatusString(service.APPLICATION_REVIEW_COMPLETE)).toBe('Application Review Complete - Decision Pending');
    });

    it('with "DA" code it returns "Decision: Approved - Tenure Issued" string', () => {
      expect(service.getLongStatusString(service.DECISION_APPROVED)).toBe('Decision: Approved - Tenure Issued');
    });

    it('with "DNA" code it returns "Decision: Not Approved" string', () => {
      expect(service.getLongStatusString(service.DECISION_NOT_APPROVED)).toBe('Decision: Not Approved');
    });

    it('with "UN" code it returns "Unknown status" string', () => {
      expect(service.getLongStatusString(service.UNKNOWN)).toBe('Unknown Status');
    });
  });

  describe('getRegionCode()', () => {
    it('returns the two letter abbreviation in the Business Unit string', () => {
      const businessUnit = 'SK - LAND MGMNT - SKEENA FIELD OFFICE';
      expect(service.getRegionCode(businessUnit)).toBe('SK');
    });

    it('returns Undefined if no Business Unit is present', () => {
      expect(service.getRegionCode()).toBeUndefined();
    });
  });

  describe('getRegionString()', () => {
    it('with "CA" code it returns "Cariboo, Williams Lake"', () => {
      expect(service.getRegionString('CA')).toBe('Cariboo, Williams Lake');
    });

    it('with "KO" code it returns "Kootenay, Cranbrook"', () => {
      expect(service.getRegionString('KO')).toBe('Kootenay, Cranbrook');
    });

    it('with "LM" code it returns "Lower Mainland, Surrey"', () => {
      expect(service.getRegionString('LM')).toBe('Lower Mainland, Surrey');
    });

    it('with "OM" code it returns "Omenica/Peace, Prince George"', () => {
      expect(service.getRegionString('OM')).toBe('Omenica/Peace, Prince George');
    });

    it('with "PE" code it returns "Peace, Ft. St. John"', () => {
      expect(service.getRegionString('PE')).toBe('Peace, Ft. St. John');
    });

    it('with "SK" code it returns "Skeena, Smithers"', () => {
      expect(service.getRegionString('SK')).toBe('Skeena, Smithers');
    });

    it('with "SI" code it returns "Thompson Okanagan, Kamloops"', () => {
      expect(service.getRegionString('SI')).toBe('Thompson Okanagan, Kamloops');
    });

    it('with "VI" code it returns "West Coast, Nanaimo"', () => {
      expect(service.getRegionString('VI')).toBe('West Coast, Nanaimo');
    });

    it('returns Null if no code passed', () => {
      expect(service.getRegionString('')).toBeNull();
    });

    it('returns Null if code is not recognized', () => {
      expect(service.getRegionString('WTF')).toBeNull();
    });

    it('returns Null if code is undefined', () => {
      expect(service.getRegionString(undefined)).toBeNull();
    });

    it('returns Null if code is null', () => {
      expect(service.getRegionString(null)).toBeNull();
    });
  });
});
