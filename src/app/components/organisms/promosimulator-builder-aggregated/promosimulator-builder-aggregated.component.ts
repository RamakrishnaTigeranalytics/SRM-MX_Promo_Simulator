import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SimulatorService } from "../../../core/services/simulator.service";
import { OptimizerService } from "../../../core/services/optimizer.service";
import * as Utils from "../../../core/utils/util"
import * as $ from 'jquery';

@Component({
    selector: 'nwn-promosimulator-builder-aggregated',
    templateUrl: './promosimulator-builder-aggregated.component.html',
    styleUrls: ['./promosimulator-builder-aggregated.component.css'],
})
export class PromosimulatorBuilderAggregatedComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollOne') scrollOne: ElementRef;
    @ViewChild('scrollTwo') scrollTwo: ElementRef;
    translate_y: string = '';
    currentTranslateRate: string = '';
    index = 0
    randomResult:any = ''
    constructor(private elRef: ElementRef,public restApi: SimulatorService,public optimize:OptimizerService) {}

    public weeklyTableWidth: any;
    public weeklyTableHeight: any;
    public aggregatedGraphWidth: any;
    message1 : string= ''
    message2 : string = ''
    message3 : string = ''

    plChartData:any = [];
    baselineLiftChartData:any = []

    baseline:any
    incrementalLift:any 
    gsv:any
    nsv:any
    mac:any
    mac_nsv:any
    tradeExpence:any
    te_lsv:any
    te_units:any
    roi:any

    asp:any
    promo_asp:any

    rsvWithoutVat:any
    customerMargin:any
    customermargin_rsv:any
   
    cogs:any
   
   

    weeklyData:any = []
    product:any;

    weeklyTab:any = {
        "absolute": 'selected',
        "percent": 'unselected'
    }

    aggregatedTab:any = {
        "absolute": 'selected',
        "percent": 'unselected'
    }

    activeWeeklyTab: string = 'absolute'
    activeAggregatedTab: string = 'absolute'

    updateScroll(value:any){
        if(value == 'Graph'){
            const scrollOne = this.scrollOne.nativeElement as HTMLElement;
            const scrollTwo = this.scrollTwo.nativeElement as HTMLElement;

            scrollTwo.scrollLeft = scrollOne.scrollLeft;
        }
        else if(value == 'Table'){
            const scrollOne = this.scrollOne.nativeElement as HTMLElement;
            const scrollTwo = this.scrollTwo.nativeElement as HTMLElement;

            scrollOne.scrollLeft = scrollTwo.scrollLeft;
        }
      }

    ngOnInit() {
        // $(document).ready(function() {
        //     $('#div2').on('scroll', function () {
        //       $('#div1').scrollLeft($(this).scrollLeft());
        //     });
        // });
        // this.restApi.uploadedSimulatorDataObservable.asObservable().subscribe(data=>{
        //     if(data != ''){
        //         console.log(data,"observable data")
        //         this.convertToGraphNTableData(data)
        //     }
        // })
        this.weeklyTableWidth = window.innerWidth - 155;
        this.weeklyTableHeight = window.innerHeight - 150;
        this.aggregatedGraphWidth = window.innerWidth - 155;
        // this.loadStimulatedData()
        this.optimize.getSimulatedDataObservable().subscribe((data: any) => {
            // debugger
            if(data){
                this.index = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
                // console.log(data , "holiday information with data")
                this.convertToGraphNTableData(data)

            }
           
            
        })
    }

    weeklySubTabClick(key : string){
        if(key == 'Absolute'){
            this.weeklyTab = {
                "absolute": 'selected',
                "percent": 'unselected'
            }
            this.activeWeeklyTab = "absolute"
        }
        else {
            this.weeklyTab = {
                "absolute": 'unselected',
                "percent": 'selected'
            }
            this.activeWeeklyTab = "percent"
        }
    }

    aggregatedSubTabClick(key : string){
        if(key == 'Absolute'){
            this.aggregatedTab = {
                "absolute": 'selected',
                "percent": 'unselected'
            }
            this.activeAggregatedTab = "absolute"
        }
        else {
            this.aggregatedTab = {
                "absolute": 'unselected',
                "percent": 'selected'
            }
            this.activeAggregatedTab = "percent"
        }
    }
    get_holiday_calendar(str){
        if(str){
            return str.split(",").map(d=>d.split("_").join(" "))
        }
        return null

    }

    get_holiday_information(holiday , data){
        let ret : string = null as any
        if(holiday){
            // debugger
            data?.forEach(element => {
                // console.log(element , "retttttttttttttttttt element")
                // coefficient_old: "flag_russian_day", coefficient_new: "Holiday_Flag1"
                if(element['coefficient_new'].split("_").join("").toLowerCase() == holiday.split("_").join("").toLowerCase()){
                    // console.log("retttttttttttttttttttttttttttttttttt",element['coefficient_old'])
                    // console.log("retttttttttttttttttttttttttttttttttt",typeof(element['coefficient_old']))
                   ret = String(element['coefficient_old']).replace("flag_" , "").split("_").join(" ")

                }
                
            });
        }
        return ret

    }

    convertToGraphNTableData(data: any){
        // debugger;
        // console.log(data , "converttograpthtabledata")
        this.weeklyData = []
        this.product = null
        if(data){
            this.product = data.product_group
            console.log(this.product , "product image")
            this.plChartData = [
                { group: 'RSV w/o VAT', base: data['base']['total']['total_rsv_w_o_vat'], simulated: data['simulated']['total']['total_rsv_w_o_vat'] },
                { group: 'GSV', base: data['base']['total']['gsv'], simulated: data['simulated']['total']['gsv'] },
                { group: 'Trade Expense', base: data['base']['total']['te'], simulated: data['simulated']['total']['te'] },
                { group: 'NSV', base: data['base']['total']['nsv'], simulated: data['simulated']['total']['nsv'] },
                { group: 'COGS', base: data['base']['total']['cogs'], simulated: data['simulated']['total']['cogs'] },
                { group: 'MAC', base: data['base']['total']['mac'], simulated: data['simulated']['total']['mac'] },
                { group: 'Retailer profit', base: data['base']['total']['rp'], simulated: data['simulated']['total']['rp'] },

            ]
            console.log(this.plChartData,"checkhere")
            this.baselineLiftChartData = [
                {
                    group: 'Sales Units',
                    baseline1: [data['base']['total']['units'], data['base']['total']['increment_units']],
                    baseline2: [data['simulated']['total']['units'],  data['simulated']['total']['increment_units']],
                },
            ];

            this.baseline = {
                "converted_base": Utils.formatNumber(data['base']['total']['units'],false,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['units'],false,false),
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['units'],data['base']['total']['units']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['units']-data['base']['total']['units'],false,false) + ")",
                "arrow": data['simulated']['total']['units'] >  data['base']['total']['units']?  'carret-up' : 'carret-down' ,
                "color": this.colorForDifference(data['base']['total']['units'] , data['simulated']['total']['units']) 
            }

            
            this.incrementalLift = {
                "converted_base": Utils.formatNumber(data['base']['total']['increment_units'],false,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['increment_units'],false,false),
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['increment_units'],data['base']['total']['increment_units']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['increment_units']-data['base']['total']['increment_units'],false,false) + ")",
                "arrow": data['simulated']['total']['increment_units'] >  data['base']['total']['increment_units']?  'carret-up' : 'carret-down' ,
                "color": this.colorForDifference(data['base']['total']['increment_units'] , data['simulated']['total']['increment_units']) 
            }

            this.gsv = {
                "converted_base": Utils.formatNumber(data['base']['total']['gsv'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['gsv'],true,false),
                "arrow":  data['simulated']['total']['gsv'] > data['base']['total']['gsv'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['gsv'],data['base']['total']['gsv']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['gsv']-data['base']['total']['gsv'],true,false) + ")",
                "color": this.colorForDifference(data['base']['total']['gsv'],data['simulated']['total']['gsv']),
            }
            this.nsv = {
                "converted_base": Utils.formatNumber(data['base']['total']['nsv'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['nsv'],true,false),
                "arrow":  data['simulated']['total']['nsv'] > data['base']['total']['nsv'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['nsv'],data['base']['total']['nsv']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['nsv']-data['base']['total']['nsv'],true,false) + ")",
                "color": this.colorForDifference(data['base']['total']['nsv'],data['simulated']['total']['nsv']),
            }
            // this.message2 = ""
            let macper = Utils.percentageDifference(data['simulated']['total']['mac'],data['base']['total']['mac'])
            // this.message2 += "MAC is "

            this.mac = {
                "converted_base": Utils.formatNumber(data['base']['total']['mac'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['mac'],true,false),
                "arrow": data['simulated']['total']['mac'] > data['base']['total']['mac'] ? 'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['mac'],data['base']['total']['mac']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['mac']-data['base']['total']['mac'],true,false) + ")",
                "color":  this.colorForDifference(data['base']['total']['mac'] , data['simulated']['total']['mac'] ),
            }
            // if(Number(macper)<0){
            //     this.message2 += "decreased by " +macper+ "%"

            // }
            // else if(Number(macper) > 0){
            //     this.message2 += "increased by " +macper+ "%"

            // }
            // else{
            //     this.message2 += "not changed"

            // }

            this.mac_nsv = {
                "converted_base": Utils.formatNumber(data['base']['total']['mac_percent'],true,true),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['mac_percent'],true,true),
                "arrow":  data['simulated']['total']['mac_percent'] > data['base']['total']['mac_percent'] ? 'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.formatNumber(data['simulated']['total']['mac_percent'] - data['base']['total']['mac_percent'],false,true) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['mac_percent'] - data['base']['total']['mac_percent'],false,true) + ")",
                "color":  this.colorForDifference(data['base']['total']['mac_percent'] , data['simulated']['total']['mac_percent']),
            }

            let teper = Utils.percentageDifference(data['simulated']['total']['te'],data['base']['total']['te'])

            this.tradeExpence = {
                "converted_base": Utils.formatNumber(data['base']['total']['te'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['te'],true,false),
                "arrow":  data['simulated']['total']['te'] > data['base']['total']['te'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + teper + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['te']-data['base']['total']['te'],true,false) + ")",
                "color": this.colorForDifference( data['simulated']['total']['te'],data['base']['total']['te']),
            }

            this.te_lsv = {
                "converted_base": Utils.formatNumber(data['base']['total']['te_percent_of_gsv'],true,true),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['te_percent_of_gsv'],true,true),
                "arrow":  data['simulated']['total']['te_percent_of_gsv'] > data['base']['total']['te_percent_of_gsv'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.formatNumber(data['simulated']['total']['te']-data['base']['total']['te'],false,true) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['te']-data['base']['total']['te'],false,true) + ")",
                "color": this.colorForDifference( data['simulated']['total']['te'],data['base']['total']['te']),
            }
            this.te_units = {
                "converted_base": Utils.formatNumber(data['base']['total']['te_per_unit'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['te_per_unit'],true,false),
                "arrow":  data['simulated']['total']['te_per_unit'] > data['base']['total']['te_per_unit'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['te_per_unit'],data['base']['total']['te_per_unit']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['te_per_unit']-data['base']['total']['te_per_unit'],true,false) + ")",
                "color": this.colorForDifference( data['simulated']['total']['te_per_unit'],data['base']['total']['te_per_unit']),
            }

            // this.roi = {
            //     "converted_base": Utils.formatNumber(data['base']['total']['roi'],true,false),
            //     "converted_simulated": Utils.formatNumber(data['simulated']['total']['roi'],true,false),
            //     "arrow": data['simulated']['total']['roi'] > data['base']['total']['roi'] ?  'carret-up' : 'carret-down' ,
            //     "percent": "(" + Utils.percentageDifference(data['simulated']['total']['roi'],data['base']['total']['roi']) + "%)",
            //     "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['roi']-data['base']['total']['roi'],true,false) + ")",
            //     "color":  this.colorForDifference(data['base']['total']['roi'] , data['simulated']['total']['roi']),
            // }
          

            this.asp = {
                "converted_base": Utils.formatNumber(data['base']['total']['asp'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['asp'],true,false),
                "arrow": data['simulated']['total']['asp'] > data['base']['total']['asp'] ?  'carret-up' : 'carret-down' ,
                "color":  this.colorForDifference(data['base']['total']['asp'] , data['simulated']['total']['asp']),
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['asp'],data['base']['total']['asp']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(Math.round(data['simulated']['total']['asp'])-Math.round(data['base']['total']['asp']),true,false) + ")"
            }

            // debugger

            // this.promo_asp = {
            //     "converted_base": Utils.formatNumber(data['base']['total']['avg_promo_selling_price'],true,false),
            //     "converted_simulated": Utils.formatNumber(data['simulated']['total']['avg_promo_selling_price'],true,false),
            //     "arrow": data['simulated']['total']['asp'] > data['base']['total']['asp'] ?  'carret-up' : 'carret-down' ,
            //     "percent": "(" + Utils.percentageDifference(data['simulated']['total']['avg_promo_selling_price'],data['base']['total']['avg_promo_selling_price']) + "%)",
            //     "converted_difference": "(" + Utils.formatNumber(Math.round(data['simulated']['total']['avg_promo_selling_price'])-Math.round(data['base']['total']['avg_promo_selling_price']),true,false) + ")",
            //     "color":  this.colorForDifference(data['base']['total']['avg_promo_selling_price'] , data['simulated']['total']['avg_promo_selling_price']),
            // }
             
            this.rsvWithoutVat = {
                "converted_base": Utils.formatNumber(data['base']['total']['total_rsv_w_o_vat'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['total_rsv_w_o_vat'],true,false),
                "arrow": data['simulated']['total']['total_rsv_w_o_vat'] > data['base']['total']['total_rsv_w_o_vat'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['total_rsv_w_o_vat'],data['base']['total']['total_rsv_w_o_vat']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['total_rsv_w_o_vat'] - data['base']['total']['total_rsv_w_o_vat'],true,false) + ")",
                "color":  this.colorForDifference(data['base']['total']['total_rsv_w_o_vat'] , data['simulated']['total']['total_rsv_w_o_vat']),
            }

            this.customerMargin = {
                "converted_base": Utils.formatNumber(data['base']['total']['rp'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['rp'],true,false),
                "arrow": data['simulated']['total']['rp'] > data['base']['total']['rp'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['rp'],data['base']['total']['rp']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['rp']-data['base']['total']['rp'],true,false) + ")",
                "color":  this.colorForDifference(data['base']['total']['rp'] , data['simulated']['total']['rp']),
            }
            this.customermargin_rsv = {
                "converted_base": Utils.formatNumber(data['base']['total']['rp_percent'],true,true),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['rp_percent'],true,true),
                "arrow": data['simulated']['total']['rp_percent'] > data['base']['total']['rp_percent'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.formatNumber(data['simulated']['total']['rp_percent']-data['base']['total']['rp_percent'],false,true)+ "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['rp_percent']-data['base']['total']['rp_percent'],false,true) + ")",
                "color":  this.colorForDifference(data['base']['total']['rp_percent'] , data['simulated']['total']['rp_percent']),
            }

            // this.message1 = Utils.generateMessage1(this.mac , "MAC")
            // this.message3 = Utils.generateMessage3(this.tradeExpence)
            // this.message2 = Utils.generateMessage2(this.customerMargin)
            this.randomResult = Utils.generateMessageRandomSimulator(this.index,data,this.customerMargin,this.mac,this.baseline)

            this.cogs = {
                "converted_base": Utils.formatNumber(data['base']['total']['cogs'],true,false),
                "converted_simulated": Utils.formatNumber(data['simulated']['total']['cogs'],true,false),
                "arrow": data['simulated']['total']['cogs'] > data['base']['total']['cogs'] ?  'carret-up' : 'carret-down' ,
                "percent": "(" + Utils.percentageDifference(data['simulated']['total']['cogs'],data['base']['total']['cogs']) + "%)",
                "converted_difference": "(" + Utils.formatNumber(data['simulated']['total']['cogs']-data['base']['total']['cogs'],true,false) + ")",
                "color":  this.colorForDifference(data['base']['total']['cogs'] , data['simulated']['total']['cogs']),
            }
            

            let weeks: number = data['base']['weekly'].length
            // debugger;
            for(let i = 0; i < 52; i++){
                let promotion_value = ''
                let promotion_value_simulated = ''
                
              
                promotion_value =  Utils.genratePromotion(
                            (data['base']['weekly'][i]['promo_price']*1.08).toFixed(2),
                            data['base']['weekly'][i]['cost_share'],
                            data['base']['weekly'][i]['vol_on_deal'],
                            data['base']['weekly'][i]['promo_depth'],
                            data['base']['weekly'][i]['promo_activity'],
                )
                promotion_value_simulated =  Utils.genratePromotion(
                            (data['simulated']['weekly'][i]['promo_price']*1.08).toFixed(2),
                            data['simulated']['weekly'][i]['cost_share'],
                            data['simulated']['weekly'][i]['vol_on_deal'],
                            data['simulated']['weekly'][i]['promo_depth'],
                            data['simulated']['weekly'][i]['promo_activity'],
                )
                // if(data['base']['weekly'][i]['flag_promotype_motivation'] == 1){
                //     promotion_value = 'Motivation - '+data['base']['weekly'][i]['promo_depth']+'%';
                // }
                // else if(data['base']['weekly'][i]['flag_promotype_n_pls_1'] == 1){
                //     promotion_value = 'N+1 - '+data['base']['weekly'][i]['promo_depth']+'%';
                // }
                // else if(data['base']['weekly'][i]['flag_promotype_traffic'] == 1){
                //     promotion_value = 'Traffic - '+data['base']['weekly'][i]['promo_depth']+'%';
                // }
                // else{
                //     promotion_value = 'TPR - '+data['base']['weekly'][i]['promo_depth']+'%';
                // }
                // debugger;
                 
                let weekObj = {
                    'duration': {
                        'week':"Week "+(i+1),
                        'date': data['simulated']['weekly'][i].date,
                        "si" : data['simulated']['weekly'][i].si,
                        //"holiday" :this.get_holiday_calendar(data['holiday_calendar'][i][i+1])
                        //  this.get_holiday_information(data['base']['weekly'][i].holiday , 
                        // data['holiday_array']
                        // )
                         // , 
                    },
                    'promotions': {
                        'promotion_value' : promotion_value,
                        'promotion_value_simulated' : promotion_value_simulated,
                        'coinvestment': data['base']['weekly'][i]['cost_share']
                    },
                    'predicted_units': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['predicted_units'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['predicted_units'],true,false),
                        "arrow": data['simulated']['weekly'][i]['predicted_units'] > data['base']['weekly'][i]['predicted_units'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['predicted_units'],data['base']['weekly'][i]['predicted_units']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['predicted_units']-data['base']['weekly'][i]['predicted_units'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['predicted_units'] , data['simulated']['weekly'][i]['predicted_units']),
                    },
                    'base_unit': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['base_unit'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['base_unit'],true,false),
                        "arrow": data['simulated']['weekly'][i]['base_unit'] > data['base']['weekly'][i]['base_unit'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['base_unit'],data['base']['weekly'][i]['base_unit']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['base_unit']-data['base']['weekly'][i]['base_unit'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['base_unit'] , data['simulated']['weekly'][i]['base_unit']),
                    },
                    'incremental_unit': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['incremental_unit'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['incremental_unit'],true,false),
                        "arrow": data['simulated']['weekly'][i]['incremental_unit'] > data['base']['weekly'][i]['incremental_unit'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['incremental_unit'],data['base']['weekly'][i]['incremental_unit']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['incremental_unit']-data['base']['weekly'][i]['incremental_unit'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['incremental_unit'] , data['simulated']['weekly'][i]['incremental_unit']),
                    },
                    'total_weight_in_tons': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['total_weight_in_tons'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['total_weight_in_tons'],true,false),
                        "arrow": data['simulated']['weekly'][i]['total_weight_in_tons'] > data['base']['weekly'][i]['total_weight_in_tons'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['total_weight_in_tons'],data['base']['weekly'][i]['total_weight_in_tons']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['total_weight_in_tons']-data['base']['weekly'][i]['total_weight_in_tons'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['total_weight_in_tons'] , data['simulated']['weekly'][i]['total_weight_in_tons']),
                    },
                    'total_lsv': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['total_gsv'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['total_gsv'],true,false),
                        "arrow": data['simulated']['weekly'][i]['total_gsv'] > data['base']['weekly'][i]['total_gsv'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['total_gsv'],data['base']['weekly'][i]['total_gsv']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['total_gsv']-data['base']['weekly'][i]['total_gsv'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['total_gsv'] , data['simulated']['weekly'][i]['total_gsv']),
                    },
                    'total_nsv': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['total_nsv'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['total_nsv'],true,false),
                        "arrow": data['simulated']['weekly'][i]['total_nsv'] > data['base']['weekly'][i]['total_nsv'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['total_nsv'],data['base']['weekly'][i]['total_nsv']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['total_nsv']-data['base']['weekly'][i]['total_nsv'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['total_nsv'] , data['simulated']['weekly'][i]['total_nsv']),
                    },
                    'mars_mac': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['mars_mac'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['mars_mac'],true,false),
                        "arrow": data['simulated']['weekly'][i]['mars_mac'] > data['base']['weekly'][i]['mars_mac'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['mars_mac'],data['base']['weekly'][i]['mars_mac']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['mars_mac']-data['base']['weekly'][i]['mars_mac'],true,false) + ")",
                        "color":  this.colorForDifference(data['base']['weekly'][i]['mars_mac'] , data['simulated']['weekly'][i]['mars_mac']),
                    },
                    'trade_expense': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['total_trade_expense'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['total_trade_expense'],true,false),
                        "arrow": data['simulated']['weekly'][i]['total_trade_expense'] > data['base']['weekly'][i]['total_trade_expense'] ?  'carret-up' : 'carret-down' ,
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['total_trade_expense'],data['base']['weekly'][i]['total_trade_expense']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['total_trade_expense']-data['base']['weekly'][i]['total_trade_expense'],true,false) + ")",
                        "color":  this.colorForDifference(data['simulated']['weekly'][i]['total_trade_expense'],data['base']['weekly'][i]['total_trade_expense'] ),
                    },
                    // 'te_percent_of_lsv': {
                    //     "converted_base": Utils.formatNumber(data['base']['weekly'][i]['te_percent_of_gsv'],true,false),
                    //     "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['te_percent_of_gsv'],true,false),
                    //     "arrow": data['simulated']['weekly'][i]['te_percent_of_gsv'] > data['base']['weekly'][i]['te_percent_of_gsv'] ?  'carret-up' : 'carret-down' ,
                    //     "color": this.colorForDifference(data['simulated']['weekly'][i]['te_percent_of_gsv'],data['base']['weekly'][i]['te_percent_of_gsv']),
                    //     "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['te_percent_of_gsv'],data['base']['weekly'][i]['te_percent_of_gsv']) + "%)",
                    //     "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['te_percent_of_gsv']-data['base']['weekly'][i]['te_percent_of_gsv'],true,false) + ")"
                    // },
                    'lift_percent': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['lift']*100,true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['lift']*100,true,false),
                        "arrow": data['simulated']['weekly'][i]['lift']*100 > data['base']['weekly'][i]['lift']*100 ?  'carret-up' : 'carret-down' ,
                        "color": this.colorForDifference(data['base']['weekly'][i]['lift']*100 , data['simulated']['weekly'][i]['lift']*100),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['lift']*100,data['base']['weekly'][i]['lift']*100) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['lift']*100-data['base']['weekly'][i]['lift']*100,true,false) + ")"
                    },
                    // 'roi': {
                    //     "converted_base": Utils.formatNumber(data['base']['weekly'][i]['roi'],true,false),
                    //     "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['roi'],true,false),
                    //     "arrow": data['simulated']['weekly'][i]['roi'] > data['base']['weekly'][i]['roi'] ?  'carret-up' : 'carret-down' ,
                    //     "color": this.colorForDifference(data['base']['weekly'][i]['roi'] , data['simulated']['weekly'][i]['roi']),
                    //     "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['roi'],data['base']['weekly'][i]['roi']) + "%)",
                    //     "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['roi']-data['base']['weekly'][i]['roi'],true,false) + ")"
                    // },
                    // 'promo_asp': {
                    //     "converted_base": Utils.formatNumber(data['base']['weekly'][i]['promo_asp'],true,false),
                    //     "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['promo_asp'],true,false),
                    //     "arrow": data['simulated']['weekly'][i]['promo_asp'] > data['base']['weekly'][i]['promo_asp'] ?  'carret-up' : 'carret-down' ,
                    //     "color": this.colorForDifference(data['base']['weekly'][i]['promo_asp'] , data['simulated']['weekly'][i]['promo_asp']),
                    //     "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['promo_asp'],data['base']['weekly'][i]['promo_asp']) + "%)",
                    //     "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['promo_asp']-data['base']['weekly'][i]['promo_asp'],true,false) + ")"
                    // },
                    'promo_price': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['promo_price']*1.08,true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['promo_price']*1.08,true,false),
                        "arrow": data['simulated']['weekly'][i]['promo_price']*1.08 > data['base']['weekly'][i]['promo_price']*1.08 ?  'carret-up' : 'carret-down' ,
                        "color": this.colorForDifference(data['base']['weekly'][i]['promo_price']*1.08 , data['simulated']['weekly'][i]['promo_price']*1.08),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['promo_price']*1.08,data['base']['weekly'][i]['promo_price']*1.08) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['promo_price']*1.08-data['base']['weekly'][i]['promo_price']*1.08,true,false) + ")"
                    },
                    'asp': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['asp'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['asp'],true,false),
                        "arrow": data['simulated']['weekly'][i]['asp'] > data['base']['weekly'][i]['asp'] ?  'carret-up' : 'carret-down' ,
                        "color":  this.colorForDifference(data['base']['weekly'][i]['asp'] , data['simulated']['weekly'][i]['asp']),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['asp'],data['base']['weekly'][i]['asp']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['asp']-data['base']['weekly'][i]['asp'],true,false) + ")"
                    },
                    'te_per_units': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['te_per_units'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['te_per_units'],true,false),
                        "arrow": data['simulated']['weekly'][i]['te_per_units'] > data['base']['weekly'][i]['te_per_units'] ?  'carret-up' : 'carret-down' ,
                        "color":  this.colorForDifference( data['simulated']['weekly'][i]['te_per_units'],data['base']['weekly'][i]['te_per_units'] ),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['te_per_units'],data['base']['weekly'][i]['te_per_units']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['te_per_units']-data['base']['weekly'][i]['te_per_units'],true,false) + ")"
                    },
                    'total_rsv_w_o_vat': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['total_rsv_without_tax'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['total_rsv_without_tax'],true,false),
                        "arrow": data['simulated']['weekly'][i]['total_rsv_without_tax'] > data['base']['weekly'][i]['total_rsv_without_tax'] ?  'carret-up' : 'carret-down' ,
                        "color":  this.colorForDifference(data['base']['weekly'][i]['total_rsv_without_tax'] , data['simulated']['weekly'][i]['total_rsv_without_tax']),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['total_rsv_without_tax'],data['base']['weekly'][i]['total_rsv_without_tax']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['total_rsv_without_tax']-data['base']['weekly'][i]['total_rsv_without_tax'],true,false) + ")"
                    },
                    'retailer_margin': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['retailer_margin'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['retailer_margin'],true,false),
                        "arrow": data['simulated']['weekly'][i]['retailer_margin'] > data['base']['weekly'][i]['retailer_margin']  ?  'carret-up' : 'carret-down' ,
                        "color":  this.colorForDifference(data['base']['weekly'][i]['retailer_margin'] , data['simulated']['weekly'][i]['retailer_margin']),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['retailer_margin'],data['base']['weekly'][i]['retailer_margin']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['retailer_margin']-data['base']['weekly'][i]['retailer_margin'],true,false) + ")"
                    },
                    'retailer_margin_percent_of_rsp': {
                        "converted_base": Utils.formatNumber(data['base']['weekly'][i]['rp_percent'],true,false),
                        "converted_simulated": Utils.formatNumber(data['simulated']['weekly'][i]['rp_percent'],true,false),
                        "arrow":data['simulated']['weekly'][i]['rp_percent'] > data['base']['weekly'][i]['rp_percent'] ?  'carret-up' : 'carret-down' ,
                        "color":  this.colorForDifference(data['base']['weekly'][i]['rp_percent'] , data['simulated']['weekly'][i]['rp_percent']),
                        "percent": "(" + Utils.percentageDifference(data['simulated']['weekly'][i]['rp_percent'],data['base']['weekly'][i]['rp_percent']) + "%)",
                        "converted_difference": "(" + Utils.formatNumber(data['simulated']['weekly'][i]['rp_percent']-data['base']['weekly'][i]['rp_percent'],true,false) + ")"
                    },
                }
                this.weeklyData.push(weekObj)
            }
            console.log(this.weeklyData)
        }
    }

    // Get simulated data
    loadStimulatedData() {
       
    }

    colorForDifference(base:any, simulated:any){
        base  = parseFloat(base.toFixed(4));
        simulated  = parseFloat(simulated.toFixed(4));
        if(simulated > base){
            return 'green'
        }
        else if(simulated < base){
            return 'red'
        }
        else if(base == simulated){
            return 'neutral'
        }
        return 'green'
    }

    @ViewChild('weekly', { static: false }) weekly: any;
    scrolling_table: any;

    ngAfterViewInit() {
        // this.slider = this.elRef.nativeElement.querySelector('.slide');
        this.scrolling_table = this.elRef.nativeElement.querySelector('.weeklyScenariotable');
        this.scrolling_table.addEventListener('scroll', this.freeze_pane_listener(this.scrolling_table));
    }

    freeze_pane_listener(what_is_this: { scrollTop: string; scrollLeft: string }) {
        return () => {
            var i;
            var self = this;
            self.translate_y = '';

            var translate_y = 'translate(0px,' + what_is_this.scrollTop + 'px)';
            var translate_x = 'translate(' + what_is_this.scrollLeft + 'px)';
            var translate_xy = 'translate(' + what_is_this.scrollLeft + 'px,' + what_is_this.scrollTop + 'px)';

            self.currentTranslateRate = what_is_this.scrollLeft;

            var fixed_vertical_elts = document.getElementsByClassName(
                'freeze_vertical',
            ) as HTMLCollectionOf<HTMLElement>;
            var fixed_horizontal_elts = document.getElementsByClassName(
                'freeze_horizontal',
            ) as HTMLCollectionOf<HTMLElement>;
            var fixed_both_elts = document.getElementsByClassName('freeze') as HTMLCollectionOf<HTMLElement>;

            for (i = 0; i < fixed_horizontal_elts.length; i++) {
                // fixed_horizontal_elts[i].style.webkitTransform = translate_x;
                fixed_horizontal_elts[i].style.transform = translate_x;
            }
            for (i = 0; i < fixed_vertical_elts.length; i++) {
                // fixed_vertical_elts[i].style.webkitTransform = translate_y;
                fixed_vertical_elts[i].style.transform = translate_y;
            }
            for (i = 0; i < fixed_both_elts.length; i++) {
                // fixed_both_elts[i].style.webkitTransform = translate_xy;
                fixed_both_elts[i].style.transform = translate_xy;
            }
        };
    }

    singleSelect: any = [{
        _id: '1year',
        index: 1,
        balance: '$2,984.98',
        picture: 'http://placehold.it/32x32',
        name: '1 years',
    }];
    config = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: false,
    };
    optionsNormal = [
        {
            _id: '3years',
            index: 0,
            balance: '$2,806.37',
            picture: 'http://placehold.it/32x32',
            name: '3 years',
        },
        {
            _id: '1year',
            index: 1,
            balance: '$2,984.98',
            picture: 'http://placehold.it/32x32',
            name: '1 years',
        },
        {
            _id: '2year',
            index: 1,
            balance: '$2,984.98',
            picture: 'http://placehold.it/32x32',
            name: '2 years',
        },
    ];

    openTab = 1;
    toggleTabs($tabNumber: number): void {
        this.openTab = $tabNumber;
    }
}
