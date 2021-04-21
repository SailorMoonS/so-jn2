import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { PathLike, Stats } from 'fs';
import { bindNodeCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PathService {

    constructor(
        private electron: ElectronService
    ) {
    }

    isExist(path: PathLike): Observable<void> {
        const fsExistsCallback = bindNodeCallback(this.electron.fs.access);
        return fsExistsCallback(path);
    }

    isDir(path: PathLike): Observable<boolean> {
        const fsStatCallback = bindNodeCallback(this.electron.fs.stat);
        return fsStatCallback(path).pipe(map((stats: Stats) => stats.isDirectory()));
    }
}
