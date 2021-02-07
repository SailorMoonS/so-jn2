import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DropZoneService } from '../drop-zone/drop-zone.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('PreparationDirectory') elementPreparationDirectory;
    testItems: string[] = ['test1', 'test2', 'test3'];
    selection: FormControl = new FormControl();
    controlPreparationDirectoryPath: FormControl = new FormControl();

    constructor(
        private dropZoneService: DropZoneService
    ) {
    }

    ngOnInit(): void {
        this.selection.valueChanges.subscribe(console.log);
    }

    @HostListener('dragenter', ['$event'])
    onDragenter(e: DragEvent): void {
        e.preventDefault();
        this.dropZoneService.openDropZone();
    }
}
