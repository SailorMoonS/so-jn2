import {
    Component,
    HostListener,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

interface DragEventExtend extends DragEvent {
    fromElement: EventTarget
}

@Component({
    selector: 'app-drop-zone',
    templateUrl: './drop-zone.component.html',
    styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit {
    dragging = false;
    @ViewChild('translationSource') elementTranslationSource: ElementRef;
    @ViewChild('target') elementTarget: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<DropZoneComponent>
    ) {
    }

    ngOnInit(): void {
    }

    onDrop(e: DragEvent): void {
        e.preventDefault();
        const files = e.dataTransfer.files;
        let path;

        if (files && files.length > 0) {
            path = files[0].path;
            console.log('path:', path);
        }

        this.dialogRef.close(path);
    }

    @HostListener('document:dragover', ['$event'])
    onDragover(e: DragEvent): void {
        e.preventDefault();
    }

    @HostListener('dragleave', ['$event'])
    onDragleave(e: DragEventExtend): void {
        e.preventDefault();
        // if (e.fromElement === this.elementTranslationSource.nativeElement
        //     || e.fromElement === this.elementTarget.nativeElement) {
        //     return;
        // }
        this.dialogRef.close();
    }
}

