import { LightningElement, api } from 'lwc';
import deleteAccount from '@salesforce/apex/accountController.deleteAccount';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import NAME_FIELD from '@salesforce/schema/Account.Name';



export default class Row extends LightningElement {
    @api throwId;
    @api throwRating;
    @api throwName;
    @api changedName;
    @api changedRating;
    @api editRatingButtonClicked = false;

    @api tempVarRating = false; //эти переменные являются временным хранилищем значений + по дефолту хай будет равно рейтингу
    // @api nameValueBeforePreviousEdit;   //полей, чтобы в случае CANCEL вернуться к ним
    yaDebil;

    renderedCallback() {    // для того, чтобы нынешний рейтинг передавался в select(dropbar)
        // if (this.template.querySelector('.select')){
        //     this.template.querySelector('.select').value = this.throwRating;
        // }
        this.template.querySelector('.select') ? this.template.querySelector('.select').value = this.throwRating : null;

    }

    // U N A B L E / E N A B L E
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
        editRatingButton.removeAttribute('disabled');//почему то в конкретной кнопке дизэйблд не снимается
    }

    refreshTable() {
        const updateEvent = new CustomEvent("refreshtable");
        this.dispatchEvent(updateEvent);
    }
    // --  -- 

    // D E L E T E 
    handleDeleteRow(event) {
        deleteAccount({ accountId: event.target.dataset.accId }).then(() => {
            this.refreshTable();
        })
    }
    // --  -- 

    // N A M E 
    handleEditName() {
        this.unableButtonsMessage();
        this.hideStartName();
        this.showInputField();
    }
    hideStartName(){
        let text = this.template.querySelector(".name");
        text.style.display = "none";    
        let changedText = this.template.querySelector(".changedname");
        changedText.style.display = "none";
    }
    showInputField() {// что-то тут надо переделывать
        this.template.querySelector('.inputfield').type = 'text';//меняем тип инпутфилда с hidden на текст
        if (this.nameChanges != true) {// если изменения не были внесены - в инпутфилде высветиться дефолтное значение
            this.template.querySelector('.inputfield').value = this.throwName;
            console.log("eto skazka, tak ne bivaet");
        }
        else {console.log("dddddddddddddddddddddddd") // если изменения были внесены - в инпутфилде высветиться измененное значение
            this.template.querySelector('.inputfield').value = this.querySelector('.name').value
        }
    }
    handleLoseNameFocus() {  //обработчик клика в пустое место от имени
        this.hideInputField();
    }
    hideInputField() {   //спрятать поле ввода имени
        this.template.querySelector('.inputfield').type = 'hidden';
        this.checkNameChanges();
    }
    
    checkNameChanges(event) {
        if (this.template.querySelector('.inputfield').value != this.throwName) { // элегантно))
            // console.log('there are changes');
            // кастыль
            this.template.querySelector('.name').value = this.template.querySelector('.inputfield').value;
            //конец костыля кастыля
            this.nameChanges = true; // переменная чтобы в последующем плясать от неё, обрабатывая изменеия в имени 
            this.changeBackgroundColor();
            this.showChangedName();
            this.openFooterMessage();
        }
        else {
            // console.log('no changes');
            this.showNameText(); //здесь это актуально. дальше - нет... хотя и тут вопрос 
        }
    }
    showNameText() {
        let text = this.template.querySelector(".name");
        //   text.style.display = ""; //- чтобы показать текст
        // console.log ("show name");
        text.style.display = "block";
        this.enableButtonsMessage();
    }
    showChangedName() {
        // console.log(this.template.querySelector('.inputfield').draftValues);
        this.changedName = this.template.querySelector('.inputfield').value;
        let text = this.template.querySelector(".changedname");
        //   text.style.display = ""; //- чтобы показать текст
        // console.log ("show changedname");
        text.style.display = "block";
    }
    // --  --

    // R A T I N G // 
    handleEditRating() {     
        this.throwRating === undefined ? this.tempVarRating = "" : this.tempVarRating = this.throwRating; // rewriting in tempVar every time edit button pushed 
        //записываем свежее значение в tempVar при каждом нажатии на edit
        this.editRatingButtonClicked = true; // show rating select, hide rating text
        this.unableButtonsMessage();
    }
    
    handleLoseRatingFocus() {   //обработчик клика в пустое место от рейтинга
        //checking Rating Changes below (checkRatingChanges())
        if (this.template.querySelector('.select').value != this.tempVarRating) {   //изменения ЕСТЬ
            this.throwRating = this.template.querySelector('.select').value;
            this.changeBackgroundColor(); 
            this.editRatingButtonClicked = false;  // hide rating select, show rating text
            this.openFooterMessage()
        }
        else {                                                                      //изменений НЕТ
            this.editRatingButtonClicked = false;  // hide rating select, show rating text
            this.enableButtonsMessage();
        }
    }

    changeBackgroundColor() {
        if (this.editRatingButtonClicked) {
            this.template.querySelector(".fieldrating").classList.toggle("input-changed", false);   // красим рейтинг 
            this.template.querySelector(".fieldrating").classList.toggle("yellow-cell", true);
        }
        else {
            this.template.querySelector(".fieldname").classList.toggle("input-changed", false);     // красим имя
            this.template.querySelector(".fieldname").classList.toggle("yellow-cell", true);
        }
    }
    // R A T I N G //

    // F O O T E R //
    openFooterMessage() {
        const openFooterEvent = new CustomEvent("openfootermessage");
        this.dispatchEvent(openFooterEvent);
    }
    // F O O T E R //

    // F O O T E R  C A N C E L //
    @api cancel() {
        this.cancelChanges();
        this.changeBackgroundColorToDefault();
        this.enableButtonsMessage();

        const toastMessage = new ShowToastEvent({
            title: "Canceled",
            message: "changes canceled",
            variant: "info",
        });
        this.dispatchEvent(toastMessage);
    }

    cancelChanges() {
        this.throwRating = this.tempVarRating;
        
        // this.showNameText(); //чё это? пускай будет пока с текстом не разберусь.
    }


    changeBackgroundColorToDefault() {
        this.template.querySelector(".fieldrating").classList.toggle("input-changed", true);
        this.template.querySelector(".fieldname").classList.toggle("input-changed", true);
    }
    //

    // F O O T E R  S A V E
    @api save() {
        this.saveChanges();
        this.changeBackgroundColorToDefault();
        this.enableButtonsMessage();
    }

    saveChanges() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.throwId;
        fields["Name"] = this.changedName;
        fields[RATING_FIELD.fieldApiName] = this.changedRating;

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
    }
    //



}