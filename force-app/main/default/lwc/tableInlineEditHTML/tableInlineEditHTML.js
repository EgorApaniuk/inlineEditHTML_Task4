import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';


export default class TableInlineEditHTML extends LightningElement {
    openFooter = false;
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
            console.log(this.account);
            this.account=data[0];// chto eto za stroka i zachem ona nuzna?
            console.log(this.account);
            
            // chudotvornaya stroka delaet tak, chto rating stanovistya visible
        }
        else if (error){
            console.log(error);
        }
    }

    handleRefreshTable(){ // for immidiate table refresh after deleting row
        refreshApex(this.refreshAccounts);
    }

    handleUnableButtons(){
        let allRows = this.template.querySelectorAll("c-row");
        allRows.forEach(function(item, i, allRows){
            item.unableButtons();
        });
    }

    handleEnableButtons(){
        let allRows = this.template.querySelectorAll("c-row");
        allRows.forEach(function(item, i, allRows){
            item.enableButtons();
        });
    }

    handleOpenFooter(){
        this.openFooter = true;
    }
    

    handleSave(){
        
        console.log("save pushed");
        // let allRows = this.template.querySelectorAll("c-row");
        // allRows.forEach(function(item, i, allRows){
        //     item.save();
        // });    
        this.openFooter = false;
    }
    handleCancel(){
        console.log("cancel pushed");
        // let allRows = this.template.querySelectorAll("c-row");
        // allRows.forEach(function(item, i, allRows){
        //     item.cancel();
        // });


        // my variant 
        let row = this.template.querySelector("c-row");
        console.log("row:", row);
        row.cancel();
        this.openFooter = false;
    } 
}