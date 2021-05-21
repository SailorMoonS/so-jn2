import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { INode } from './node.interface';
import { FormControl } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import {
    concatAll,
    expand,
    filter,
    map,
    mergeMap,
    mergeScan,
    skipWhile,
    take,
    tap,
    toArray,
    withLatestFrom
} from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { FileService } from '../core/services/file/file.service';
import { ElectronService } from '../core/services';
import { of } from 'rxjs';

const test_data: INode[] = [
    {position: 1, name: 'test', control: new FormControl()},
    {position: 2, name: 'test1', control: new FormControl()},
    {position: 3, name: 'test2', control: new FormControl()},
];

interface PathWithType {
    parent?: string,
    type: string,
    path: string
}

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
    @Input() stepSelectionChange: EventEmitter<StepperSelectionEvent>;

    displayedColumns: string[] = ['select', 'position', 'name', 'control'];
    dataSource: MatTableDataSource<INode> = new MatTableDataSource<INode>(test_data);
    selection = new SelectionModel<INode>(true, []);

    constructor(
        private pathService: PathService,
        private fileService: FileService,
        private electron: ElectronService
    ) {
    }

    ngOnInit(): void {
        const page$ = this.stepSelectionChange.pipe(
            // 2 stand for last page.
            filter(step => step.selectedIndex === 2),
            withLatestFrom(this.pathService.source$)
        );
        page$.pipe(
            map<[StepperSelectionEvent, string], PathWithType[]>(([_, source]) => [
                {
                    type: 'dir',
                    path: source
                }
            ]),
            expand((paths: PathWithType[]) => {
                console.log('=========>', paths);
                return of(paths).pipe(
                    concatAll(),
                    mergeScan((acc, item) => {
                        if (item.type !== 'dir') {
                            return of(item);
                        }
                        return this.fileService.readDir(item.path).pipe(
                            concatAll(),
                            mergeMap(name => this.fileService.stat(this.electron.path.join(item.path, name)).pipe(
                                map(stat => ({
                                    parent: item.parent,
                                    type: stat.isDirectory() ? 'dir' : 'file',
                                    path: this.electron.path.join(item.path, name)
                                }))
                            ))
                        );
                    }, [] as PathWithType[]),
                    toArray()
                );
            }),
            tap(console.log),
            skipWhile(arr => !arr.every(item => item.type !== 'dir')),
            take(1)
        ).subscribe(console.log);
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
