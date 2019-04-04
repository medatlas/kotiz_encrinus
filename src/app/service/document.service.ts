import { AngularFireAuth } from '@angular/fire/auth';
import { ResourceService } from './resource.service';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { Document } from '../model/document';

@Injectable()
export class DocumentService extends ResourceService<Document> {

    protected resourceUrl = '/document';
    protected model = 'document';

    constructor(
        @Inject(AngularFireAuth) auth: AngularFireAuth,
        @Inject(AngularFireDatabase) af: AngularFireDatabase) {
        super(auth, af);
    }

    public getByUser(userId: string): Observable<Document[]> {
        return super.query('userId', userId);
    }

    public getById(id: string): Observable<Document[]> {
        return super.query('id', id);
    }
}
