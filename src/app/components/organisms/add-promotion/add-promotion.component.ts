import { Component, Input, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {OptimizerService, SimulatorService} from '@core/services'
import {CheckboxModel} from '@core/models'
import { ModalService } from '@molecules/modal/modal.service';
import * as Utils from "@core/utils"
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
// import { tickStep } from 'd3-array';
@Component({
    selector: 'nwn-add-promotion',
    templateUrl: './add-promotion.component.html',
    styleUrls: ['./add-promotion.component.css'],
})
export class AddPromotionComponent implements OnInit {
    errMsg:any = {
        mechanic: false,
        discount: false,
        cost_share: false
    }
    public userInPut:any;
    constructor(private toastr: ToastrService,private optimize : OptimizerService,public modalService: ModalService,public restApi: SimulatorService){

    }
    config:any = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true
    };
    promo_generated = ''
    input_promotions:Array<CheckboxModel> = []
    base_line_promotions:Array<CheckboxModel> = []
    history_baseline:Array<any> = []

    form = new FormGroup({
        promo: new FormControl('', []),
        tpr:new FormControl(0,[]),
        co_inv : new FormControl(0,[]),
        vol_on_deal : new FormControl(0,[]),
      });
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
            if(value!=100){
                this.form.controls['tpr'].setValue(value);

            }
           
            switch (label) {
                case LabelType.Ceil:
                    return value + ' ';
                case LabelType.Floor:
                    return value + ' ';
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
    get f(){
        return this.form.controls;
      }
    promo_name:any[] = []

    ngOnInit(){
        this.restApi.ClearScearchText.asObservable().subscribe(data=>{
            if(data == "add-promotion"){
                console.log(data , "promotion modal.................................")
                this.valueCoInvestment = 100
                this.valueDiscountdepth = 0
                this.valueVolumeondeal = 100;
                this.form.reset()
                // this.form.reset()
            }
            
            
          })
    this.config = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
    };
    this.form.valueChanges.subscribe(data=>{
    let final = Utils.genratePromotion(
        this.userInPut,
     data.co_inv,
     data.vol_on_deal,
     "13%",
     data.promo
    )
    setTimeout(()=>{
        this.base_line_promotions = this.optimize.get_base_line_promotions().map(e=>({"value" : e,"checked" : false}))
        this.promo_name = this.optimize.get_base_line_promotions().map(e=>Utils.decodePromotion(e)['promo_activity'])
        this.promo_name.push("Rollback");
        this.promo_name.push("Multiahorro");
        this.promo_name = [...new Set(this.promo_name.map(item => item))]

        console.log(this.base_line_promotions , "base line promotions")
        },100)
         setTimeout(()=>{
            
        this.promo_generated = final
        console.log(this.promo_generated , "this.promo_generated this.promo_generated ")

    },500)
    })
  
    }
    hideNoResultsFound(){
        $( "#promo-details" ).click(function() {
           let temp:any =  $(".available-items").text();
           if(temp == "No results found!"){
            $(".available-items").hide()
           }
           else {
            $(".available-items").show()
           }
        })
    }
    valueChangePromo(e:any){
        console.log(e.value , "promo value selected")
    }
    valueChangeBaseline(e:any){
        this.history_baseline.push(e.value)
        this.input_promotions.push({"value" : e.value, "checked" : e.checked})
        // console.log(this.input_promotions , "input promotions ")
        // debugger
        this.base_line_promotions = this.base_line_promotions.filter(val=>val.value!=e.value)
        // this.base_line_promotions.indexOf()
        // console.log(e.value , "base line promo value")

    }
    applyPromotion(){
        if(this.input_promotions.length > 0){
            let val = this.input_promotions.map(e=>e.value)
            console.log(val , "val genetratefd")
            this.optimize.setPromotionObservable(val)
            console.log(this.input_promotions , "input promotions ") 
            var modal_id:any = this.modalService.opened_modal
            if(modal_id.length > 0){
                modal_id = modal_id[modal_id.length-1]
                // $('#'+modal_id).hide(); 
                this.modalService.close(modal_id)
                this.restApi.setClearScearchTextObservable(modal_id)
            }
        }
        else{
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

        // if(this.form.value.co_inv == 0 || this.form.value.co_inv == null){
        //     this.errMsg.co_investment = true
        //     return
        // }
        if(this.promo_generated){
            if(!this.input_promotions.find(v=>v.value == this.promo_generated)){
                this.input_promotions.push({"value" : this.promo_generated , "checked" : false})
            }
        }
       
        this.valueCoInvestment = 100;
        this.valueDiscountdepth = 0;
        this.valueVolumeondeal =100;
        this.form.reset()
        this.errMsg.mechanic = false
        this.errMsg.discount = false
        this.errMsg.cost_share = false
        
        // console.log(this.promo_generated , "promotion generated")
    }
    clickClosedEvent($event){
        console.log($event , "click closed event")
        // debugger
        // let val = parseInt($event.replace(/[^0-9]/g,''))
        console.log($event , "click closed")
        console.log(this.history_baseline , "history baseline")
        if(this.history_baseline.includes($event)){
            this.base_line_promotions.push({"value" : $event,"checked" : false})
            this.input_promotions = this.input_promotions.filter(val=>val.value!=$event)
        }
        else{
            this.input_promotions = this.input_promotions.filter(val=>val.value!=$event)

        }
        // ignoreElements()
    }
    changePromotion(e:any){
        console.log(e.value.length , "lenth of sselscted promotion")
        if(e.value.length == 0){
            this.coInvestment = Object.assign({}, this.coInvestment, {disabled: true})
            this.volumeOndeal = Object.assign({}, this.volumeOndeal, {disabled: true})
        this.discountdepth = Object.assign({}, this.discountdepth, {disabled: true});
        this.valueDiscountdepth = 0
        this.valueCoInvestment = 100
        this.valueVolumeondeal = 100
        }
        else{
            this.coInvestment = Object.assign({}, this.coInvestment, {disabled: false})
            this.volumeOndeal = Object.assign({}, this.volumeOndeal, {disabled: false})
        this.discountdepth = Object.assign({}, this.discountdepth, {disabled: false});

        }
        this.errMsg.mechanic = false
        this.form.controls['promo'].setValue(e.value);
        if(e.value == 'Corta Vigencia'){
            var cotaPpg = this.optimize.get_base_line_promotions().map(e=> this.decodePromotionPpg(e))
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
