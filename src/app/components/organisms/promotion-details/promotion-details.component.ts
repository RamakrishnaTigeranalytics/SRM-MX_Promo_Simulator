import { Component, EventEmitter, Input, OnInit,Output,SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import * as Utils from "@core/utils"
import { CheckboxModel } from '@core/models';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'nwn-promotion-details',
    templateUrl: './promotion-details.component.html',
    styleUrls: ['./promotion-details.component.css'],
})
export class PromotionDetailsComponent implements OnInit {
    errMsg:any = {
        mechanic: false,
        discount: false,
        cost_share: false
    }
    public  userInPut:any;
    input_promotions:Array<CheckboxModel> = []
    @Output()
    promotionAddEvent = new EventEmitter()
    @Input()
    base_promotions:any[] = []
    @Input()
    promotionPpg:any[] = []
    selected_promotions:any[] = []

    form = new FormGroup({
        promo: new FormControl('', []),
        tpr:new FormControl(0,[]),
        co_inv : new FormControl(0,[]),
        vol_on_deal : new FormControl(0,[]),
      });
      promo_generated = ''
    @Input()
    valueDiscountdepth = 0;

    @Input()
    valueCoInvestment = 100;
    @Input()
    valueVolumeondeal = 100;

    @Input()
    discountdepth: Options = {
        floor: 0,
        ceil: 1000,
        showSelectionBar: true,
        disabled: true,
        translate: (value: number, label: LabelType): string => {
            console.log("ind=isde setting.............depth" , value)
            if(value!=100){
                this.form.controls['tpr'].setValue(value);

            }
          
            switch (label) {
                case LabelType.Ceil:
                    return value + '';
                case LabelType.Floor:
                    return value + '';
                default:
                    return '' + value;
            }
        },
    };
    coInvestment: Options = {
        floor: 0,
        ceil: 100,
        showSelectionBar: true,
        disabled: true,
        translate: (value: number, label: LabelType): string => {
            
            console.log("ind=isde setting.............coinv" , value)
            if(value!=100){
                this.form.controls['co_inv'].setValue(value);

            }
           
 
            switch (label) {
                case LabelType.Ceil:
                    return value + ' %';
                case LabelType.Floor:
                    return value + ' %';
                default:
                    return '' + value;
            }
        },
    };
    volumeOndeal: Options = {
        floor: 0,
        ceil: 100,
        showSelectionBar: true,
        disabled: true,
        translate: (value: number, label: LabelType): string => {
            if(value!=100){
                this.form.controls['vol_on_deal'].setValue(value);

            }
           
             
            switch (label) {
                case LabelType.Ceil:
                    return value + ' %';
                case LabelType.Floor:
                    return value + ' %';
                default:
                    return '' + value;
            }
        },  
    };
    singleSelect: any = [];
    config:any = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true
    };
    // optionsNormal = ["Motivation","N+1","Traffic"
    //        ];
    optionsNormal:any[] = ['Multiahorro','Rollback']


    
    constructor(private toastr: ToastrService,) {}

    ngOnInit(): void {
        this.config = {
            displayKey: 'name', // if objects array passed which key to be displayed defaults to description
            search: true,
        };
        // console.log(this.base_promotions , "base promotions")
        this.form.valueChanges.subscribe(data=>{
            // console.log(this.form)
            // console.log(data , "form changes subscription")
            // let promo = null
            let final = Utils.genratePromotion(
             this.userInPut,
             data.co_inv,
             data.vol_on_deal,
             "13%",
             data.promo

            )
                 setTimeout(()=>{
                this.promo_generated = final
                console.log(final , "final value")
        
            },500)
            
            // console.log(name , "name of label")
             
        })
    }
    valueChangePromo($event){
        // debugger
        if($event['checked']){
            this.selected_promotions.push($event['value'])
        }
        else{
            this.selected_promotions = this.selected_promotions.filter(d=>d!=$event['value'])

        }
        // value: "TPR-15%", checked: false
        // console.log($event , "value change event")
        // let promo = this.input_promotions.find(d=>d.value == $event['value'])

        // let checked = promo?.checked
        // if(checked){
        //     // promo.checked = !checked
        // }
       
        // console.log(this.input_promotions , "input prmotions ")
    }
    clickClosedEvent($event){
        // TPR-15% close event
        this.input_promotions= this.input_promotions.filter(item => item.value !== $event);
    }
    apply(){
        if(this.selected_promotions.length > 0){
            this.promotionAddEvent.emit({
                "id" : "promotion-details",
                "value" : this.selected_promotions
            })
        }
        else {
            this.toastr.error("Please select atleast one promotion")
        }
    }
    addPromotions(){
        // debugger
        if(this.form.value.promo != ""){
            if(Object.prototype.toString.call(this.form.value.promo).slice(8, -1).toLowerCase() == 'array'){
                this.errMsg.mechanic = true
                return
            }
        }
        else if(this.form.value.promo == ""){
            this.errMsg.mechanic = true
            return
        }
        if((this.form.value.tpr == 0 || this.form.value.tpr == null) && (this.form.value.co_inv == 0 || this.form.value.co_inv == null)){
            this.errMsg.discount = true
            return
        }

        // if(this.form.value.tpr == 0 || this.form.value.tpr == null){
        //     this.errMsg.discount = true
        //     return
        // }
        if(this.promo_generated){
            if(!this.input_promotions.find(v=>v.value == this.promo_generated)){
                this.input_promotions.push({"value" : this.promo_generated , "checked" : false})
            }
        }
       
        this.valueCoInvestment = 100
        this.userInPut = 0;
        this.valueVolumeondeal = 100
        this.form.reset()
        this.promo_generated = '';
        // console.log(this.promo_generated , "promotion generated")
    }
    hideNoResultsFound(){
        $( "#promo-details1" ).click(function() {
           let temp:any =  $(".available-items").text();
           if(temp == "No results found!"){
            $(".available-items").hide()
           }
           else {
            $(".available-items").show()
           }
        })
    }
    ngOnChanges(changes: SimpleChanges) {
        
               for (let property in changes) {
                   if (property === 'base_promotions') {
                       this.input_promotions = []
                       this.selected_promotions = []
                      
                       // console.log(changes[property].currentValue , "current value")
                       this.base_promotions = changes[property].currentValue
                       if(this.base_promotions.length > 0){
                        setTimeout(()=>{
                            this.optionsNormal = this.base_promotions.map(e=> Utils.decodePromotion(e)['promo_activity'])
                            this.optionsNormal.push("Rollback");
                            this.optionsNormal.push("Multiahorro");
                            this.optionsNormal = [...new Set(this.optionsNormal.map(item => item))]
                        },0)
                      

                       }
                      
                       
                       this.input_promotions = this.base_promotions.map(e=>({
                           "value" : e,"checked" : false
                       }))
                        
                      
                   } 
                   
               }
           }
    changePromotion(e:any){
        // debugger
        if(e.value.length == 0){
            this.coInvestment = Object.assign({}, this.coInvestment, {disabled: true})
        this.discountdepth = Object.assign({}, this.discountdepth, {disabled: true});
        this.volumeOndeal = Object.assign({}, this.volumeOndeal, {disabled: true});
        this.valueDiscountdepth = 0
        this.valueCoInvestment = 100;
        this.valueVolumeondeal = 100;
        }
        else{
            this.coInvestment = Object.assign({}, this.coInvestment, {disabled: false})
        this.discountdepth = Object.assign({}, this.discountdepth, {disabled: false});
        this.volumeOndeal = Object.assign({}, this.volumeOndeal, {disabled: false});

        }
        this.errMsg.mechanic = false
        this.form.controls['promo'].setValue(e.value);
        if(e.value == 'Corta Vigencia'){
            var cotaPpg = this.base_promotions.map(e=> this.decodePromotionPpg(e))

            this.userInPut = cotaPpg[0];
            this.form.controls['tpr'].setValue( this.userInPut);
            let finalNum = Utils.genratePromotion(
                this.userInPut,
                this.form.value.co_inv,
                this.form.value.vol_on_deal,
                "13%",
                this.form.value.promo
               )
               setTimeout(()=>{
                this.promo_generated = finalNum
                console.log(finalNum , "final value")
        
            },500)
        }else{
            this.userInPut = 0;
            this.form.controls['tpr'].setValue( this.userInPut);
            let finalNum = Utils.genratePromotion(
                this.userInPut,
                this.form.value.co_inv,
                this.form.value.vol_on_deal,
                "13%",
                this.form.value.promo
               )
               setTimeout(()=>{
                this.promo_generated = finalNum
                console.log(finalNum , "final value")
        
            },500)
        }
        console.log(e.value , "selected value");
        console.log(this.form.value , "fomr value")
    }
    decodePromotionPpg(promo_name){
        let mechanicName = promo_name.slice(0,promo_name.indexOf(promo_name.match(/\(.*?\)/g)[0])-1)

        const [promoPrice,costShare,volOnDeal] = promo_name.match(/\(.*?\)/g).map(x => x.replace(/[()]/g, "")).map(e=>e.replace(/[^0-9\.]+/g, "_")).join(',').split('_').filter(e=>e)
         if(mechanicName == "Corta Vigencia" ){
            return promoPrice;
         }
        
    }
    sliderEvent(){
        this.errMsg.discount = false
    }

    onKey(event: any){
        this.userInPut = event;
        this.form.controls['tpr'].setValue(event);
        let final = Utils.genratePromotion(
            event,
            this.form.value.co_inv,
            this.form.value.vol_on_deal,
            "13%",
            this.form.value.promo
           )
           setTimeout(()=>{
            this.promo_generated = final
            console.log(final , "final value")
    
        },500)
       
      }
}
