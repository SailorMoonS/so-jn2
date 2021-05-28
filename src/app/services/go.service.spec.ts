import { TestBed } from '@angular/core/testing';

import { GoService } from './go.service';

describe('GoService', () => {
    let service: GoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
