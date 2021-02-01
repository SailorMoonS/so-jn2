import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    dragging = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    @HostListener('drop', ['$event'])
    onDrop(e: DragEvent) {
        e.preventDefault();
        const files = e.dataTransfer.files;

        if (files && files.length > 0) {
            const path = files[0].path;
            console.log('path:', path);
            // const content = fs.readFileSync(path);
            // console.log(content.toString());

        }
        this.dragging = false;
    }

    @HostListener('dragover', ['$event'])
    onDragover(e: DragEvent) {
        e.preventDefault();
        this.dragging = true;
    }

}
