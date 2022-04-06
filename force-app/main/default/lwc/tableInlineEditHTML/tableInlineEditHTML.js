import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';


export default class TableInlineEditHTML extends LightningElement {
    openFooter = false;
    @track data;
    refreshAccounts;
    draftValuesStorage;
    @track draftValues = [];
 

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

        //  this.template.querySelector('c-row').save();

        this.openFooter = false;
    }

   
    handleSelection(event){
       
   }

    draftValuesToVar(event){
        // console.log('this.draftValues ::: '+JSON.stringify(this.draftValues));
        // console.log(this.template.querySelector('c-row').draftValues);
        console.log(event.detail); // отправляет то что надо.
        // console.log("draft values = "+this.draftValues);
        // console.log("account rating?? = " + this.account.Rating);
        // this.draftValuesStorage = event.detail.draftValues;

        
        //iniciiruem proverku
        this.checkRating();
    }

    checkRating(){
        if(this.draftValuesStorage == this.account.Rating){// a kak sravnit???
            console.log("there are changes in rating");    // (s chem?)
        }
        else{
            console.log("NO changes in rating");
        }
    }

    processingDraftValues(event){
        // const fields = {};
        // fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        // // fields["Name"] = event.detail.draftValues[0].Name;
        // fields[RATING_FIELD.fieldApiName] = event.detail.draftValues[0].Rating;

        // const recordInput = { fields };

        // updateRecord(recordInput)
        //     .then(() => {
        //         this.dispatchEvent(
        //             new ShowToastEvent({
        //                 title: 'Success',
        //                 message: 'Updated successfully',
        //                 variant: 'success'
        //             })
        //         )
        //     }).
        //     catch(error => {
        //         this.dispatchEvent(
        //             new ShowToastEvent({
        //                 title: 'Error updating or reloading record',
        //                 message: error.body.message,
        //                 variant: 'error'
        //             })
        //         );
        //     });
    }


    handleCancel(){
        console.log("cancel pushed");
        this.draftValuesStorage = [];
        this.draftValues = [];
    } 
}