import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { LanguageCode } from './language-code.interface';

@Injectable({
    providedIn: 'root'
})
export class LanguageTableService {
    selection = new SelectionModel<LanguageCode>(true, []);

    constructor() {
    }
}
