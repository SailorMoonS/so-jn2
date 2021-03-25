import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';

@NgModule({
    declarations: [PageNotFoundComponent],
    imports: [CommonModule, TranslateModule, FormsModule, MatCommonModule],
    exports: [TranslateModule, FormsModule]
})
export class SharedModule {
}
