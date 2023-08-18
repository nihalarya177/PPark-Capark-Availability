import { TestBed } from '@angular/core/testing';

import { PetrolService } from './petrol.service';

describe('PetrolService', () => {
  let service: PetrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
