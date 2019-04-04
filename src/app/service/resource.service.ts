import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

export class ResourceService<T> {

    protected resourceUrl = '/';
    protected model = '';

    constructor(
        private auth: AngularFireAuth,
        private af: AngularFireDatabase
    ) { }

    public find(id: string): Observable<T> {
        return this.af.object<T>(`${this.resourceUrl}/${id}`).valueChanges();
    }

    public create(id: string, resource: T): Observable<T> {
        this.af.object<T>(`${this.resourceUrl}/${id}`).set(resource);
        return this.find(id);
    }

    public update(id: string, resource: T): Observable<T> {
        this.af.object<T>(`${this.resourceUrl}/${id}`).update(resource);
        return this.find(id);
    }

    public remove(id: string) {
        return this.af.object<T>(`${this.resourceUrl}/${id}`).remove();
    }

    public list(): Observable<T[]> {
        try {
            const items = this.af.list<T>(this.resourceUrl).valueChanges();
            return items;
        } catch (e) {
            console.log(e);
        }
    }

    public my(): Observable<T[]> {
        return this.af.list<T>(this.resourceUrl, ref => ref.orderByChild('userId')
            .equalTo(this.auth.auth.currentUser.uid)).valueChanges();
    }

    public query(key: string, value: string): Observable<T[]> {
        return this.af.list<T>(this.resourceUrl, ref => ref.orderByChild(key).equalTo(value)).valueChanges();
    }
}
