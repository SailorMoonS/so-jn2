import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { INode } from './node.interface';
import { FormControl, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import { concatAll, filter, map, mergeMap, reduce, withLatestFrom } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { FileService } from '../core/services/file/file.service';
import { PathWithType } from '../interface/path-with-type.interface';

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
        private fileService: FileService
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
            this.fileService.readToFiles()
        );

        const json$ = files$.pipe(
            concatAll(),
            mergeMap(file => this.fileService.readJSON(file.path))
        );
        const nodes$ = json$.pipe(
            reduce((acc, value) => {
                Object.keys(value).forEach(key => {
                    if (acc.every(item => item.name !== key)) {
                        acc.push({
                            position: acc.length + 1,
                            name: key,
                            control: this.createControl()
                        });
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

    // noinspection JSMethodCanBeStatic
    private createControl(): FormControl {
        // TODO: may Add history
        return new FormControl('', {
            validators: Validators.required
        });
    }
}
