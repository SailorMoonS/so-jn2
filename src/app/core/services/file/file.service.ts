import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { bindNodeCallback, Observable } from 'rxjs';
import { PathLike } from 'fs';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(
        private electron: ElectronService
    ) {
    }

    readDir(dir: PathLike): Observable<string[]> {
        const readFile = bindNodeCallback(this.electron.fs.readdir);
        return <Observable<string[]>>readFile(dir);
    }
}
