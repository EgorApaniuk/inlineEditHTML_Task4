import { LightningElement, api } from 'lwc';
import deleteAccount from '@salesforce/apex/accountController.deleteAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Row extends LightningElement {
    @api throwId;
    @api throwRating;
    @api throwName;
    @api editRatingButtonClicked = false;
    @api editNameButtonClicked = false;        

    renderedCallback() {
        // if (this.template.querySelector('.select')){
        //     this.template.querySelector('.select').value = this.throwRating;
        // }
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.throwRating : null;
        this.template.querySelector('.inputfield') ? this.template.querySelector('.inputfield').value = this.throwName : null;
        // для того, чтобы select рейтинга и inputfield имени не были пустыми при появлении
    }

    unableButtonsMessage() {
        const unableButtonsEvent = new CustomEvent("unablebuttonsevent");
        this.dispatchEvent(unableButtonsEvent);
    }

    @api unableButtons() {
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.setAttribute('disabled', true);
        editRatingButton.setAttribute('disabled', true);
    }

    refreshTable() {
        const updateEvent = new CustomEvent("refreshtable");
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

        const focusLost = new CustomEvent("focuslost", {
            detail: { "draft":draft, "id":this.throwId, "editRatingButtonClicked":this.editRatingButtonClicked}
        });
        this.dispatchEvent(focusLost);
    }

    handleEditName() {
        this.editNameButtonClicked = true; // show Name input, hide Name text
        this.unableButtonsMessage();
    }

    @api carryChangesInNameCell() {
        let tempNameVar = this.template.querySelector('.inputfield').value; // потому что пока editNameButtonClicked = true - throwName'a не существует
        this.editNameButtonClicked = false; // hide Name input, show Name text
        this.throwName = tempNameVar;
        this.changeBackgroundColor();
    }

    handleEditRating() {
        this.editRatingButtonClicked = true; // show rating select, hide rating text
        this.unableButtonsMessage();
    }

    @api carryChangesInRatingCell() {
        console.log("carryChangesInRatingCell Started");
        let tempRatingVar = this.template.querySelector('.select').value; // потому что пока editRatingButtonClicked = true - throwRating'a не существует
        this.editRatingButtonClicked = false;
        this.throwRating = tempRatingVar; //а вот теперь существует
        this.changeBackgroundColor();
    }

    changeBackgroundColor() {
        console.log(this.editRatingButtonClicked);
        if (this.editRatingButtonClicked) {
            this.template.querySelector(".fieldrating").classList.toggle("input-changed", false);   // красим рейтинг 
            this.template.querySelector(".fieldrating").classList.toggle("yellow-cell", true);
        }
        else {
            this.template.querySelector(".fieldname").classList.toggle("input-changed", false);     // красим имя
            this.template.querySelector(".fieldname").classList.toggle("yellow-cell", true);
        }
    }

    @api changeBackgroundColorToDefault() {
        this.template.querySelector(".fieldrating").classList.toggle("input-changed", true);
        this.template.querySelector(".fieldname").classList.toggle("input-changed", true);
    }
}