import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageTableComponent } from './language-table.component';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
    declarations: [LanguageTableComponent],
    exports: [
        LanguageTableComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatTableModule,
        MatCheckboxModule
    ]
})
export class LanguageTableModule {
}
