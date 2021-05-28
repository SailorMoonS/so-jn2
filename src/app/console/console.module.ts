import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LanguageTableModule } from '../language-table/language-table.module';
import { NodeModule } from '../node/node.module';
import { ControllerModule } from '../controller/controller.module';


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
        MatInputModule,
        MatTableModule,
        MatCheckboxModule,
        LanguageTableModule,
        NodeModule,
        ControllerModule
    ]
})
export class ConsoleModule {
}
