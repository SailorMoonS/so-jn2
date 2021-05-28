import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerComponent } from './controller.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [ControllerComponent],
    exports: [
        ControllerComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule
    ]
})
export class ControllerModule {
}
