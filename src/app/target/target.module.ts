import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetComponent } from './target.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({
    declarations: [TargetComponent],
    exports: [
        TargetComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        MatListModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatStepperModule
    ]
})
export class TargetModule {
}
