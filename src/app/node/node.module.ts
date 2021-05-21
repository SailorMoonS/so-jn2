import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeComponent } from './node.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [NodeComponent],
    exports: [
        NodeComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ]
})
export class NodeModule {
}
