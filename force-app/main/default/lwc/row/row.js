import { LightningElement, api } from 'lwc';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';

import ID_FIELD from '@salesforce/schema/Account.Id';
import RATING_FIELD from '@salesforce/schema/Account.Rating';


export default class Row extends LightningElement {
    @api throwId;
    @api throwRating;
    @api throwName;
    @api changedName;
    @api changedRating;
    @api editRatingButtonClicked = false;

    unableButtonsMessage(){
        const unableButtonsEvent = new CustomEvent ("unablebuttonsevent");
        this.dispatchEvent(unableButtonsEvent);
    }

    enableButtonsMessage(){
        const enableButtonsEvent = new CustomEvent ("enablebuttonsevent");
        this.dispatchEvent(enableButtonsEvent);
    }

    @api unableButtons(){
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.setAttribute('disabled', true);
        editRatingButton.setAttribute('disabled', true);
    }
    
    @api enableButtons(){
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.setAttribute('disabled', false);
        editRatingButton.setAttribute('disabled', false);
    }
    
    refreshTable(){
        const updateEvent = new CustomEvent("refreshtable");
        this.dispatchEvent(updateEvent);
    }

    handleDeleteRow(event){
        deleteAccount({accountId: event.target.dataset.accId}).then(() => {
            this.refreshTable();
        })
    }

    handleEditRating(){
        this.editRatingButtonClicked = true;// включает выплывающую менюшку
        console.log("edit Rating button activated");
        // this.unableButtonsMessage();
        // this.hideStartRating();
    }

    hideStartRating() {     //спрятать Изначальный рейтинг
        let text = this.template.querySelector(".rating");
        text.style.display = "none";     // чтобы спрятать
        let changedtext = this.template.querySelector(".changedrating");
        changedtext.style.display = "none";
    }

    handleEditName(){
        console.log("edit Name button activated");
        // namebeforeEdit = startName;
        // this.hideStartName();
        this.unableButtonsMessage();
    }
    
}