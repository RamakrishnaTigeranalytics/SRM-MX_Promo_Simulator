import { Component, Input, Output, EventEmitter, OnInit, OnDestroy,SimpleChanges } from '@angular/core';
// import {OptimizerService} from '../../../core/services/optimizer.service'
import {OptimizerService , SimulatorService} from "@core/services"
// import {ProductWeek , Product, CheckboxModel,LoadedScenarioModel} from "../../../core/models"
import {ProductWeek , Product, CheckboxModel,LoadedScenarioModel , UploadModel, FilterModel, ListPromotion} from "@core/models"
import { Observable, of, from, BehaviorSubject, combineLatest , Subject } from 'rxjs';
import {takeUntil} from "rxjs/operators"
import * as utils from "@core/utils"
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'nwn-loaded-scenario-header',
    templateUrl: './loaded-scenario-header.component.html',
    styleUrls: ['./loaded-scenario-header.component.css'],
})
export class LoadedScenarioHeaderComponent implements OnInit,OnDestroy {
    private unsubscribe$: Subject<any> = new Subject<any>();
    @Input()
    hidepanel = true
    @Input()
    disable_button = true
    @Input()
    title: string = 'Untitled';
    @Output()
    filterResetEvent = new EventEmitter()
    @Output()
    modalEvent = new EventEmitter<string>();
    @Output()
    downloadEvent = new EventEmitter<any>();
    @Output()
    simulateResetEvent = new EventEmitter<{"action" : string,"promotion_map" : Array<any> , "promo_elasticity" : number}>();
    @Input()
    filter_model : FilterModel
    @Input()
    disable_save_download = true
    options1:Array<any> = [];
    promotions$: Observable<string[]> = null as any;
    product_week:ProductWeek[] = [];
    genobj : {[key:string] : any[]  } = {}
    quarter_year:Array<string> = [];
    selected_quarter:string = ''
    selected_product_week : ProductWeek[] = []
    promotion_map:Array<any> = [] //{"selected_promotion" : $event.value , "week" : this.product_week }
    available_year:any[] = ["1 year" , "2 years" , "3 years"]
    loaded_scenario:LoadedScenarioModel = null as any
    promo_elasticity = 0

    // hidepanel = true
    constructor(private toastr: ToastrService,private optimize : OptimizerService,private simulatorService : SimulatorService){

    }
    ngOnInit(){
        this.optimize.getUploadedScenarioObservable().subscribe((uploadData:UploadModel)=>{
            if(uploadData){
                console.log(uploadData , "get uploaded data ")
                uploadData.simulated.weekly.forEach((data,index)=>{
                    // this.promotion_map
                    let motivation = data.promo_mechanics == 'Motivation'? 1 : 0
                    let n_plus_1 = data.promo_mechanics == 'N+1'? 1 : 0
                    let traffic =  data.promo_mechanics == 'Traffic'? 1 : 0
                    let gen_promo = utils.genratePromotion(
                        motivation,n_plus_1,traffic,
                        data.promo_depth , data.co_investment)
                        if(gen_promo){
                            this.optimize.insert_base_line_promotion(gen_promo)
                        }
                       
                    this.promotion_map.push({
                       
                        "selected_promotion" : gen_promo ,
                         "week" : uploadData.base[index]
                    })
    
                })
                console.log(this.promotion_map , "promotion map")
                // debugger
                this.optimize.setProductWeekObservable(uploadData.base)

            }
           
    // 

        })
        
        
        this.optimize.getLoadedScenarioModel().pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(data=>{
            console.log(data ,"get loaded model")
            if(data){
                this.populatePromotionWeek(data)
                this.title = data.scenario_name
                this.promo_elasticity = data.promo_elasticity | 0

            }
            else{
                this.title = "Untitled"

            }
           
            
        })
       this.optimize.getPromotionObservable().pipe(
        takeUntil(this.unsubscribe$)
       ).subscribe(data=>{
           if (data.length > 0){
               console.log(data , "get promotion data")
               this.options1 = data
               console.log(this.options1, "options 1")

           }
          
       })

        this.optimize.getProductWeekObservable().pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(weekdata=>{
            console.log(weekdata , "week data errors")
            if(weekdata.length == 0){
                // this.hidepanel = true
                this.product_week = []
                this.optimize.set_baseline_null()
                this.available_year =["1 year" , "2 years" , "3 years"]
                this.quarter_year = []
                this.selected_quarter = ''
                this.selected_product_week  = []
                this.optimize.setPromotionObservable([])
                this.disable_button = true
                this.promotion_map = []
                this.promo_elasticity = 0

            }
            else{
                let promo_depth : Array<string> = []
                
                weekdata.forEach(data=>{
                    let gen_promo = utils.genratePromotion(
                        parseFloat(data.flag_promotype_motivation) , 
                        parseFloat(data.flag_promotype_n_pls_1),
                        parseFloat(data.flag_promotype_traffic),
                        parseFloat(data.promo_depth) , 
                        parseFloat(data.co_investment)
                    )
                    data.promotion_name = gen_promo
                    if(gen_promo && !promo_depth.includes(gen_promo)){
                      
                        promo_depth.push(gen_promo)
                    }
                    let str = "Y" + 1 + " Q"+data.quater as string
                    if(!this.quarter_year.includes(str)){
                        this.quarter_year.push(str);

                    }
                    // if(str in this.genobj){
                    //     this.genobj[str].push(data)
                    //     // append(data)
                    // }
                    // else{
                    //     this.quarter_year.push(str);
                    //     this.genobj[str] = [data]
                    // }
                    data.promo_depth = parseInt(data.promo_depth)
                    data.co_investment = (data.co_investment)
    
                })
                console.log(this.available_year , "Available year")
                // this.options1 = promo_depth
                this.optimize.set_base_line_promotion(promo_depth)
                this.options1 = this.optimize.get_base_line_promotions()
                console.log(this.options1 , "options for drop down promotion")
                this.product_week = weekdata
                // this.hidepanel = false
                this.selected_quarter = this.quarter_year[0]
                this.selected_product_week  = this.product_week.filter(data=>data.quater == parseInt(
                    this.selected_quarter.split("Q")[1]
                    )
                    ).sort((a,b)=>(a.week > b.week) ? 1 : ((b.week > a.week) ? -1 : 0))
                console.log(this.genobj , "gen obj")

                this.disable_button = false
               
              }

            },
            
           error=>{
            console.log(error , "error")
          })
    }

