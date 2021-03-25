import { TestBed } from '@angular/core/testing';

import { IsPathExistValidator } from './is-path-exist.validator';

describe('IsPathExistValidator', () => {
    let service: IsPathExistValidator;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IsPathExistValidator);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
