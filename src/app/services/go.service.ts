import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import { filter, map, share, switchMap, takeUntil } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { FileService } from '../core/services/file/file.service';
import { PathWithType } from '../interface/path-with-type.interface';

@Injectable({
    providedIn: 'root'
})
export class GoService {
    reload$ = new Subject();
    stepperChange: Subject<StepperSelectionEvent> = new Subject<StepperSelectionEvent>();
    private files$: Observable<PathWithType[]>;

    constructor(
        private pathService: PathService,
        private fileService: FileService
    ) {
    }

    /**
     * HOT stream: unsubscribe.
     */
    get files(): Observable<PathWithType[]> {
        if (!this.files$) {
            this.files$ = this.stepperChange.pipe(
                takeUntil(this.reload$),
                // 2 stand for last page.
                filter(step => step.selectedIndex === 2),
                switchMap(() => this.pathService.source$),
                map(source => [{type: 'dir', path: source}]),
                this.fileService.readToFiles(),
                share()
            );
        }
        return this.files$;
    }

    forceReload(): void {
        this.reload$.next();
        this.files$ = null;
    }

    clearCache(): void {
        this.files$ = null;
    }
}
