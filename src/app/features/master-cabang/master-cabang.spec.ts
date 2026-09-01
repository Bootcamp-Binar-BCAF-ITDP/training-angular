import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCabang } from './master-cabang';

describe('MasterCabang', () => {
  let component: MasterCabang;
  let fixture: ComponentFixture<MasterCabang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterCabang],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterCabang);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
