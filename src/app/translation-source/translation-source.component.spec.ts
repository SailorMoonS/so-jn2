import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationSourceComponent } from './translation-source.component';

describe('TranslationSourceComponent', () => {
    let component: TranslationSourceComponent;
    let fixture: ComponentFixture<TranslationSourceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TranslationSourceComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TranslationSourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
