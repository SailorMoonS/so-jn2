import { Component, OnInit } from '@angular/core';
import { GoService } from '../services/go.service';

@Component({
    selector: 'app-controller',
    templateUrl: './controller.component.html',
    styleUrls: ['./controller.component.scss']
})
export class ControllerComponent implements OnInit {

    constructor(
        private go: GoService
    ) {
    }

    ngOnInit(): void {
    }

    start(): void {

    }
}
