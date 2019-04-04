import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { DocumentService } from './../service/document.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Document } from '../model/document';

const uuidv4 = require('uuid/v4');

@Component({
    selector: 'fc-document-list',
    templateUrl: './document.list.html',
    styleUrls: ['./document.list.css']
})
export class DocumentListComponent implements OnInit {

    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    userId = this.angularFireAuth.auth.currentUser.uid;
    documents: Document[];
    description: string;

    @ViewChild('fileinput') fileInput: ElementRef;

    constructor(private angularFireAuth: AngularFireAuth,
        private documentService: DocumentService,
        private storage: AngularFireStorage) { }

    ngOnInit() {
        this._refreshDocuments();
    }

    selectFile() {
        this.fileInput.nativeElement.click();
    }

    fileChangeEvent(event: any): void {
        const uuid = uuidv4();
        const file = event.target.files[0];
        const fileName = `${new Date().getTime()}_${file.name}`;
        const path = `users/${this.userId}/docs/${uuid}`;
        const customMetadata = { uuid: uuid };
        this.task = this.storage.upload(path, file, { customMetadata });
        const fileRef = this.storage.ref(path);
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges().pipe(
            finalize(() => {
                fileRef.getDownloadURL().subscribe(url => {
                    const doc = new Document();
                    doc.uuid = uuid;
                    doc.name = file.name;
                    doc.path = url;
                    doc.store = path;
                    doc.userId = this.userId;
                    if (this.description) {
                        doc.description = this.description;
                    }
                    this.documentService.create(doc.uuid, doc).subscribe(() => {
                        this.description = '';
                    });
                });
            })
        );
    }

    isActive(snapshot) {
        return snapshot && snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }

    share(doc: Document) {
    }

    delete(doc: Document) {
        this.storage.ref(doc.store).delete().subscribe(async () => {
            await this.documentService.remove(doc.uuid);
            this._refreshDocuments();
        });
    }

    _refreshDocuments() {
        this.documentService.my().subscribe(documents => this.documents = documents);
    }
}
