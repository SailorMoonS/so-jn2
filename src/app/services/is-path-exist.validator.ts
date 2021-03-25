import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { PathService } from '../core/services/path/path.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IsPathExistValidator {

    constructor(
        private pathService: PathService
    ) {
    }

    isPathExistValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.pathService.isExist(control.value).pipe(
                map(isExist => isExist ? null : {isPathExistValidator: true}),
                catchError((err, caught) => caught)
            );
        };
    }
}
