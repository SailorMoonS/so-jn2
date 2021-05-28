import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PathService } from '../core/services/path/path.service';
import { concatAll, reduce } from 'rxjs/operators';
import { FileService } from '../core/services/file/file.service';
import { LanguageCode } from './language-code.interface';
import { LanguageCodeMap } from '../core/language-code.map';
import { GoService } from '../services/go.service';
import { Subscription } from 'rxjs';
import { LanguageTableService } from './language-table.service';

@Component({
    selector: 'app-language-table',
    templateUrl: './language-table.component.html',
    styleUrls: ['./language-table.component.scss']
})
export class LanguageTableComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['select', 'position', 'name', 'iso'];
    dataSource: MatTableDataSource<LanguageCode> = new MatTableDataSource<LanguageCode>([]);
    selection: SelectionModel<LanguageCode>;
    private listSubscription: Subscription;

    constructor(
        private pathService: PathService,
        private fileService: FileService,
        private go: GoService,
        private languageTableService: LanguageTableService
    ) {
    }

    ngOnInit(): void {
        this.selection = this.languageTableService.selection;
        const files$ = this.go.files;
        const list$ = files$.pipe(
            concatAll(),
            reduce((previousValue, currentValue, currentIndex) => {
                previousValue.push({
                    position: currentIndex + 1,
                    name: currentValue.parent,
                    iso: LanguageCodeMap.get(currentValue.parent.toUpperCase())
                });
                return previousValue;
            }, [] as LanguageCode[])
        );
        this.listSubscription = list$.subscribe(list => {
            this.dataSource = new MatTableDataSource<LanguageCode>(list);
            // this.selection = new SelectionModel<LanguageCode>(true, []);
            this.masterToggle();
        });
    }

    ngOnDestroy(): void {
        this.listSubscription.unsubscribe();
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
