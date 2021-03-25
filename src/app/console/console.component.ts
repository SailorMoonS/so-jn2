import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
    controlProjectName: FormControl = new FormControl('tan-vantage-experience');

    constructor() {
    }

    ngOnInit(): void {
    }

}
