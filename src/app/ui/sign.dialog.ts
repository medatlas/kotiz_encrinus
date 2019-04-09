import ScatterEOS from 'scatterjs-plugin-eosjs2';
import ScatterJS from 'scatterjs-core';
import { Network, Scatter, Account } from 'scatterjs-core';
import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material';
import Eos from 'eosjs';

ScatterJS.plugins(new ScatterEOS());

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
  accounts: Account[];
  selectedAccount: Account;
  private scatter: any;
  private eosClient: any;

  @Output()
  closeChange = new EventEmitter<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SignDialogComponent>) {
  }

  ngOnInit() {
    this.initScatter();
  }

  async initScatter() {
    this.scatter = (<any>window).scatter;
    // this.scatter = ScatterJS.scatter;
    if (this.scatter) {
      const network = Network.fromJson(environment.eosConfig.network);
      const eosOptions = { expireInSeconds: 60 };
      this.eosClient = this.scatter.eos(network, Eos, eosOptions);
      this.scatter.getIdentity({
        accounts: [network]
      }).then(identity => {
        this.selectedAccount = identity.accounts[0];
        this.sign();
      });
    }
  }

  sign() {
    const transaction = {
      actions: [
        {
          account: 'fincomeosone',
          name: 'save',
          authorization: [`${this.selectedAccount.name}@${this.selectedAccount.authority}`],
          data: {
            user: `${this.selectedAccount.name}`,
            hash: this.data.doc.hash,
            saveToTable: true,
            name: this.data.doc.name,
            memo: this.data.doc.description,
            content: ''
          }
        }
      ]
    };

    this.eosClient.transaction(transaction);

    // this.eosClient.contract('fincomeosone').then(contract =>
    //   contract.save(`${this.selectedAccount.name}`, this.data.doc.hash, true, this.data.doc.name, this.data.doc.description, ''));
  }

  close() {
    this.dialogRef.close();
  }
}
