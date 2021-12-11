import { Component, ViewEncapsulation } from '@angular/core';
import {User} from "../../../core/model/user";

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ExampleComponent {

    // user: User = JSON.parse(sessionStorage.getItem("mus-user"));

    /**
     * Constructor
     */
    constructor() {
    //     setTimeout(() => {
    //         console.log("current User", this.user);
    //     }, 500);
    }
}
