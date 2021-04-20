import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropZoneComponent } from './drop-zone.component';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DropZoneService {
    pathSubject: Subject<string> = new Subject();

    constructor(
        private dialog: MatDialog
    ) {
    }

    openDropZone(): MatDialogRef<DropZoneComponent> {
        const dialogRef = this.dialog.open(DropZoneComponent, {
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
            panelClass: 'panel-drop-zone'
        });

        dialogRef.afterClosed().subscribe(res => {
            this.pathSubject.next(res);
        });
        return dialogRef;
    }
}
