import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PathService } from '../core/services/path/path.service';
import { catchError, mapTo } from 'rxjs/operators';

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
                mapTo(() => null),
                catchError((err) => {
                    if (err.code === 'ENOENT') {
                        return of({isPathExistValidator: true});
                    }
                    return of({unknownError: true});
                })
            );
        };
    }
}
