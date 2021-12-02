import { Component,Input,OnInit,Output,EventEmitter,SimpleChanges } from '@angular/core';
import {ProductWeek} from "../../../core/models"
import { Observable, of, from, BehaviorSubject, combineLatest } from 'rxjs';
@Component({
    selector: 'nwn-weekly-promotion',
    templateUrl: './weekly-promotion.component.html',
    styleUrls: ['./weekly-promotion.component.css'],
})
export class WeeklyPromotionComponent implements OnInit {
     
    @Input()
    product_week:ProductWeek = null as any;
    singleSelect;
    config = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        placeholder: 'Add promotion',
    };
    @Input()
    optionsWeeklyPromotion: any[] = [];
    @Input()
    promotion_map:any[] = []
    @Output()
    promotionChange =  new EventEmitter()

    ngOnInit(){
        // console.log(this.product_week , "product_weekproduct_weekproduct_weekproduct_weekproduct_week map")
        // console.log(this.promotion_map , "product_weekproduct_weekproduct_weekproduct_weekproduct_week this.promotion_map")
        // debugger
        let mp = this.promotion_map.filter(pr=>pr.week.week == this.product_week.week)
        if(mp.length > 0){
            this.singleSelect =  mp[0].selected_promotion
        }
     
        // console.log(this.year_quater , "year quater")
        // console.log(this.product_week , "promo week")
    }
    promotionChanged($event){
        console.log($event , "dropdown event")
        this.promotionChange.emit({"selected_promotion" : $event.value , "week" : this.product_week })

    }

    constructor() {}

    // ngOnInit() {}
    ngOnChanges(changes : SimpleChanges) :void
    {
        // console.log(changes , "changes in promotion child compoant")
        if((changes.promotion_map) && !changes.promotion_map.firstChange){
            // debugger
            let val = changes.promotion_map.currentValue.find(e=>e.week.week == this.product_week.week)
            // console.log(val, "valll")
            if(val){
                this.singleSelect =  val.selected_promotion
            }
            // this.singleSelect =  changes.promotion_map.currentValue.selected_promotion
            // if(this.key == changes.promotion_map.currentValue){
            //     this.type = 'active'
            // }
            // else{
            //     this.type = 'default'
            // }
            // console.log(changes , "updated value promotion map")
            
        }
     
    }

   
}
