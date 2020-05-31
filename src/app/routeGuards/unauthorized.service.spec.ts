import { TestBed } from '@angular/core/testing';

import { UnauthorizedService } from './unauthorized.service';

describe('UnauthorizedService', () => {
  let service: UnauthorizedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnauthorizedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
