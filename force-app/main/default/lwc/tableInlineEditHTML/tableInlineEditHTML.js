import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import ID_FIELD from '@salesforce/schema/Account.Id';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import NAME_FIELD from '@salesforce/schema/Account.Name';

import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class TableInlineEditHTML extends LightningElement {
    @track data;
    openFooter = false;
    dataArray;
    refreshAccounts;
    receivedId;
    indexVar;
    draftVar;
    workingWithRating;

    @wire(getAccounts)
    wiredAccounts(value) {
        this.refreshAccounts = value;
        const { error, data } = value;
        if (data) {
            this.data = data;
            this.dataArray = data;
        } else if (error) {
            console.log(error);
        }
    }

    handleRefreshTable() { // for immidiate table refresh after deleting row
        refreshApex(this.refreshAccounts);
    }

    handleUnableButtons() {
        let allRows = this.template.querySelectorAll("c-row");
        allRows.forEach(function (item, i, allRows) {
            item.unableButtons();
        });
    }

    handleEnableButtons() {
        let allRows = this.template.querySelectorAll("c-row");
        allRows.forEach(function (item, i, allRows) {
            item.enableButtons();
        });
    }

    draftToVar(event) {// receiving draft values from child
        this.draftVar = event.detail.draft;
        this.receivedId = event.detail.id;
        this.workingWithRating = event.detail.editRatingButtonClicked;
        console.log(this.draftVar, this.receivedId, this.workingWithRating);
        // this.draftVar == "" ? this.draftVar = undefined : null;
        this.indexFind();
        this.workingWithRating ? this.checkRating() : this.checkName();
    }

    indexFind() {
        this.indexVar = this.dataArray.findIndex((array) => {
            return array.Id == this.receivedId;
        });
    }

    checkName() {
        if (this.draftVar != this.dataArray[this.indexVar].Name) {
            this.template.querySelector('[data-id=\'' + this.receivedId + '\']').carryChangesInNameCell();
            this.openFooter = true;
        } else {
            this.template.querySelector('[data-id=\'' + this.receivedId + '\']').editNameButtonClicked = false;
            this.handleEnableButtons();
        }
    }

    checkRating() {
        if (this.draftVar == this.dataArray[this.indexVar].Rating                               // NO changes in rating  
            || (this.dataArray[this.indexVar].Rating == undefined && this.draftVar == "")) {    // or change from None to None     
            this.template.querySelector('[data-id=\'' + this.receivedId + '\']').editRatingButtonClicked = false;// hide rating select, show rating text
            this.handleEnableButtons();
        } else {   //There are changes in rating         
            this.template.querySelector('[data-id=\'' + this.receivedId + '\']').carryChangesInRatingCell();
            this.openFooter = true;
        }
    }

    handleCancel() {
        console.log("cancel pushed");
        this.openFooter = false;
        console.log("openFooter "+ this.openFooter);

        this.handleEnableButtons();
        console.log("buttons enabled");

        this.draftVar = [];
        this.workingWithRating ? (
            this.template.querySelector('[data-id=\'' + this.receivedId + '\']').throwRating = this.dataArray[this.indexVar].Rating
            
        ) : (
            this.template.querySelector('[data-id=\'' + this.receivedId + '\']').throwName = this.dataArray[this.indexVar].Name
        );

        this.template.querySelector('[data-id=\'' + this.receivedId + '\']').changeBackgroundColorToDefault();

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Canceled',
                message: 'Canceled sucessfully',
                variant: 'info'
            })
        );
    }

    handleSave() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.receivedId;
        console.log("saving. working with rating? " + this.workingWithRating);
        this.workingWithRating ? fields[RATING_FIELD.fieldApiName] = this.draftVar : fields[NAME_FIELD.fieldApiName] = this.draftVar;
        console.log("input to fields complete");
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
                this.handleRefreshTable();
                console.log("table refreshed");
            }).
            catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Deletion failed',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        this.template.querySelector('[data-id=\'' + this.receivedId + '\']').changeBackgroundColorToDefault();
        this.openFooter = false;
        this.handleEnableButtons();
    }

    // indexFind(){
    //         let index = this.dataArray.findIndex((array) => {
    //             return array.Id == this.receivedId;
    //         });
    //         this.indexVar  = index;
    //     }
}