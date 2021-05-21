import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { bindNodeCallback, Observable, OperatorFunction } from 'rxjs';
import { PathLike, Stats } from 'fs';

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

    // readToFiles<T, R>(callback: (dir: string) => R): OperatorFunction<any, any> {
    //     return (source: Observable<T>) => new Observable(subscriber => {
    //         const subscription = source.subscribe({
    //             next(value) {
    //                 console.log(value);
    //                 const result = callback('customValue');
    //                 subscriber.next(result);
    //             },
    //             error(err) {
    //                 subscriber.error(err);
    //                 console.error(err);
    //             },
    //             complete() {
    //                 subscriber.complete();
    //                 console.log('complete');
    //             }
    //         });
    //
    //         return () => {
    //             subscription.unsubscribe();
    //             console.log('unsub');
    //         };
    //     });
    // }
}
