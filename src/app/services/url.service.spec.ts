import { TestBed, inject } from '@angular/core/testing';
import { UrlService } from './url.service';

describe('UrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlService]
    });
  });

  it('should be created', inject([UrlService], (service: UrlService) => {
    expect(service).toBeTruthy();
  }));
});
