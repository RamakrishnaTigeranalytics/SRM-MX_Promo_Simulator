import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'nwn-pricing-header',
    templateUrl: './pricing-header.component.html',
    styleUrls: ['./pricing-header.component.css'],
})
export class PricingHeaderComponent {
    currentRoute = '';

    constructor(location: Location, router: Router) {
        router.events.subscribe((val) => {
            if (location.path() != '') {
                this.currentRoute = location.path();
            } else {
                this.currentRoute = '';
            }
        });
    }

    ngOnInit() {}
}
