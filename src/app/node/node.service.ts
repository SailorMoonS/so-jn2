import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { INode } from './node.interface';

@Injectable({
    providedIn: 'root'
})
export class NodeService {
    selection = new SelectionModel<INode>(true, []);

    constructor() {
    }
}
