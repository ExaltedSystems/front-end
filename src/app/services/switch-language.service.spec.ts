import { TestBed } from '@angular/core/testing';

import { SwitchLanguageService } from './switch-language.service';

describe('SwitchLanguageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwitchLanguageService = TestBed.get(SwitchLanguageService);
    expect(service).toBeTruthy();
  });
});