    closeClicked($event){
        // closeClicked

        this.filterResetEvent.emit($event)
        
    }
    
    downloadWeeklyInput(){
        if(this.disable_button){
            return
        }
        console.log(this.filter_model , "avaible model")
        let queryObj = {
            "account_name" : this.filter_model.retailer,
            "product_group" : this.filter_model.product_group
        }

        this.simulatorService.downloadWeeklyInputTemplate(queryObj).subscribe(data=>{
        this.toastr.success('File Downloaded Successfully','Success');
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });    
        FileSaver.saveAs(
            blob,
            'WeeklyInput' + '_Template_' + new Date().getTime() + 'xlsx'
          );
        })
       
    }
    populatePromotionWeek(scenario : LoadedScenarioModel){
        let pw:ProductWeek[]=[];
        console.log(this.promotion_map , "promotion map vallllllllllllllllllllllllllllllll")
        this.promotion_map = []
        
        scenario.base.weekly.forEach((data,index)=>{
            let simulated_depth = scenario.simulated.weekly[index].promo_depth
            let simulated_coinv = scenario.simulated.weekly[index].co_investment
            let simulated_n_plus_1 = scenario.simulated.weekly[index].flag_promotype_n_pls_1
            let simulated_motivation = scenario.simulated.weekly[index].flag_promotype_motivation
            let simulated_traffic = scenario.simulated.weekly[index].flag_promotype_traffic
            console.log(simulated_depth , "simulated depth")
            if(simulated_depth){
                //{"selected_promotion" : $event.value , "week" : this.product_week }
                this.promotion_map.push({
                    "selected_promotion" : utils.genratePromotion(
                        simulated_motivation,simulated_n_plus_1,simulated_traffic,simulated_depth,
                        simulated_coinv

                    ) ,
                     "week" : data
                })
            }
           pw.push({
            "model_meta": 0,
            "year": parseInt(data.year),
            "quater": data.quater,
            "month": data.month,
            "period": data.period,
            "week": data.week,
            "date": data.date,
            "promo_depth": data.promo_depth,
            "co_investment": data.co_investment,
            "flag_promotype_motivation": data.flag_promotype_motivation,
            "flag_promotype_n_pls_1": data.flag_promotype_n_pls_1,
            "flag_promotype_traffic": data.flag_promotype_traffic
           })

        })
        console.log(this.promotion_map , "final promotion map")
        this.optimize.setProductWeekObservable(pw)

    }
    promotionChange($event:any){
        let promo =  this.promotion_map.find(p=>p.week.week == $event.week.week) 
        console.log(promo , "promo filtered")
        if(promo){
            promo['selected_promotion'] = $event['selected_promotion']

        }
        else{
            this.promotion_map = [...this.promotion_map, $event];
            // this.promotion_map.push($event)

        }
      
        console.log($event , "promotion change in header")
        console.log(this.promotion_map , "promotion map")
    }
    copyBaseline(){
        this.promotion_map = []
        // {"selected_promotion" : $event.value , "week" : this.product_week }
        this.product_week.forEach(data=>{
            
            let val = (parseFloat((data.promo_depth).toString()))
            if(val){
                this.promotion_map.push({
                    "selected_promotion": utils.genratePromotion(
                        parseFloat(data.flag_promotype_motivation)
                        ,parseFloat(data.flag_promotype_n_pls_1),parseFloat(data.flag_promotype_traffic),
                        parseFloat(data.promo_depth),parseFloat(data.co_investment)
                    ),
                    // "TPR-"+val+"%",
                    "week" : data})
            
                // console.log(val , "values fro ", data.week , " discont " ,  "TPR-"+val+"%")
            }
            data.promo_depth = val
            // data.promo_depth = val
            data.co_investment = (parseFloat((data.co_investment).toString()))
            // promo_depth.map(val=>"TPR-"+val+"%")
        })
        console.log(this.promotion_map , "promotion map change")


        // debugger
    }
    changeYear(){
        let y2 = ['Y2 Q1','Y2 Q2','Y2 Q3','Y2 Q4']
        let y3 = ['Y3 Q1','Y3 Q2','Y3 Q3','Y3 Q4']
        console.log(this.singleSelect , "single selecct")
        if(this.singleSelect == "2 years"){
            // debugger
            this.quarter_year = [...this.quarter_year , ...y2]
            this.quarter_year = this.quarter_year.filter(e=>!y3.includes(e))
            this.quarter_year =[...new Set(this.quarter_year)]
            return
        }
        if(this.singleSelect == "3 years"){
            this.quarter_year = [...this.quarter_year , ...y2 , ...y3]
            this.quarter_year =[...new Set(this.quarter_year)]
            return
        }
        this.quarter_year = this.quarter_year.filter(e=>(!y3.includes(e) && (!y2.includes(e))))
        this.quarter_year =[...new Set(this.quarter_year)]
        console.log(this.quarter_year , "quarter year")
    }
    changeQuarter(key:string){  
        if(key.includes("Y2") || key.includes("Y3")){
            this.toastr.warning("Only one year data available")
            return
        }
        
        // debugger
        this.selected_quarter = key
        this.selected_product_week  = this.product_week.filter(data=>data.quater == parseInt(
            this.selected_quarter.split("Q")[1]
            )
            ).sort((a,b)=>(a.week > b.week) ? 1 : ((b.week > a.week) ? -1 : 0))
    }

    simulateAndReset(type){
        console.log(this.promo_elasticity , "promo elasticity")
        console.log(this.disable_button , "hiding panel")
        if(!this.disable_button){
            this.simulateResetEvent.emit({
                "action" : type,
                "promotion_map" : this.promotion_map,
                "promo_elasticity" : this.promo_elasticity
            })

        }
        return
        
       
    }

    sendMessage(modalType: string): void {
        this.isShowDivIf = true
        if(modalType == 'save-scenario-popup'){
            if(this.disable_button){
                return
            }
        }
        this.modalEvent.emit(modalType);
    }
    download(){
        if(this.disable_button){
            return
        }
        this.downloadEvent.emit()

    }

    isShowDivIf = true;

    toggleDisplayDivIf() {
        this.isShowDivIf = !this.isShowDivIf;
    }

    singleSelect: any = [];
    config = {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: false,
        placeholder:'Time period'
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
    


    // options1 = [
    //     {
    //         _id: 'N230%(Co30%)',
    //         index: 0,
    //         name: 'N+2-30% (Co-30%)',
    //     },
    //     {
    //         _id: 'N230%(Co30%)s',
    //         index: 1,
    //         name: 'N+2-30% (Co-30%)',
    //     },
    //     {
    //         _id: 'N230%(Co30%)a',
    //         index: 1,
    //         name: 'N+2-30% (Co-30%)',
    //     },
    // ];
    options2 = [
        {
            _id: 'N230%(Co30%)1',
            index: 0,
            name: 'N+2-30% (Co-30%)1',
        },
        {
            _id: 'N230%(Co30%)s2',
            index: 1,
            name: 'N+2-30% (Co-30%)2',
        },
        {
            _id: 'N230%(Co30%)a3',
            index: 1,
            name: 'N+2-30% (Co-30%)3',
        },
    ];
    options3 = [
        {
            _id: 'N230%(Co30%)2',
            index: 0,
            name: 'N+2-30% (Co-30%)2',
        },
        {
            _id: 'N230%(Co30%)s2',
            index: 1,
            name: 'N+2-30% (Co-30%)4',
        },
        {
            _id: 'N230%(Co30%)a3',
            index: 1,
            name: 'N+2-30% (Co-30%)3',
        },
    ];

    ngOnDestroy(){
        console.log("destroying sceario header")
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    ngOnChanges(changes: SimpleChanges) {
 
        for (let property in changes) {
            if (property === 'hidepanel') {
                // console.log(changes[property].currentValue , "current value")
                this.hidepanel = changes[property].currentValue

                
                
               
            } 
            if (property === 'title') {
                console.log(changes[property].currentValue , "current value")
                this.title = changes[property].currentValue

                
                
               
            } 
        }
    }
}
