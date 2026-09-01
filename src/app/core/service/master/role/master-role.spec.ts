import { TestBed } from '@angular/core/testing';

import { MasterRole } from './master-role';

describe('MasterRole', () => {
  let service: MasterRole;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterRole);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
