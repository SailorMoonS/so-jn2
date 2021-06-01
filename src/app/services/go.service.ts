import { Injectable } from '@angular/core';
import { Observable, Subject, zip } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper/stepper';
import { concatAll, filter, map, mergeMap, share, switchMap, takeUntil } from 'rxjs/operators';
import { PathService } from '../core/services/path/path.service';
import { FileService } from '../core/services/file/file.service';
import { PathWithType } from '../interface/path-with-type.interface';
import { LanguageCode } from '../language-table/language-code.interface';
import { LanguageCodeMap } from '../core/language-code.map';
import { INode } from '../node/node.interface';
import * as _ from 'lodash';


@Injectable({
    providedIn: 'root'
})
export class GoService {
    reload$ = new Subject();
    stepperChange: Subject<StepperSelectionEvent> = new Subject<StepperSelectionEvent>();
    nodeSelection: INode[] = [];
    languageSelection: LanguageCode[] = [];
    private files$: Observable<PathWithType[]>;

    constructor(
        private pathService: PathService,
        private fileService: FileService
    ) {
    }

    /**
     * HOT stream: unsubscribe.
     */
    get files(): Observable<PathWithType[]> {
        if (!this.files$) {
            this.files$ = this.stepperChange.pipe(
                takeUntil(this.reload$),
                // 2 stand for last page.
                filter(step => step.selectedIndex === 2),
                switchMap(() => this.pathService.source$),
                map(source => [{type: 'dir', path: source}]),
                this.fileService.readToFiles(),
                share()
            );
        }
        return this.files$;
    }

    /**
     * HOT stream: unsubscribe.
     */
    get targetFiles(): Observable<PathWithType[]> {
        return this.pathService.target$.pipe(
            map(target => [{type: 'dir', path: target}]),
            this.fileService.readToFiles(),
            share()
        );
    }

    forceReload(): void {
        this.reload$.next();
        this.files$ = null;
    }

    clearCache(): void {
        this.files$ = null;
    }

    transform(): Observable<any> {
        return this.pathService.source$.pipe(
            map(source => [{type: 'dir', path: source}]),
            this.fileService.readToFiles(),
            concatAll(),
            filter(item => !!this.languageSelection.find(languageCode => languageCode.name === item.parent)),
            mergeMap(item => this.targetFiles.pipe(
                concatAll(),
                map(file => {
                    const frags = file.path.split('\\');
                    file.parent = frags[frags.length - 1].replace('.json', '');
                    return file;
                }),
                filter(targetFile => LanguageCodeMap.get(item.parent) === targetFile.parent),
                map(targetFile => [item.path, targetFile.path])
            )),
            mergeMap(([source, target]) => zip(this.fileService.readJSON(source), this.fileService.readJSON(target)).pipe(
                map(([sourceJSON, targetJSON]) => {
                    _.forEach(this.nodeSelection, (node: INode) => {
                        _.updateWith(targetJSON, node.control.value, (n) => _.merge(n, sourceJSON[node.name]));
                    });
                    return {target, targetJSON};
                }),
                switchMap(({target, targetJSON}) => this.fileService.writeFile(target, JSON.stringify(targetJSON, null, 4)))
            ))
        );
    }
}
