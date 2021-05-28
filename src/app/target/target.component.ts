import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { filter, mapTo, switchMap } from 'rxjs/operators';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { IsPathExistValidator } from '../services/is-path-exist.validator';
import { BlendingPathAndRelativePath } from '../../utils/blendingPathAndRelativePath';
import { NEVER } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import { PathService } from '../core/services/path/path.service';

@Component({
    selector: 'app-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
    @ViewChild('DestinationDirectory') elementDestinationDirectory;
    controlDestinationDirectoryPath: FormControl;

    @Input() stepSelectionChange: EventEmitter<StepperSelectionEvent>;

    constructor(
        private dropZoneService: DropZoneService,
        private isPathExistValidator: IsPathExistValidator,
        private pathService: PathService,
    ) {
    }

    ngOnInit(): void {
        this.controlDestinationDirectoryPath = new FormControl(null, {
            validators: Validators.required,
            asyncValidators: this.isPathExistValidator.isPathExistValidator(),
            updateOn: 'blur'
        });

        const path$ = this.dropZoneService.pathSubject.pipe(
            // May use a custom operator instead ? isDirPath() => () => Observable<Path-like>
            switchMap(path => this.pathService.isDir(path).pipe(filter(result => result), mapTo(path)))
        );
        const drop$ = this.stepSelectionChange.pipe(
            switchMap(selection => selection.selectedIndex === 1 ? path$ : NEVER)
        );
        drop$.subscribe((folderPath) => {
            this.controlDestinationDirectoryPath.setValue(folderPath);
        });

        // Pass the VALID path to service. Is this a good way??
        this.controlDestinationDirectoryPath.statusChanges
            .pipe(filter(status => status === 'VALID'))
            .subscribe(() => {
                this.pathService.target$.next(this.controlDestinationDirectoryPath.value);
            });
    }

    onDestinationDirectoryChange(): void {
        const path = this.elementDestinationDirectory.nativeElement.files[0].path;
        const relativePath = this.elementDestinationDirectory.nativeElement.files[0].webkitRelativePath;
        const folderPath = BlendingPathAndRelativePath(path, relativePath);
        this.controlDestinationDirectoryPath.setValue(folderPath, {
            emitEvent: true,
            onlySelf: true
        });
        // clear all value for next use. In case of select same folder twice.
        this.elementDestinationDirectory.nativeElement.value = '';
    }

    getErrorMessage(): string {
        let errorMassage;
        if (this.controlDestinationDirectoryPath.hasError('isPathExistValidator')) {
            errorMassage = 'This path is no longer exist. Update now.';
        }
        if (this.controlDestinationDirectoryPath.hasError('required')) {
            errorMassage = 'Fill in Path.';
        }
        return errorMassage;
    }
}
