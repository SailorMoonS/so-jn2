import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { filter, mergeMap } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { IsPathExistValidator } from '../services/is-path-exist.validator';
import { ElectronService } from '../core/services';
import { BlendingPathAndRelativePath } from '../../utils/blendingPathAndRelativePath';

@Component({
    selector: 'app-translation-source',
    templateUrl: './translation-source.component.html',
    styleUrls: ['./translation-source.component.scss']
})
export class TranslationSourceComponent implements OnInit {
    @ViewChild('PreparationDirectory') elementPreparationDirectory;
    @ViewChild('PreparationPath') elementPreparationPath;

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
        // const path$ = this.dropZoneService.pathSubject
        //     .pipe(
        //         filter(res => res && res.target === 'source'),
        //         pluck('path'),
        //         switchMap(path => this.pathService.isDir(path).pipe(filter(result => result), mapTo(path)))
        //     );
        // path$.subscribe(path => {
        //     this.controlPreparationDirectoryPath.patchValue(path);
        //     // This is a workaround for update MatFormField state form untouched to touched
        //     this.elementPreparationPath.nativeElement.focus();
        // });
        const parts = this.dropZoneService.pathSubject
            .pipe(
                filter(res => !!res),
                mergeMap(path => this.pathService.isDir(path))
            );
        parts.subscribe(console.log);
        // parts[0].subscribe(console.log);
        // parts[1].subscribe(console.log);
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
