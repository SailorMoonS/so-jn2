import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { filter, mapTo, startWith, switchMap } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { IsPathExistValidator } from '../services/is-path-exist.validator';
import { ElectronService } from '../core/services';
import { BlendingPathAndRelativePath } from '../../utils/blendingPathAndRelativePath';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import { NEVER } from 'rxjs';

@Component({
    selector: 'app-translation-source',
    templateUrl: './translation-source.component.html',
    styleUrls: ['./translation-source.component.scss']
})
export class TranslationSourceComponent implements OnInit {
    @ViewChild('PreparationDirectory') elementPreparationDirectory;
    @ViewChild('PreparationPath') elementPreparationPath;

    @Input() stepSelectionChange: EventEmitter<StepperSelectionEvent>;
    controlPreparationDirectoryPath: FormControl;

    constructor(
        private dropZoneService: DropZoneService,
        private electron: ElectronService,
        private pathService: PathService,
        private isPathExistValidator: IsPathExistValidator
    ) {
    }

    ngOnInit(): void {
        this.controlPreparationDirectoryPath = new FormControl(null, {
            validators: Validators.required,
            asyncValidators: this.isPathExistValidator.isPathExistValidator(),
            updateOn: 'blur'
        });

        const path$ = this.dropZoneService.pathSubject.pipe(
            // May use a custom operator instead ? isDirPath() => () => Observable<Path-like>
            switchMap(path => this.pathService.isDir(path).pipe(filter(result => result), mapTo(path)))
        );
        const drop$ = this.stepSelectionChange.pipe(
            startWith({selectedIndex: 0}),
            switchMap(selection => selection.selectedIndex === 0 ? path$ : NEVER)
        );
        drop$.subscribe((folderPath) => {
            this.controlPreparationDirectoryPath.setValue(folderPath, {emitEvent: false, onlySelf: true});
        });
    }

    onPreparationDirectoryChange(): void {
        const path = this.elementPreparationDirectory.nativeElement.files[0].path;
        const relativePath =  this.elementPreparationDirectory.nativeElement.files[0].webkitRelativePath;
        const folderPath = BlendingPathAndRelativePath(path, relativePath);
        this.controlPreparationDirectoryPath.setValue(folderPath, {emitEvent: false, onlySelf: true});
    }

    getErrorMessage(): string {
        let errorMassage;
        if (this.controlPreparationDirectoryPath.hasError('isPathExistValidator')) {
            errorMassage = 'This path is no longer exist. Update now.';
        }
        if (this.controlPreparationDirectoryPath.hasError('required')) {
            errorMassage = 'Fill in Path.';
        }
        return errorMassage;
    }
}
