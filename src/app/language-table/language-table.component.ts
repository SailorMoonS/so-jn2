import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import { PathService } from '../core/services/path/path.service';
import { filter, mergeMap, reduce, switchMap, withLatestFrom } from 'rxjs/operators';
import { FileService } from '../core/services/file/file.service';
import { LanguageCode } from './language-code.interface';
import { LanguageCodeMap } from '../core/language-code.map';

@Component({
    selector: 'app-language-table',
    templateUrl: './language-table.component.html',
    styleUrls: ['./language-table.component.scss']
})
export class LanguageTableComponent implements OnInit {
    @Input() stepSelectionChange: EventEmitter<StepperSelectionEvent>;

    displayedColumns: string[] = ['select', 'position', 'name', 'iso'];
    dataSource: MatTableDataSource<LanguageCode> = new MatTableDataSource<LanguageCode>([]);
    selection = new SelectionModel<LanguageCode>(true, []);

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
        const list$ = page$.pipe(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            switchMap(([_, source]) => this.fileService.readDir(source).pipe(
                mergeMap(x => x),
                reduce((previousValue, currentValue, currentIndex) => {
                    previousValue.push({
                        position: currentIndex + 1,
                        name: currentValue,
                        iso: LanguageCodeMap.get(currentValue.toUpperCase())
                    });
                    return previousValue;
                }, [] as LanguageCode[])
            ))
        );
        list$.subscribe(list => {
            this.dataSource = new MatTableDataSource<LanguageCode>(list);
            this.selection = new SelectionModel<LanguageCode>(true, []);
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
    checkboxLabel(row?: LanguageCode): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
}
