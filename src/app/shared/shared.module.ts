import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';

@NgModule({
    declarations: [PageNotFoundComponent, WebviewDirective],
    imports: [CommonModule, TranslateModule, FormsModule, MatCommonModule],
    exports: [TranslateModule, WebviewDirective, FormsModule]
})
export class SharedModule {
}
