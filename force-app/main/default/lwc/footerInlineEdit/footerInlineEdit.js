import { LightningElement } from 'lwc';

export default class FooterInlineEdit extends LightningElement {
    cancelMessage(){
        const cancelEvent = new CustomEvent("cancelevent");
        this.dispatchEvent(cancelEvent);
    }

    saveMessage(){
        const saveEvent = new CustomEvent("saveevent");
        this.dispatchEvent(saveEvent);
    }
}