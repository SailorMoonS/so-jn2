import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DropZoneService } from '../drop-zone/drop-zone.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('source') source;
    @ViewChild('target') target;
    sourceControl: FormControl;
    targetControl: FormControl;

    constructor(
        private dropZoneService: DropZoneService
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        /**
         * This sequence adjustment is to avoid NG0100: Expression has changed after it was checked
         * TODO: remove setTimeout and link FormControl to StepControl
         */
        setTimeout(() => {
            this.sourceControl = this.source.controlPreparationDirectoryPath;
            this.targetControl = this.target.controlDestinationDirectoryPath;
        }, 0);
    }

    @HostListener('dragenter', ['$event'])
    onDragenter(e: DragEvent): void {
        e.preventDefault();
        this.dropZoneService.openDropZone();
    }
}
