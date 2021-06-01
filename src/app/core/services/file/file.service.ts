import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { bindNodeCallback, Observable, of, pipe, UnaryFunction } from 'rxjs';
import { PathLike, Stats, WriteFileOptions } from 'fs';
import {
    concatAll,
    expand,
    filter,
    map,
    mergeMap,
    mergeScan,
    skipWhile,
    take,
    toArray
} from 'rxjs/operators';
import { LanguageCodeMap } from '../../language-code.map';
import { PathWithType } from '../../../interface/path-with-type.interface';

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

    stat(dir: PathLike): Observable<Stats> {
        const stat = bindNodeCallback(this.electron.fs.stat);
        return <Observable<Stats>>stat(dir);
    }

    readFile(path: PathLike, options?: { encoding?: string; flag?: string; } | undefined | null): Observable<string | Buffer> {
        const readFile = bindNodeCallback<PathLike, { encoding?: string; flag?: string; } | undefined | null, string | Buffer>(this.electron.fs.readFile);
        return readFile(path, options);
    }

    readToFiles(): UnaryFunction<Observable<PathWithType[]>, Observable<PathWithType[]>> {
        return pipe(
            expand((paths: PathWithType[]) => of(paths).pipe(
                concatAll(),
                mergeScan((acc, item) => item.type !== 'dir'
                    ? of(item)
                    : this.readDir(item.path).pipe(
                        concatAll(),
                        mergeMap(name => this.stat(this.electron.path.join(item.path, name)).pipe(
                            filter(stat => {
                                const ext = this.electron.path.extname(name);
                                return stat.isDirectory() || ext === '.json';
                            }),
                            map(stat => ({
                                // TODO: locate the parent
                                parent: LanguageCodeMap.has(name) ? name : item.parent,
                                type: stat.isDirectory() ? 'dir' : 'file',
                                path: this.electron.path.join(item.path, name)
                            }))
                        ))
                    ), [] as PathWithType[]
                ),
                toArray()
            )),
            skipWhile<PathWithType[]>(arr => !arr.every(item => item.type !== 'dir')),
            take(1)
        );
    }

    readJSON(path: PathLike): Observable<any> {
        return this.readFile(path).pipe(
            map(data => data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF ? data.slice(3) : data),
            map(data => data.toString('utf-8')),
            map(data => data.replace(/,\n*\s*\}/g, "\n}")),
            map(data => JSON.parse(data))
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    writeFile(path: PathLike | number, data: any, options: WriteFileOptions = {encoding: 'utf-8'}): Observable<any> {
        const writeFile = bindNodeCallback<PathLike | number, any, WriteFileOptions>(this.electron.fs.writeFile);
        return writeFile(path, data, options);
    }
}
