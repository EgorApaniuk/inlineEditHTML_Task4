import { LightningElement, api } from 'lwc';
import deleteAccount from '@salesforce/apex/accountController.deleteAccount';

export default class Row extends LightningElement {
    @api throwId;
    @api throwRating;
    @api throwName;
    @api changedName;
    @api changedRating;
    @api editRatingButtonClicked = false;
    @api editNameButtonClicked = false;
    @api hideRating = false;

    @api tempVarRating = false; //эти переменные являются временным хранилищем значений 
    // @api tempVarName;        

    // @api switchEditRatingButton(){
    //     this.editRatingButtonClicked == true ? this.editRatingButtonClicked = false : this.editRatingButtonClicked = true;
    //     console.log("EditRatingButtonClicked switched to: " +this.editRatingButtonClicked);
    // }

    renderedCallback() {    
        // if (this.template.querySelector('.select')){
        //     this.template.querySelector('.select').value = this.throwRating;
        // }
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.throwRating : null;
        this.template.querySelector('.inputfield') ? this.template.querySelector('.inputfield').value = this.throwName : null;
        // для того, чтобы select рейтинга и inputfield имени не были пустыми при появлении
    }

    // U N A B L E / E N A B L E //
    unableButtonsMessage() {
        const unableButtonsEvent = new CustomEvent("unablebuttonsevent");
        this.dispatchEvent(unableButtonsEvent);
    }

    enableButtonsMessage() {
        const enableButtonsEvent = new CustomEvent("enablebuttonsevent");
        this.dispatchEvent(enableButtonsEvent);
    }

    @api unableButtons() {
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.setAttribute('disabled', true);
        editRatingButton.setAttribute('disabled', true);
    }

    @api enableButtons() {
        let editNameButton = this.template.querySelector('.editNameButton');
        let editRatingButton = this.template.querySelector('.editRatingButton');
        editNameButton.removeAttribute('disabled');
        editRatingButton.removeAttribute('disabled');
    }

    refreshTable() {
        const updateEvent = new CustomEvent("refreshtable");
        this.dispatchEvent(updateEvent);
    }
    // U N A B L E / E N A B L E // 

    // D E L E T E // 
    handleDeleteRow(event) {
        deleteAccount({ accountId: event.target.dataset.accId }).then(() => {
            this.refreshTable();
        })
    }
    // D E L E T E //

    // N A M E 
    handleEditName() {
        console.log("current id : " + this.throwId);
        console.log("current name: " + this.throwName);
        this.editNameButtonClicked = true; // show Name input, hide Name text
        this.unableButtonsMessage();
    }


    handleLoseNameFocus() {  //обработчик клика в пустое место от имени
        console.log("Name input focus lost");
        this.nameFocusLostMessage();
    }

    nameFocusLostMessage() {//позже объеденить nameFocusLost и ratingFocusLost в одну функцию draftValuesMessage
        let draftName = this.template.querySelector('.inputfield').value;
        console.log("отправляемое значение Драфта имени - " + draftName);
        let id = this.throwId;
        console.log("отправляемое значение Id  - " + id);
        const nameFocusLost = new CustomEvent("namefocuslost", {
            detail: { draftName, id }
        });
        this.dispatchEvent(nameFocusLost);
    }

    @api carryChangesInNameCell() {
        this.throwName = this.template.querySelector('.inputfield').value;
        this.changeBackgroundColor();
        this.editNameButtonClicked = false; // hide Name input, show Name text
        this.openFooterMessage();
    }
    // --  

    // R A T I N G //
    handleEditRating() {
        this.throwRating === undefined ? this.tempVarRating = "" : this.tempVarRating = this.throwRating;
        this.editRatingButtonClicked = true; // show rating select, hide rating text
        this.unableButtonsMessage();
    }

    handleLoseRatingFocus() {   //обработчик клика в пустое место от рейтинга
        console.log("focus lost");
        this.ratingFocusLostMessage();
    }

    ratingFocusLostMessage() { // передаём значение изменения
        let draftRating = this.template.querySelector('.select').value;
        console.log("отправляемое значение Драфта - " + draftRating);
        let id = this.throwId;
        console.log("отправляемое значение Id  - " + id);
        const ratingFocusLost = new CustomEvent("ratingfocuslost", {
            detail: { draftRating, id }
        });
        this.dispatchEvent(ratingFocusLost);
    }

    @api carryChangesInRatingCell() {
        console.log("carryChangesInRatingCell Started");
        // console.log("throwRating в который сейчас запишутся значения из селекта : " + this.throwRating); // Почему берётся throwRating первой записи? 
        // console.log("Id в который сейчас запишутся значения из селекта : " + this.throwId); // Почему берётся throwId первой записи? 

        // console.log("СЕЛЕКТ ВАЛУЕ = "+this.template.querySelector('.select').value);
        this.throwRating = this.template.querySelector('.select').value;
        this.editRatingButtonClicked = false;
        
       
        
        this.changeBackgroundColor();
        // console.log("editRatingButtonclicked ? - " + this.editRatingButtonClicked);
        this.openFooterMessage();
    }
    // R A T I N G //

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

    changeBackgroundColorToDefault() {
        this.template.querySelector(".fieldrating").classList.toggle("input-changed", true);
        this.template.querySelector(".fieldname").classList.toggle("input-changed", true);
    }



    // F O O T E R //
    openFooterMessage() {
        const openFooterEvent = new CustomEvent("openfootermessage");
        this.dispatchEvent(openFooterEvent);
    }
    // F O O T E R //

    // F O O T E R  C A N C E L //
    // @api cancel() {
        // console.log("TempVar value = " + this.tempVarRating);
        // console.log("throwRating value before cancel = " + this.throwRating);

    //     this.throwRating = this.tempVarRating; // setup previous values

    //     this.changeBackgroundColorToDefault();
    //     this.enableButtonsMessage();

    //     const toastMessage = new ShowToastEvent({
    //         title: "Canceled",
    //         message: "changes canceled",
    //         variant: "info",
    //     });
    //     this.dispatchEvent(toastMessage);
    // }
    //    




    // saveChanges() {
    //     const fields = {};
    //     fields[ID_FIELD.fieldApiName] = this.throwId;
    //     fields["Name"] = this.changedName;
    //     fields[RATING_FIELD.fieldApiName] = this.changedRating;

    //     const recordInput = { fields };

    //     updateRecord(recordInput)
    //         .then(() => {
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Success',
    //                     message: 'Updated successfully',
    //                     variant: 'success'
    //                 })
    //             )
    //         }).
    //         catch(error => {
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Error updating or reloading record',
    //                     message: error.body.message,
    //                     variant: 'error'
    //                 })
    //             );
    //         });
    // } 
}