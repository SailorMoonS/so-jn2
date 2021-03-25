import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
    declarations: [ConsoleComponent],
    exports: [
        ConsoleComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule
    ]
})
export class ConsoleModule {
}
