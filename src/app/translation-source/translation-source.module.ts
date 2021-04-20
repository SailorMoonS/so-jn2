import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationSourceComponent } from './translation-source.component';
import { MatStepperModule } from '@angular/material/stepper';


@NgModule({
    declarations: [TranslationSourceComponent],
    exports: [
        TranslationSourceComponent
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
export class TranslationSourceModule {
}
