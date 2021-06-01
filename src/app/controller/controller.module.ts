import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerComponent } from './controller.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
    declarations: [ControllerComponent],
    exports: [
        ControllerComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatSnackBarModule
    ]
})
export class ControllerModule {
}
