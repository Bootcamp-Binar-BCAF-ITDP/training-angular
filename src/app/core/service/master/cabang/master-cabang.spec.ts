import { TestBed } from '@angular/core/testing';
import { MasterCabang } from '../../../../features/master-cabang/master-cabang';

describe('MasterCabang', () => {
  let service: MasterCabang;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterCabang);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
