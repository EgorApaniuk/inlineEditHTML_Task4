import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

import { refreshApex } from '@salesforce/apex';


export default class TableInlineEditHTML extends LightningElement {
    @track data;
    refreshAccounts;

    @wire (getAccounts)
    wiredAccounts(value){
        this.refreshAccounts = value;
        // console.log(value);
        const {error, data} = value;
        if(data){
            console.log("data is true");

            this.data=data;
            this.account=data[0];// chto eto za stroka i zachem ona nuzna?
            // chudotvornaya stroka delaet tak, chto rating stanovistya visible
        }
        else if (error){
            console.log(error);
        }
    }

    handleRefreshTable(){
        refreshApex(this.refreshAccounts);
    }

    handleUnableButtons(){
        let allRows = this.template.querySelectorAll("c-row");
        console.log("handle UNABLE buttons this.template.querySelectorAll( c-row )");
        console.log(allRows);
        allRows.forEach(function(item, i, allRows){
            item.unableButtons();
        });
    }

    handleEnableButtons(){
        let allRows = this.template.querySelectorAll("c-row");
        console.log("handle ENABLE buttons this.template.querySelectorAll( c-row )");
        console.log(allRows);
        allRows.forEach(function(item, i, allRows){
            item.enableButtons();
        });
    }

    

}