import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeComponent } from './node.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
    declarations: [NodeComponent],
    exports: [
        NodeComponent
    ],
    imports: [
        CommonModule,
        MatTableModule,
        MatCheckboxModule
    ]
})
export class NodeModule {
}
