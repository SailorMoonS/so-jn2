import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { DropZoneModule } from '../drop-zone/drop-zone.module';
import { TranslationSourceModule } from '../translation-source/translation-source.module';
import { TargetModule } from '../target/target.module';
import { ConsoleModule } from '../console/console.module';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        SharedModule,
        HomeRoutingModule,
        DropZoneModule,
        TranslationSourceModule,
        TargetModule,
        ConsoleModule
    ]
})
export class HomeModule {
}
