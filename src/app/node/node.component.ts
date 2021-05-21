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
    mergeScan, reduce,
    skipWhile,
    take, tap,
    toArray,
    withLatestFrom
} from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { FileService } from '../core/services/file/file.service';
import { ElectronService } from '../core/services';
import { of } from 'rxjs';
import { LanguageCodeMap } from '../core/language-code.map';

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
    dataSource: MatTableDataSource<INode> = new MatTableDataSource<INode>([]);
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
        const files$ = page$.pipe(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            map<[StepperSelectionEvent, string], PathWithType[]>(([_, source]) => [
                {
                    type: 'dir',
                    path: source
                }
            ]),
            expand((paths: PathWithType[]) => of(paths).pipe(
                concatAll(),
                mergeScan((acc, item) => item.type !== 'dir'
                    ? of(item)
                    : this.fileService.readDir(item.path).pipe(
                        concatAll(),
                        filter(name => {
                            const ext = this.electron.path.extname(name);
                            return ext === '' || ext === '.json';
                        }),
                        mergeMap(name => this.fileService.stat(this.electron.path.join(item.path, name)).pipe(
                            map(stat => ({
                                // TODO: locate the parent
                                parent: LanguageCodeMap.has(name) ? name : item.parent,
                                type: stat.isDirectory() ? 'dir' : 'file',
                                path: this.electron.path.join(item.path, name)
                            }))
                        ))
                    ), [] as PathWithType[]
                ),
                toArray()
            )),
            skipWhile<PathWithType[]>(arr => !arr.every(item => item.type !== 'dir')),
            take(1)
        );

        const nodes$ = files$.pipe(
            concatAll(),
            mergeMap(file => this.fileService.readFile(file.path).pipe(
                map(data => data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF ? data.slice(3) : data),
                map(data => data.toString('utf-8')),
                map(data => data.replace(/,\n*\s*\}/g, "\n}")),
                map(data => JSON.parse(data))
            )),
            reduce((acc, value) => {
                Object.keys(value).forEach(key => {
                    if (acc.every(item => item.name !== key)) {
                        acc.push({position: acc.length + 1, name: key, control: new FormControl()});
                    }
                });
                return acc;
            }, [] as INode[])
        );

        nodes$.subscribe(nodes => {
            this.dataSource = new MatTableDataSource(nodes);
            this.masterToggle();
        });
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
