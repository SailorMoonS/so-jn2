import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { PathLike, Stats } from 'fs';
import { bindCallback, bindNodeCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PathService {

    constructor(
        private electron: ElectronService
    ) {
    }

    isExist(path: PathLike): Observable<boolean> {
        console.log(111);
        const fsExistsCallback = bindCallback(this.electron.fs.exists);
        return fsExistsCallback(path);
    }

    isDir(path: PathLike): Observable<boolean> {
        const fsStatCallback = bindNodeCallback(this.electron.fs.stat);
        return fsStatCallback(path).pipe(map((stats: Stats) => stats.isDirectory()));
    }
}
