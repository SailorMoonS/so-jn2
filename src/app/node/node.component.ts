import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { INode } from './node.interface';
import { FormControl, Validators } from '@angular/forms';
import { buffer, concatAll, mergeMap, reduce, take } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { FileService } from '../core/services/file/file.service';
import { GoService } from '../services/go.service';
import { concat, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['select', 'position', 'name', 'control'];
    dataSource: MatTableDataSource<INode> = new MatTableDataSource<INode>([]);
    selection: SelectionModel<INode> = new SelectionModel<INode>(true, []);
    private nodeSubscription: Subscription;
    private selectionChangedSubscription: Subscription;
    private nodeInit$: Subject<null> = new Subject();

    constructor(
        private pathService: PathService,
        private fileService: FileService,
        private go: GoService
    ) {
    }

    ngOnInit(): void {
        const files$ = this.go.files;

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

        this.nodeSubscription = nodes$.subscribe(nodes => {
            this.dataSource = new MatTableDataSource(nodes);
            this.masterToggle();
            this.nodeInit$.next();
        });

        this.selectionChangedSubscription = concat(
            this.selection.changed.pipe(buffer(this.nodeInit$), take(1)),
            this.selection.changed
        ).subscribe(() => {
            this.go.nodeSelection = this.selection.selected;
        });
    }

    ngOnDestroy(): void {
        this.nodeSubscription.unsubscribe();
        this.selectionChangedSubscription.unsubscribe();
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
