import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'nwn-graphical-summary-dropdown',
    templateUrl: './graphical-summary-dropdown.component.html',
    styleUrls: ['./graphical-summary-dropdown.component.css'],
})
export class GraphicalSummaryDropdownComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    singleSelect: any = [];
    config = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
    };

    productsValues = [
        {
            _id: 'all',
            index: 0,
            name: 'All',
        },
        {
            _id: 'wallmart',
            index: 1,
            name: 'Wallmart',
        },
        {
            _id: 'target',
            index: 2,
            name: 'Target',
        },
    ];
}
