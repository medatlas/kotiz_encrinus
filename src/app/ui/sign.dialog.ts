import ScatterEOS from 'scatterjs-plugin-eosjs';
import { Network, Account } from 'scatterjs-core';
import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material';
import Eos from 'eosjs';

const network = Network.fromJson(environment.eosConfig.network);

const eosOptions = {
  expireInSeconds: 60,
  sign: true,
  broadcast: false,
  chainId: environment.eosConfig.network.chainId
};

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
    (<any>window).ScatterJS.plugins(new ScatterEOS());
    (<any>window).ScatterJS.connect('fincomeosone', { network }).then(connected => {

      if (connected) {
        this.scatter = (<any>window).ScatterJS.scatter;
        (<any>window).ScatterJS = null;

        if (this.scatter) {
          this.selectedAccount = this.scatter.identity.accounts[0];
          this.eosClient = this.scatter.eos(network, Eos, eosOptions);
        }
      }
    });
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

    const transaction = {
      actions: [
        {
          account: 'fincomeosone',
          name: 'save',
          authorization: [{ 'actor': this.selectedAccount.name, 'permission': this.selectedAccount.authority }],
          data: data
        }
      ]
    };

    this.scatter.requestSignature(transaction).then(tr => {
      this.eosClient.transaction(tr);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
