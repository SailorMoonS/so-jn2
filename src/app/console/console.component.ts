import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
    @Input() stepSelectionChange: EventEmitter<StepperSelectionEvent>;

    constructor() {
    }

    ngOnInit(): void {
    }

}
