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
    
    
}