import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { filter, mergeMap, pluck } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { IsPathExistValidator } from '../services/is-path-exist.validator';

@Component({
    selector: 'app-translation-source',
    templateUrl: './translation-source.component.html',
    styleUrls: ['./translation-source.component.scss']
})
export class TranslationSourceComponent implements OnInit {
    @ViewChild('PreparationDirectory') elementPreparationDirectory;
    @ViewChild('PreparationPath') elementPreparationPath;

    testItems: string[] = ['test1', 'test2', 'test3'];
    selection: FormControl = new FormControl();
    controlPreparationDirectoryPath: FormControl;

    constructor(
        private dropZoneService: DropZoneService,
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

    onPreparationDirectoryChange(e): void {
        console.log(e);
        console.log(this.elementPreparationDirectory.nativeElement);
        const path = this.elementPreparationDirectory.nativeElement.files[0].path;
        this.controlPreparationDirectoryPath.setValue(path, {emitEvent: false, onlySelf: true});
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
