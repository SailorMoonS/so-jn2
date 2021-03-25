import { TestBed } from '@angular/core/testing';

import { DropZoneService } from './drop-zone.service';

describe('DropZoneService', () => {
    let service: DropZoneService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DropZoneService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
