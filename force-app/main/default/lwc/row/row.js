import { LightningElement, api } from 'lwc';
import deleteAccount from '@salesforce/apex/accountController.deleteAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Row extends LightningElement {
    @api showId;
    @api showRating;
    @api showName;
    @api editRatingButtonClicked = false;
    @api editNameButtonClicked = false;        

    renderedCallback() {
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.showRating : null;
        this.template.querySelector('.inputfield') ? this.template.querySelector('.inputfield').value = this.showName : null;
        // fullfilling select & inputfield on render
    }

    unableButtonsMessage() {
        const unableButtonsEvent = new CustomEvent('unablebuttonsevent');
        this.dispatchEvent(unableButtonsEvent);
    }

    @api enableButtons() {
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.removeAttribute('disabled');
        editRatingButton.removeAttribute('disabled');
    }

    @api unableButtons() {
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.setAttribute('disabled', true);
        editRatingButton.setAttribute('disabled', true);
    }

    refreshTable() {
        const updateEvent = new CustomEvent('refreshtable');
        this.dispatchEvent(updateEvent);
    }

    handleDeleteRow(event) {
        deleteAccount({ accountId: event.target.dataset.accId }).then(() => {
            this.refreshTable();
        }).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'deleted successfully',
                    variant: 'success'
                })
            )

        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
    
    handleFocusLost(event) {
        let draft;
        this.editRatingButtonClicked ? (
            draft = this.template.querySelector('.select').value
        ):(
            draft = this.template.querySelector('.inputfield').value
        ) 

        const focusLost = new CustomEvent('focuslost', {
            detail: { 'draft':draft, 'id':this.showId, 'editRatingButtonClicked':this.editRatingButtonClicked}
        });
        this.dispatchEvent(focusLost);
    }

    handleEditName() {
        this.editNameButtonClicked = true; // show Name input, hide Name text
        this.unableButtonsMessage();
    }

    @api carryChangesInNameCell() {
        let tempNameVar = this.template.querySelector('.inputfield').value; 
        this.changeBackgroundColor();
        this.editNameButtonClicked = false; // hide Name input, show Name text
        this.showName = tempNameVar;
    }

    handleEditRating() {
        this.editRatingButtonClicked = true; // show rating select, hide rating text
        this.unableButtonsMessage();
    }

    @api carryChangesInRatingCell() {
        let tempRatingVar = this.template.querySelector('.select').value;
        this.changeBackgroundColor();
        this.editRatingButtonClicked = false;
        this.showRating = tempRatingVar; 
    }

    changeBackgroundColor() {
        if (this.editRatingButtonClicked) {
            this.template.querySelector('.fieldrating').classList.toggle('input-changed', false);   // painting rating 
            this.template.querySelector('.fieldrating').classList.toggle('yellow-cell', true);
        } else {
            this.template.querySelector('.fieldname').classList.toggle('input-changed', false);     // painting name
            this.template.querySelector('.fieldname').classList.toggle('yellow-cell', true);
        }
    }

    @api changeBackgroundColorToDefault() {
        this.template.querySelector('.fieldrating').classList.toggle('input-changed', true);
        this.template.querySelector('.fieldname').classList.toggle('input-changed', true);
    }
}