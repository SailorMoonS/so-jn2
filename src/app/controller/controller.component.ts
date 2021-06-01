import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoService } from '../services/go.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { bufferTime } from 'rxjs/operators';

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit, OnDestroy {
    transformSubscription: Subscription;

    constructor(
        private go: GoService,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.transformSubscription && this.transformSubscription.unsubscribe();
    }

    start(): void {
        this.transformSubscription = this.go.transform().pipe(
            bufferTime(1000)
        ).subscribe(() => {
            this.snackBar.open('Done', 'Dismiss', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
            });
        });
    }
}
