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

    tempVarRating = false; //эти переменные являются временным хранилищем значений + по дефолту хай будет равно рейтингу
    // @api nameValueBeforePreviousEdit;   //полей, чтобы в случае CANCEL вернуться к ним


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

    // R A T I N G
    handleEditRating() { //1 
        
        this.RatingValueToTemproraryVar(); //запись Rating в темпвар
        this.unableButtonsMessage();
        this.hideRating();
        this.showRatingSelect();

    }
    
    RatingValueToTemproraryVar() {  //2
        if (this.tempVarRating === false) {
            if(this.throwRating === undefined){// нужно передать в tempRating именно пустую строку
                this.tempVarRating = "";       // иначе checkRatingChanges сравнивает undefined и "". 
            }
            else{
                this.tempVarRating = this.throwRating;
            }
            
            console.log("ratingToTempVar IF momento tempvar is |" + this.tempVarRating);
        }
        else {
            console.log("ratingToTempVar ELSE momento 1 tempvar is | " + this.tempVarRating);
            
            this.tempVarRating = this.template.querySelector(".rating").value; //ПОМЕНЯТЬ!!!! //поменял
            console.log("ratingToTempVar ELSE momento 2 tempvar is | "+ this.tempVarRating);
            
        }
    }

    hideRating() {     //спрятать Изначальный рейтинг // 4
        let text = this.template.querySelector(".rating");
        text.style.display = "none";     
        
    }

    showRatingSelect() {
        this.editRatingButtonClicked = true; //вызывает рендер селекта
    }

    handleLoseRatingFocus() {//обработчик клика в пустое место от рейтинга
        console.log("focus on rating select lost");
        this.hideRatingSelect();
    }
    hideRatingSelect() {     //спрятать droplist или Select
        this.checkRatingChanges();
        this.editRatingButtonClicked = false;
    }
    checkRatingChanges() {   //проверить изменение рейтинга 
        console.log("checkRate momento Select value is");
        console.log(this.template.querySelector('.select').value);
        console.log("checkRate momento tempVar is");
        console.log(this.tempVarRating);
        if (this.template.querySelector('.select').value != this.tempVarRating) {
            console.log('there are changes in Rating');

            this.template.querySelector('.rating').value = this.template.querySelector('.select').value

            this.changeBackgroundColor();
            this.showChangedRating();
            this.openFooterMessage()
        }
        else {
            this.showRatingText();
            console.log('there are  NOOOO changes in Rating');

        }
    }
    changeBackgroundColor() {// метод красит ячейку в желтый
        if (this.editRatingButtonClicked) {
            // красим рейтинг 
            this.template.querySelector(".fieldrating").classList.toggle("input-changed", false);
            this.template.querySelector(".fieldrating").classList.toggle("yellow-cell", true);
        }
        else {// красим имя
            this.template.querySelector(".fieldname").classList.toggle("input-changed", false);
            this.template.querySelector(".fieldname").classList.toggle("yellow-cell", true);
        }
    }
    showChangedRating() {
        this.changedRating = this.template.querySelector('.select').value;
        let text = this.template.querySelector(".changedrating");
        text.style.display = "block";
    }
    showRatingText() {   //показать неизмененный рейтинг
        let text = this.template.querySelector(".rating");
        text.style.display = "block";
        this.enableButtonsMessage(); // не работает кнопка возле непосредсвенно (не)изменённого рейтинга
    }
    // --  --

    // F O O T E R 
    openFooterMessage() {
        const openFooterEvent = new CustomEvent("openfootermessage");
        // console.log("open footer event done");
        this.dispatchEvent(openFooterEvent);
    }
    //

    // F O O T E R  C A N C E L
    @api cancel() { //главное откатывать изменения до предыдущих значений, а не до стартовых - не потеряй это
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
        this.hideChangedFields();
        this.showNameText();
        this.showRatingText(); // вывод ПРЕДЫДУЩИХ а НЕ стартовых значений окда?
    }

    hideChangedFields() {
        let rating = this.template.querySelector(".changedrating");
        console.log("hide changed rating");
        rating.style.display = "none";

        let name = this.template.querySelector(".changedname");
        console.log("hide changed name");
        name.style.display = "none";
    }
    showPreviousFields() {
        //показать неизмененный рейтинг
        // let rating = this.ratingValueBeforePreviousEdit // right?  // = this.template.querySelector(".rating");
        // rating.style.display = "block";

        let text = this.template.querySelector(".name");
        //   text.style.display = ""; //- чтобы показать текст
        // console.log ("show name");
        text.style.display = "block";
        this.enableButtonsMessage();


        // let name = this.template.querySelector(".name");
        // name.style.display = "block";
        // this.enableButtonsMessage();

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