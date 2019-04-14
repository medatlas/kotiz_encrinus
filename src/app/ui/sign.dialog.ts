import { Network, Account } from 'scatterjs-core';
import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material';
import Eos from 'eosjs';

const network = Network.fromJson(environment.eosConfig.network);

@Component({
  selector: 'fc-sign-dialog',
  templateUrl: './sign.dialog.html',
  styleUrls: ['./sign.dialog.css']
})
export class SignDialogComponent implements OnInit {
  formGroup: FormGroup;
  email = '';
  errorMessage = '';
  authLinkRequested = false;
  selectedAccount: Account;
  private scatter: any;
  private eosClient: any;

  @Output()
  closeChange = new EventEmitter<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SignDialogComponent>) {
    this._initScatter();
  }

  ngOnInit() { }

  async _initScatter() {
    this.scatter = (<any>window).scatter;

    if (this.scatter) {
      this.scatter.getIdentity({
        accounts: [network]
      }).then(identity => {
        this.selectedAccount = identity.accounts[0];
        this.eosClient = this.scatter.eos(network, Eos, environment.eosConfig.eosOptions);
      });
    }
  }

  sign() {
    const data = {
      user: `${this.selectedAccount.name}`,
      hash: this.data.doc.hash,
      saveToTable: 1,
      name: this.data.doc.name,
      memo: '',
      content: ''
    };

    const authorization = [{ 'actor': this.selectedAccount.name, 'permission': this.selectedAccount.authority }];

    this.eosClient.contract(environment.eosConfig.contractName).then(contract =>
      contract.save(data, { authorization })
    ).then(result => {
      console.log(result);
      this.dialogRef.close();
    }, error => {
      console.log(error);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
