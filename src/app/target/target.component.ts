import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { IsPathExistValidator } from '../services/is-path-exist.validator';
import { BlendingPathAndRelativePath } from '../../utils/blendingPathAndRelativePath';

@Component({
    selector: 'app-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
    @ViewChild('DestinationDirectory') elementDestinationDirectory;
    controlDestinationDirectoryPath: FormControl;

    constructor(
        private dropZoneService: DropZoneService,
        private isPathExistValidator: IsPathExistValidator
    ) {
    }

    ngOnInit(): void {
        this.controlDestinationDirectoryPath = new FormControl(null, {
            validators: Validators.required,
            asyncValidators: this.isPathExistValidator.isPathExistValidator(),
            updateOn: 'blur'
        });
        this.dropZoneService.pathSubject
            .pipe(
                filter(res => !!res)
            )
            .subscribe(path => {
                this.controlDestinationDirectoryPath.setValue(path);
            });
    }

    onDestinationDirectoryChange(): void {
        const path = this.elementDestinationDirectory.nativeElement.files[0].path;
        const relativePath =  this.elementDestinationDirectory.nativeElement.files[0].webkitRelativePath;
        const folderPath = BlendingPathAndRelativePath(path, relativePath);
        this.controlDestinationDirectoryPath.setValue(folderPath, {emitEvent: false, onlySelf: true});
    }
}
