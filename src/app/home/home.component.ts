import { Component, HostListener, OnInit } from '@angular/core';
import { DropZoneService } from '../drop-zone/drop-zone.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private dropZoneService: DropZoneService
    ) {
    }

    ngOnInit(): void {
    }

    @HostListener('dragenter', ['$event'])
    onDragenter(e: DragEvent): void {
        e.preventDefault();
        this.dropZoneService.openDropZone();
    }
}
