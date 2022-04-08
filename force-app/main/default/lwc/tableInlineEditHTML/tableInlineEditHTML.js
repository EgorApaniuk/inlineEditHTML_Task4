import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import NAME_FIELD from '@salesforce/schema/Account.Name';



import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class TableInlineEditHTML extends LightningElement {
    openFooter = false;
    @track data;
    dataArray; // 
    refreshAccounts;
    // draftRatingVar;
    // draftNameVar;
    receivedId;
    indexVar;
    draftVar;
    workingWithRating;

    prikol;

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

    // U N I V E R S A L
    draftToVar(event){// receiving draftValues from child

        // console.log("event.composedPath()" + event.composedPath());
        this.draftVar = event.detail.draft;
        this.receivedId = event.detail.id;
        this.workingWithRating = event.detail.editRatingButtonClicked;
        console.log("id received: " + this.receivedId);
        console.log("draft value received : " + this.draftVar);
        console.log("event.detail.editRatingButtonClicked " + this.workingWithRating);

        this.indexFind();
        this.workingWithRating ? this.checkRating() : this.checkName();
    }


    // draftRatingToVar(event){// receiving draftValues from child
    //     this.draftRatingVar = event.detail.draft;
    //     this.receivedId = event.detail.id;
    //     console.log("id received: "+this.receivedId);
    //     console.log("rating draft value received : "+this.draftRatingVar);
    //     this.indexFind();
    //     console.log("indexVar : "+this.indexVar);
    //     this.checkRating();     //checking changes in rating
    // }

    // draftNameToVar(event){
    //     this.draftNameVar = event.detail.draft;
    //     this.receivedId = event.detail.id;
    //     console.log("id received : "+this.receivedId);
    //     console.log("name draft value received :"+this.draftNameVar);
    //     this.indexFind(); // looking for array index, which stores object w/ received id
    //     console.log("indexVar : "+this.indexVar);
    //     this.checkName();   //checking changes in name // инфа от кэпа 
    // }

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
        console.log("this.draftNameVar " + this.draftVar );
        console.log("this.dataArray[this.indexVar].Name "+this.dataArray[this.indexVar].Name);
        
        if(this.draftVar != this.dataArray[this.indexVar].Name){
            console.log("There are changes in NAME");
            this.template.querySelector('[data-id=\'' +this.receivedId +'\']').carryChangesInNameCell();
            this.openFooter = true;
        }
        else{
            console.log("NO changes in NAME");
            this.template.querySelector('[data-id=\'' +this.receivedId +'\']').editNameButtonClicked = false;
            this.handleEnableButtons(); 
        }
    }

    checkRating(){
        console.log("check rating");
        console.log("полученные значения : " + this.draftVar);
        console.log("стартовые значения : " + this.dataArray[this.indexVar].Rating);

        if(this.draftVar != this.dataArray[this.indexVar].Rating){   
            console.log("There are changes in rating");         
            // console.log('[data-id=\'' +this.receivedId +'\']');
            // console.log(this.template.querySelector('[data-id=\'' +this.receivedId +'\']')); // всё просто на самом делеаааааааааааа
            this.template.querySelector('[data-id=\'' +this.receivedId +'\']').carryChangesInRatingCell();
            this.openFooter = true;
        }
        else{// console.log("There are NO changes in rating");         
            this.template.querySelector('[data-id=\'' +this.receivedId +'\']').editRatingButtonClicked = false;// hide rating select, show rating text
            this.handleEnableButtons(); 
        }
    }
 
    handleCancel(){
        console.log("cancel pushed");
        this.openFooter = false;
        this.handleEnableButtons();
        this.draftVar = [];
        // console.log(Array.from(this.template.querySelector("tbody").children).find((row)=>row.dataset.id==this.receivedId));
        // this.template.querySelectorAll('c-row').editRatingButtonClicked=false;
        this.template.querySelector('[data-id=\''+this.receivedId+'\']').throwRating = this.dataArray[this.indexVar].Rating;
        this.template.querySelector('[data-id=\''+this.receivedId+'\']').throwName = this.dataArray[this.indexVar].Name;
        this.template.querySelector('[data-id=\''+this.receivedId+'\']').changeBackgroundColorToDefault();
    } 

    handleSave(){    
        console.log("save pushed");

        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.receivedId;
        if(this.workingWithRating){
            console.log("сохраняем Рейтинг");
            fields[RATING_FIELD.fieldApiName] = this.draftVar;
            console.log("sohranili osnovu");
            this.prikol = this.draftVar;
            console.log("sohranili prikol");
        }
        else{
           fields[NAME_FIELD.fieldApiName] = this.draftVar;
        }
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Saved successfully',
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

        this.template.querySelector('[data-id=\''+this.receivedId+'\']').changeBackgroundColorToDefault();
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