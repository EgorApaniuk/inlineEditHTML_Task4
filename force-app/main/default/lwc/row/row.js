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
    
}