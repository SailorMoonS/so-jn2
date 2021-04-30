import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { INode } from './node.interface';
import { FormControl } from '@angular/forms';

const test_data: INode[] = [
    { position: 1, name: 'test', control: new FormControl()},
    { position: 2, name: 'test1', control: new FormControl()},
    { position: 3, name: 'test2', control: new FormControl()},
];

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
    displayedColumns: string[] = ['select', 'position', 'name', 'control'];
    dataSource: MatTableDataSource<INode> = new MatTableDataSource<INode>(test_data);
    selection = new SelectionModel<INode>(true, []);

    constructor() {
    }

    ngOnInit(): void {
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: INode): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
}
