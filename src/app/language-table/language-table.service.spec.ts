import { TestBed } from '@angular/core/testing';

import { LanguageTableService } from './language-table.service';

describe('LanguageTableService', () => {
    let service: LanguageTableService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LanguageTableService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
