import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

import { refreshApex } from '@salesforce/apex';


export default class TableInlineEditHTML extends LightningElement {
    @track data;
    refreshAccounts;
    
    @wire (getAccounts) wiredAccounts(value){
        this.refreshAccounts = value;
        console.log(value);
        const {error, data} = value;
        if(data){
            // console.log(data);
            this.data = data;
            
        }
        else if (error){
            console.log(error);
        }
    }

    handleRefreshTable(){
        refreshApex(this.refreshAccounts);
    }
}