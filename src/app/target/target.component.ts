import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, pluck } from 'rxjs/operators';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { PathService } from '../core/services/path/path.service';
import { IsPathExistValidator } from '../services/is-path-exist.validator';

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
            asyncValidators: this.isPathExistValidator.isPathExistValidator(),
            updateOn: 'blur'
        });
        this.dropZoneService.pathSubject
            .pipe(
                filter(res => res && res.target === 'target'),
                pluck('path')
            )
            .subscribe(path => {
                this.controlDestinationDirectoryPath.setValue(path);
            });
    }

    onDestinationDirectoryChange(): void {
        const path = this.elementDestinationDirectory.nativeElement.files[0].path;
        this.controlDestinationDirectoryPath.setValue(path);
    }
}
