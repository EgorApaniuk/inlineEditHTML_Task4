import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';


export default class TableInlineEditHTML extends LightningElement {
    openFooter = false;
    @track data;
    dataArray;
    refreshAccounts;
    draftRatingVar;
    draftNameVar;
    receivedId; // poka testiruem
    indexVar;

    @wire (getAccounts)
    wiredAccounts(value){
        this.refreshAccounts = value;
        // console.log(value);
        const {error, data} = value;
        if(data){
            console.log("data is true");

            this.data=data;
            this.dataArray = data;
            // this.account=data[0];// chto eto za stroka i zachem ona nuzna?
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
    
    

    

    draftRatingToVar(event){
        this.draftRatingVar = event.detail.draftRating;
        this.receivedId = event.detail.id;
        console.log("получена айди : "+this.receivedId);
        console.log("получено драфт значение :"+this.draftRatingVar);
        this.indexFind();
        console.log("indexVar : "+this.indexVar);
        this.checkRating();     //checking changes in rating
    }

    draftNameToVar(event){
        this.draftNameVar = event.detail.draftName;
        this.receivedId = event.detail.id;
        console.log("получена айди : "+this.receivedId);
        console.log("получено драфт значение имени :"+this.draftNameVar);
        this.indexFind();
        console.log("indexVar : "+this.indexVar);
        this.checkName();   //checking changes in name // инфа от кэпа 
    }

    checkName(){
        console.log("check name");
        // if(this.draftValues != this.account.Name){
        //     console.log("There are changes in NAME");
        //     this.template.querySelector('c-row').carryChangesInNameCell();
        // }
        // else{
        //     console.log("NO changes in NAME");
        //     this.template.querySelector('c-row').editNameButtonClicked = false;
        //     this.handleEnableButtons(); 
        // }
    }// в этой ситуации чек нейм символ в символ повторяет чекрэйтинг, возможно надо что-то с жтим делать)))) ayy lmao

    checkRating(){
        console.log("check rating");
        if(this.draftRatingVar != this.dataArray[this.indexVar].Rating){
            console.log("there are changes in rating");  

            this.template.querySelector('c-row').carryChangesInRatingCell();  
            console.log("Обращение по апи сработало");
        }
        else{
            console.log("NO changes in rating");

            // this.template.querySelector('c-row').editRatingButtonClicked = false;// hide rating select, show rating text
            this.handleEnableButtons(); 
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
        this.openFooter = false;
        this.handleEnableButtons();
        this.draftValues = [];
    } 

    handleSave(){    
        console.log("save pushed");

        const fields = {};
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        // fields["Name"] = event.detail.draftValues[0].Name;
        fields[RATING_FIELD.fieldApiName] = event.detail.draftValues[0].Rating;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Updated successfully',
                        variant: 'success'
                    })
                )
            }).
            catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or reloading record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

        // this.openFooter = false;
        // this.handleEnableButtons();

    }

    handleTest(){
    }

    // indexFind(){
    //     console.log("indexFind started");
    //     console.log(this.receivedId);
        
    //     let index = this.dataArray.findIndex(this.checkArray);

    //     console.log("index = "+ index);
    //     console.log(this.dataArray[index]);        
    // }

    // checkArray(array){

    //     return array.Id == this.receivedId;
    //     //for example "0015g00000PkShfAAF"
    // }
    indexFind(){
            console.log("indexFind started");
            console.log(this.receivedId);
        
            
            let index = this.dataArray.findIndex((array) => {
                return array.Id == this.receivedId;
            });
            console.log("index = "+ index);
            console.log(this.dataArray[index]); 

            this.indexVar  = index;
        }
}