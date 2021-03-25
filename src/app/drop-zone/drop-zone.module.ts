import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropZoneComponent } from './drop-zone.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [
        DropZoneComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
export class DropZoneModule {
}
