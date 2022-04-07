import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class TableInlineEditHTML extends LightningElement {
    openFooter = false;
    @track data;
    dataArray; // 
    refreshAccounts;
    draftRatingVar;
    draftNameVar;
    receivedId;
    indexVar;

    @wire (getAccounts)
    wiredAccounts(value){
        this.refreshAccounts = value;
        const {error, data} = value;
        if(data){
            console.log("data is true");
            this.data=data;
            this.dataArray = data;
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

    draftRatingToVar(event){// receiving draftValues from child
        this.draftRatingVar = event.detail.draftRating;
        this.receivedId = event.detail.id;
        console.log("id received: "+this.receivedId);
        console.log("rating draft value received : "+this.draftRatingVar);
        this.indexFind();
        console.log("indexVar : "+this.indexVar);
        this.checkRating();     //checking changes in rating
    }

    draftNameToVar(event){
        this.draftNameVar = event.detail.draftName;
        this.receivedId = event.detail.id;
        console.log("id received : "+this.receivedId);
        console.log("name draft value received :"+this.draftNameVar);
        this.indexFind(); // looking for array index, which stores object w/ received id
        console.log("indexVar : "+this.indexVar);
        this.checkName();   //checking changes in name // инфа от кэпа 
    }

    indexFind(){
        // console.log(this.receivedId);
        let index = this.dataArray.findIndex((array) => {
            return array.Id == this.receivedId;
        });
        console.log(this.dataArray[index]); 
        this.indexVar  = index;
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
    }

    checkRating(){
        console.log("check rating");
        console.log(this.draftRatingVar, this.dataArray[this.indexVar].Rating);
        if(this.draftRatingVar != this.dataArray[this.indexVar].Rating){
            console.log("there are changes in rating");  

            // this.template.querySelectorAll('c-row').carryChangesInRatingCell();  
            
            console.log('[data-id=\'' +this.receivedId +'\']');
            console.log(this.template.querySelector('[data-id=\'' +this.receivedId +'\']')); // всё просто на самом делеаааааааааааа
            
            this.template.querySelector('[data-id=\'' +this.receivedId +'\']').carryChangesInRatingCell();
        }
        else{
            console.log("NO changes in rating");

            this.template.querySelector('[data-id=\'' +this.receivedId +'\']').editRatingButtonClicked = false;// hide rating select, show rating text
            this.handleEnableButtons(); 
        }
    }
 
    handleCancel(){
        console.log("cancel pushed");
        this.openFooter = false;
        this.handleEnableButtons();
        this.draftNameVar = [];
        this.draftRatingVar = [];
        this.template.querySelector('[data-id=\''+this.receivedId+'\']').throwRating = this.dataArray[this.indexVar].Rating;
        this.template.querySelector('[data-id=\''+this.receivedId+'\']').changeBackgroundColorToDefault();
    } 

    handleSave(){    
        console.log("save pushed");

        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.receivedId;
        // fields["Name"] = event.detail.draftValues[0].Name;
        fields[RATING_FIELD.fieldApiName] = this.draftRatingVar;

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

        this.openFooter = false;
        this.handleEnableButtons();

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