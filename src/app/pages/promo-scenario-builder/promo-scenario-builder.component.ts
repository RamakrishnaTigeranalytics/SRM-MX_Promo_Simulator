/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';

import { ModalService } from '@molecules/modal/modal.service';
import {FormBuilder, FormGroup,FormArray,FormControl,ValidatorFn} from '@angular/forms';
import {OptimizerService,PricingService} from '@core/services'
import {ProductWeek , Product, CheckboxModel,LoadedScenarioModel,UploadModel, ListPromotion, FilterModel, MetaInfo} from "@core/models"
import * as utils from "@core/utils"
// import {} from 'file-saver'
import * as FileSaver from 'file-saver';
// import weeklyPromotionStories from '@molecules/weekly-promotion/weekly-promotion.stories';
// import { ThisReceiver } from '@angular/compiler';
import { SimulatorService } from "@core/services";
import { tickStep } from 'd3';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'nwn-promo-scenario-builder',
    templateUrl: './promo-scenario-builder.component.html',
    styleUrls: ['./promo-scenario-builder.component.css'],
})
export class PromoScenarioBuilderComponent implements OnInit {
    scenarioTitle:any = 'Untitled'
    hidepanel = true
    isFilterApplied: boolean = false
    hideFilter: string = 'yettobesimulated'
    title = "Untitled"
    save_scenario_error:any = null
    show_save:any = null
    form: FormGroup = null as any;
    promotion_viewed : ListPromotion = null as any
    product:Product[] = []
    product_week:ProductWeek[] = [];
    genobj : {[key:string] : any[]  } = {}
    quarter_year:Array<string> = [];
    selected_quarter:string = ''
    selected_product_week : ProductWeek[] = []
    retailers:Array<CheckboxModel> = []
    categories:Array<CheckboxModel> = [] 
    strategic_cell:Array<CheckboxModel> = []
    brands_format:Array<CheckboxModel> = []
    brands:Array<CheckboxModel> = []
    product_group:Array<CheckboxModel> = []
    filter_model : FilterModel = {"retailer" : "Retailers" , "brand" : 'Brands' , "brand_format" : 'Brand Formats' ,
"category" : 'Category' , "product_group" : 'Product groups' , "strategic_cell" :  'Strategic cells'}
    selected_retailer:string = null as any
    selected_product:string = null as any
    selected_category:string = null as any
    selected_strategic_cell:string = null as any
    selected_brand:string = null as any
    selected_brand_format:string = null as any
    promotion_map:Array<any> = []
    loaded_scenario:LoadedScenarioModel = null as any
    scenario_comment=''
    scenario_name = ''
    uploaded_file:any = null
    searchText = "";
    disable_save_download = true
    loadScenarioPopuptitle:any = 'Load scenario'
    get ordersFormArray() {
        return this.form.controls.orders as FormArray;
      }

    constructor(private toastr: ToastrService,private modalService: ModalService,public restApi: SimulatorService,
        private optimize : OptimizerService,private formBuilder: FormBuilder,
        private pricingService : PricingService
        ) {

            this.form = this.formBuilder.group({
                orders: new FormArray([])
              });

        }

    ngOnInit() {
        this.restApi.setIsSaveScenarioLoadedObservable(null)
        
        this.scenarioTitle = "Untitled"
        this.restApi.openCommandInterfaceModal.asObservable().subscribe(data=>{
            if(data != ''){
                console.log(data)
                // this.isFilterApplied = true
                // this.hideFilter = 'viewless'
                this.closeModal(data.close)
                this.openModal(data.open)
            }
        })
        this.restApi.getSignoutPopupObservable().subscribe(data=>{
            if(data != ''){
                if(data.type == 'simulator'){
                    this.loadScenarioPopuptitle = 'My scenario'
                    this.openModal(data.id)
                }
            }
        })

        this.optimize.fetchVal().subscribe(data=>{
            this.reset()
            this.product = data
            this._populateFilters(this.product)

          },error=>{
            console.log(error , "error")
            throw error
          })
      
    }
    _reset_checkbox(checkboxArray : CheckboxModel[]){
        checkboxArray.filter(d=>{
            if(d.checked){
                d.checked = false
            }
        })

    }
    filterResetEvent($event){
        console.log($event , "filter and reset event")
        // {"retailer" : "Retailers" , "brand" : 'Brands' , "brand_format" : 'Brand Formats' ,
        // "category" : 'Category' , "product_group" : 'Product groups' , "strategic_cell" :  'Strategic cells'}
        if($event == 'Retailers'){
            // this.selected_retailer = "Retailers"
            this.filter_model.retailer = $event
            this._reset_checkbox(this.retailers)
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
        this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
        this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
        this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
        this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));

        }
        else if($event == 'Category'){
            this.filter_model.category = $event
            this._reset_checkbox(this.categories)
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" :  (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));

        }
        else if($event == 'Brands'){
            this.filter_model.brand = $event
            this._reset_checkbox(this.brands)
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));

        }
        else if($event == 'Brand Formats'){
            this.filter_model.brand_format = $event
            this._reset_checkbox(this.brands_format)
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    
        }
        else if($event == 'Product groups'){
            this.filter_model.product_group = $event
            this._reset_checkbox(this.product_group)
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.brands  = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    
        }
        else if($event == 'Strategic cells'){
            this.filter_model.strategic_cell = $event
            this._reset_checkbox(this.strategic_cell)
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));

        }
    }
    filterApply(event){
        console.log(event,"after apply")
        if(event.key != undefined){
            if(event.key == 'Retailer'){
                this.filter_model = {...this.filter_model , ...{"retailer" : this.selected_retailer}}
                // this.filter_model.retailer = this.selected_retailer
                console.log(this.filter_model , "filter model")
            }
            else if(event.key == 'Category'){
                this.filter_model = {...this.filter_model , ...{"category" : this.selected_category}}
            }
            else if(event.key == 'Strategic cells'){
                this.filter_model = {...this.filter_model , ...{"strategic_cell" : this.selected_strategic_cell}}
                 
            }
            else if(event.key == 'Brands'){
                this.filter_model = {...this.filter_model , ...{"brand" : this.selected_brand}}
            }
            else if(event.key == 'Brand Formats'){
                this.filter_model = {...this.filter_model , ...{"brand_format" : this.selected_brand_format}}
                // this.filter_model.brand_format = this.selected_brand_format
            }
            else if(event.key == 'Product groups'){
                this.filter_model = {...this.filter_model , ...{"product_group" : this.selected_product}}
                // this.filter_model.product_group = this.selected_product
            }
        }
    }
    retailerChange(event:CheckboxModel){
        console.log(event , "event checked")
        this.retailers.filter(val=>val.value != event.value).forEach(val=>val.checked = false)
        if(event.checked){
            this.selected_retailer = event.value
            // this.filter_model.retailer = this.selected_retailer
            this.retailers.filter(val=>val.value == event.value).forEach(val=>val.checked = true)

            this.categories = [...new Set(this.product.filter(val=>val.account_name == event.value).map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
        this.product_group = [...new Set(this.product.filter(val=>val.account_name == event.value).map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
        this.strategic_cell = [...new Set(this.product.filter(val=>val.account_name == event.value).map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
        this.brands_format = [...new Set(this.product.filter(val=>val.account_name == event.value).map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
        this.brands = [...new Set(this.product.filter(val=>val.account_name == event.value).map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));

        }
        else{
            this.selected_retailer = 'Retailers'

            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
        this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
        this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
        this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
        this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));


        }
        
       
    }
    categoryChange(event:CheckboxModel){
        console.log(event)
        console.log(this.selected_retailer , "selected reatilser")
        this.categories.filter(val=>val.value != event.value).forEach(val=>val.checked = false)
        if(event.checked){
            this.selected_category = event.value

            this.categories.filter(val=>val.value == event.value).forEach(val=>val.checked = true)
            
            // this.filter_model.category = this.selected_category
            this.strategic_cell = [...new Set(this.product.filter(val=>val.corporate_segment == event.value).map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.filter(val=>val.corporate_segment == event.value).map(item => item.product_group))].map(e=>({"value" : e,"checked" :  (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.filter(val=>val.corporate_segment == event.value).map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.filter(val=>val.corporate_segment == event.value).map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.brands = [...new Set(this.product.filter(val=>val.corporate_segment == event.value).map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));

        }
        else{
            this.selected_category = 'Category'
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" :  (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));


        }
       
// debugger

    }

    strategicCellChange(event:CheckboxModel){
        this.strategic_cell.filter(val=>val.value != event.value).forEach(val=>val.checked = false)
        if(event.checked){
            this.selected_strategic_cell = event.value
            this.strategic_cell.filter(val=>val.value == event.value).forEach(val=>val.checked = true)
            // this.filter_model.strategic_cell = this.selected_strategic_cell
            this.categories = [...new Set(this.product.filter(val=>val.strategic_cell_filter == event.value).map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
            this.product_group = [...new Set(this.product.filter(val=>val.strategic_cell_filter == event.value).map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.filter(val=>val.strategic_cell_filter == event.value).map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.filter(val=>val.strategic_cell_filter == event.value).map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.brands = [...new Set(this.product.filter(val=>val.strategic_cell_filter == event.value).map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));

        }
        else{
            this.selected_strategic_cell = 'Strategic cells'
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));


        }
       

    }
        brandChange(event:CheckboxModel){
        this.brands.filter(val=>val.value != event.value).forEach(val=>val.checked = false)
        if(event.checked){
            this.selected_brand = event.value
            this.brands.filter(val=>val.value == event.value).forEach(val=>val.checked = true)
            // this.filter_model.brand = this.selected_brand

            this.strategic_cell = [...new Set(this.product.filter(val=>val.brand_filter == event.value).map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.filter(val=>val.brand_filter == event.value).map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.filter(val=>val.brand_filter == event.value).map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.filter(val=>val.brand_filter == event.value).map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.categories = [...new Set(this.product.filter(val=>val.brand_filter == event.value).map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    

        }
        else{
            this.selected_brand = 'Brands'
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    

        }
       

    }
    brandFormatChange(event:CheckboxModel){
        this.brands_format.filter(val=>val.value != event.value).forEach(val=>val.checked = false)
        if(event.checked){
            this.selected_brand_format = event.value
            this.brands_format.filter(val=>val.value == event.value).forEach(val=>val.checked = true)
            // this.filter_model.brand_format = this.selected_brand_format

        this.strategic_cell = [...new Set(this.product.filter(val=>val.brand_format_filter == event.value).map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
        this.product_group = [...new Set(this.product.filter(val=>val.brand_format_filter == event.value).map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
        this.retailers = [...new Set(this.product.filter(val=>val.brand_format_filter == event.value).map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
        this.brands = [...new Set(this.product.filter(val=>val.brand_format_filter == event.value).map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));
        this.categories = [...new Set(this.product.filter(val=>val.brand_format_filter == event.value).map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));


        }
        else{
            this.selected_brand_format = 'Brand Formats'
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.product_group = [...new Set(this.product.map(item => item.product_group))].map(e=>({"value" : e,"checked" : (e===this.selected_product)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    

        }
        

    }
    productChange(event:CheckboxModel){
        // debugger
        console.log(event , "product change")
        this.product_group.filter(val=>val.value != event.value).forEach(val=>val.checked = false)
        if(event.checked){
            this.selected_product = event.value
            this.product_group.filter(val=>val.value == event.value).forEach(val=>val.checked = true)
            // this.filter_model.product_group = this.selected_product

            this.strategic_cell = [...new Set(this.product.filter(val=>val.product_group == event.value).map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.brands  = [...new Set(this.product.filter(val=>val.product_group == event.value).map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));
            this.retailers = [...new Set(this.product.filter(val=>val.product_group == event.value).map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.filter(val=>val.product_group == event.value).map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.categories = [...new Set(this.product.filter(val=>val.product_group == event.value).map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    

        }
        else{
            this.selected_product = 'Product groups'
            this.strategic_cell = [...new Set(this.product.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_strategic_cell)}));
            this.brands  = [...new Set(this.product.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand)}));
            this.retailers = [...new Set(this.product.map(item => item.account_name))].map(e=>({"value" : e,"checked" : (e===this.selected_retailer)}));
            this.brands_format = [...new Set(this.product.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : (e===this.selected_brand_format)}));
            this.categories = [...new Set(this.product.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : (e===this.selected_category)}));
    

        }
       

    }
    _populateFilters(products : Product[]){
        // debugger
       this.retailers = [...new Set(products.map(item => item.account_name))].map(e=>({"value" : e,"checked" : false}));
       this.categories = [...new Set(products.map(item => item.corporate_segment))].map(e=>({"value" : e,"checked" : false}));;
       this.strategic_cell = [...new Set(products.map(item => item.strategic_cell_filter))].map(e=>({"value" : e,"checked" : false}));;
       this.brands_format = [...new Set(products.map(item => item.brand_format_filter))].map(e=>({"value" : e,"checked" : false}));;
       this.brands = [...new Set(products.map(item => item.brand_filter))].map(e=>({"value" : e,"checked" : false}));;
       this.product_group = [...new Set(products.map(item => item.product_group))].map(e=>({"value" : e,"checked" : false}));;
        
    // this.retailers.forEach(() => this.ordersFormArray.push(new FormControl(false)));
      

    }

    openModal(id: string) {
        this.modalService.open(id);
    }
   

    closeModal(id: string) {
        this.modalService.close(id);
    }
    close($event){
        console.log(this.selected_retailer , "selected retailer")
        console.log(this.selected_product , "selected product")

        if($event=="filter-product-groups"){
            if(!this.selected_retailer || this.selected_retailer == "Retailers"){
                this.toastr.error("Set retailer to simulate")
                this.closeModal($event)
                return
            }
            if(!this.selected_product  || this.selected_product == "Product groups"){
                this.toastr.error("Set product to simulate")
                this.closeModal($event)
                return
            }
            let p = this.product.find(e=>(e.account_name == this.selected_retailer)&&(e.product_group==this.selected_product))
            if(p){
                this.optimize.fetch_week_value(p.id)
            }
           this.hidepanel = false
            this.restApi.setAccAndPPGFilteredFlagObservable(true)
        }
        if($event=="upload-weekly-promotions"){
            this.uploadFile()

        }
        this.closeModal($event)
        // console.log($event)

    }
    reset(){
        this.promotion_map = []
        this.selected_brand = null as any
        this.selected_brand_format = null as any
        this.selected_category= null as any
        this.selected_product= null as any
        this.selected_retailer= null as any
        this._populateFilters(this.product)
        this.optimize.setProductWeekObservable([])
        this.optimize.setLoadedScenarioModel(null as any)
        this.restApi.setIsSaveScenarioLoadedObservable(null)
        this.promotion_viewed = null as any
        this.scenarioTitle = "Untitled"
        this.disable_save_download = true
           
        this.hidepanel = true
        this.restApi.setAccAndPPGFilteredFlagObservable(false)
        this.filter_model =  {"retailer" : "Retailers" , "brand" : 'Brands' , "brand_format" : 'Brand Formats' ,
        "category" : 'Category' , "product_group" : 'Product groups' , "strategic_cell" :  'Strategic cells'}
        // this.selected_product_week
        // t
    }
    hidePanel(){
        if(this.hideFilter == 'yettobesimulated'){
            return
        }
       
        this.hidepanel = !this.hidepanel
        if(this.hidepanel){
            this.hideFilter = "viewmore"
        }
        else{
            this.hideFilter = "viewless"
        }

    }
    simulateResetEvent($event){
         
        
        this.promotion_map = $event.promotion_map
        let form = {
            "account_name" : this.selected_retailer ,
             "corporate_segment" : this.selected_category,
            "product_group" : this.selected_product,
        "param_depth_all" : false,
    "promo_elasticity" : $event.promo_elasticity}
        // console.log($event.promotion_map , "promotion maps available")
    
        $event.promotion_map.forEach(element => {
            // debugger;

            let key = "week-" + element.week.week
            
            let obj = utils.decodePromotion(element.selected_promotion)
            
            
            form[key] = obj
            
        });
        if($event.action == 'Reset'){
            this.isFilterApplied = false
            this.hideFilter = 'yettobesimulated'
            this.reset()
            this.restApi.setAccAndPPGFilteredFlagObservable(false)
        }
        else{
            if($event.promotion_map.length == 0){
                this.toastr.error('Please select atleast one promotion');
                return
            }

            console.log(form , "generated form for simulation..")
            // debugger

            if(this.promotion_viewed?.scenario_type == 'pricing'){
                form = {...form , ...{"pricing" : (this.promotion_viewed.meta as MetaInfo).pricing}}
            }
            console.log(form , "updated form...")
            this.optimize.getPromoSimulateData(form).subscribe(data=>{
                this.toastr.success('Simulated Successfully', 'Success')
                this.optimize.setSimulatedDataObservable(data)
                if($event.action == 'Simulate'){
                 this.isFilterApplied = true
                 this.hideFilter = 'viewmore'
                 this.hidepanel = true
                 this.restApi.setAccAndPPGFilteredFlagObservable(true)
                 this.disable_save_download = false
                 // this.hideFilter = 'yettobesimulated'
             }
            
             },(error: any)=>{
                this.toastr.warning(error, 'Failed')
             })

        }
    
         
       
       
    }
    downloadEvent($event){
        let downloadData:any = []
        this.optimize.getSimulatedDataObservable().subscribe((response:any)=>{
            downloadData = response
        })
        this.optimize.downloadPromo(downloadData).subscribe(data=>{
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            this.toastr.success('File Downloaded Successfully','Success');
            FileSaver.saveAs(
                blob,
                'promo' + '_export_' + new Date().getTime() + 'xlsx'
                );
        },(err:any)=>{
            this.toastr.warning(err.error,'Failed');
        })

    // this.promotion_map.forEach(element => {
    //     let key = "week-" + element.week.week
    //     let obj = {
    //         "promo_depth":parseInt(element.selected_promotion.replace(/[^0-9]/g,'')),
    //         "promo_mechanics":"",
    //         "co_investment":parseInt(element.week.co_investment)
    //     }
    //     form[key] = obj
    // });

    }
    uploadFile(){
           this.restApi.uploadPromoSimulateInput(this.uploaded_file).subscribe((data: UploadModel) => {
               console.log(data , "data uploaded")
            this.toastr.success('Weekly Input Uploaded Successfully','Success');
            this.productChange({"value" : data.simulated.product_group , "checked" : true})
            this.retailerChange({"value" : data.simulated.account_name , "checked" : true})
            //    this.optimize.setProductWeekObservable(data.base)
            this.optimize.setUploadedScanarioObservable(data)
            //    this.isFilterApplied = true
               this.hideFilter = 'viewmore'
            
            
           
        })
    }
    fileUpload($event){
        this.uploaded_file = $event
        
    }
    _getmeta($event){
        if(utils.isArray($event['promotion']['meta'])){
            let obj = $event['promotion']['meta'].find(d=>d.retailer == this.loaded_scenario.account_name && d.product_group == this.loaded_scenario.product_group)

         return  {
            "lpi" : obj['pricing']['lpi'],
            "rsp" : obj['pricing']['rsp'],
            "cogs" : obj['pricing']['cogs']   ,
            "base_elasticity" : obj['pricing']['base_elasticity'],
            "inc_elasticity" : obj['pricing']['base_elasticity'],
            "base_net_elasticity" : obj['pricing']['base_elasticity'],
            "inc_net_elasticity" : obj['pricing']['base_elasticity'],
            "base_lpi" : obj['pricing']['base_lpi'],
            "base_rsp" : obj['pricing']['base_rsp'],
            "base_cogs" : obj['pricing']['base_cogs'],
         }     
        }
        return false

    }
    generateListPromotion($event){
        // $event['promotion']['meta']
        // debugger
        this.promotion_viewed = {
            "id" : this.loaded_scenario.scenario_id,
            "name" : this.loaded_scenario.scenario_name,
            "comments" : this.loaded_scenario.scenario_comment,
            "scenario_type" : this.loaded_scenario.scenario_type,
            "meta" : {
                "id" :this.loaded_scenario.pricing_id,
                "product_group" : this.loaded_scenario.product_group,
                "retailer" : this.loaded_scenario.account_name,
                "pricing" : this._getmeta($event)
            }
        }
       
    }
    loadPromotionEvent($event){
        console.log($event)
        // debugger
        let pricing = null
        if("price_id" in $event){
            pricing= $event['price_id']

        }
    
        this.optimize.fetch_load_scenario_by_id($event['promotion'].id , pricing ).subscribe(data=>{
            console.log(data , "fetch loaded scenario response")
            this.loaded_scenario = data
            this.loaded_scenario.scenario_comment = $event.comments
            this.generateListPromotion($event)
            this.filter_model["product_group"] = data.product_group
            this.filter_model["retailer"] = data.account_name
            // debugger
            this.productChange({"value" : data.product_group , "checked" : true})
            this.retailerChange({"value" : data.account_name , "checked" : true}) 
            this.optimize.setLoadedScenarioModel(this.loaded_scenario)  
            this.optimize.setSimulatedDataObservable(this.loaded_scenario)
            this.populatePromotionWeek(this.loaded_scenario)
            this.isFilterApplied = true
            this.hideFilter = 'viewmore'
            this.disable_save_download = false
            // this.optimize.set
            this.toastr.success('Scenario Loaded Successfully', 'Success')
            console.log(this.loaded_scenario , "loaded sceanrio")
            this.restApi.setIsSaveScenarioLoadedObservable({"flag" : true , "data" : {
                "name" : this.loaded_scenario.scenario_name,
                "comments" : this.loaded_scenario.scenario_comment,
                "id" : this.loaded_scenario.scenario_id,
                "type" : this.loaded_scenario.scenario_type,
                "source_type" : "promo"

            }})
        })
        console.log($event.id , "id of saved promotion")
    }

    populatePromotionWeek(scenario : LoadedScenarioModel){
        let pw:ProductWeek[]=[];
        console.log(this.promotion_map , "promotion map valll")
        this.promotion_map = []
        
        scenario.base.weekly.forEach((data,index)=>{
            let simulated_depth = scenario.simulated.weekly[index].promo_depth
            let simulated_coinv = scenario.simulated.weekly[index].co_investment
            let simulated_n_plus_1 = scenario.simulated.weekly[index].flag_promotype_n_pls_1
            let simulated_motivation = scenario.simulated.weekly[index].flag_promotype_motivation
            let simulated_traffic = scenario.simulated.weekly[index].flag_promotype_traffic
            if(simulated_depth){
                this.promotion_map.push({
                    "selected_promotion" : utils.genratePromotion(
                        simulated_motivation,simulated_n_plus_1,simulated_traffic,simulated_depth,
                        simulated_coinv
                    ) ,
                     "week" : data
                })
            }
        })
    }
    
    populatePromotionMap(){
        // this.promotion_map.push({"selected_promotion":"TPR-"+val+"%","week" : data})
    }
    saveScenario($event){
        console.log($event , "event type")
        this._saveEvent($event)
        


    }
    _saveEvent($event){
        console.log(this.promotion_viewed , "saved promotion while saving....")
        if(this.promotion_map.length == 0){
            this.toastr.error('please choose atleastone promotion');
            return
            
        }
        if($event.type == 'saveas'){
            let weekly = {
                "name" : $event['name'],
                "comments" : $event["comments"],
                "account_name" : this.selected_retailer ,
                "corporate_segment" : this.selected_category,
                "product_group" : this.selected_product,
                "param_depth_all" : false,
                "promo_elasticity" : 0
            }
            if(this.promotion_viewed.scenario_type == "pricing"){
                weekly["pricing_scenario_id"]  =  (this.promotion_viewed.meta as MetaInfo).id
            }
            this.promotion_map.forEach(element => {
                let key = "week-" + element.week.week
                let obj = utils.decodePromotion(element.selected_promotion)

                weekly[key] = obj
                
            });
            
            this.optimize.savePromoScenario(weekly).subscribe(data=>{
                this.save_scenario_error = null
                this.modalService.close("save-scenario-popup")
                this.toastr.success('Scenario Saved Successfully', 'Success')
                let promotion : ListPromotion = {
                    "id" : data["saved_id"],
                    "name" : weekly["name"],
                    "comments" : weekly["comments"],
                    "scenario_type" : "promo",
                    "meta" : {
                        "retailer" : weekly["account_name"],
                        "product_group" : weekly["product_group"],
                        "pricing" : false
                    }
                    
    
                }
                this.optimize.addPromotionList(promotion)
                this.scenarioTitle = weekly["name"]
                
                this.promotion_viewed = {...{
                    "id" : data["saved_id"],
                    "name" : weekly["name"],
                    "comments" :  weekly["comments"],
                    "scenario_type" :  "promo",
                    "meta" : {
                        "product_group" :weekly["account_name"],
                        "retailer" : weekly["product_group"],
                        "pricing" : false
                    }
                },...this.promotion_viewed 
            }

                this.promotion_viewed.name = $event['name']
                this.scenarioTitle = $event['name']
                this.promotion_viewed.comments = $event["comments"]
                this.promotion_viewed.meta['product_group'] = this.selected_product
                this.promotion_viewed.meta['retailer'] = this.selected_retailer
                this.restApi.setIsSaveScenarioLoadedObservable({"flag" : true , "data" : {
                    "name" :weekly["name"],
                    "comments" : weekly["comments"],
                    "id" :  data["saved_id"],
                    "type" : "promo",
                    "source_type" : "promo"
                }})

            },
            error=>{
                console.log(error , "eror")
                this.save_scenario_error = error.detail
            })

        }
        else if($event.type == 'save'){
            console.log('save clicked')
            console.log(this.promotion_viewed , "promotion viewed")
            let weekly = {
                "name" : $event['name'],
                "comments" : $event["comments"],
                "account_name" : this.selected_retailer ,
                "corporate_segment" : this.selected_category,
                "product_group" : this.selected_product,
                "param_depth_all" : false,
                "promo_elasticity" : 0,
                "scenario_id": this.loaded_scenario.scenario_id
            
            }
            this.promotion_map.forEach(element => {
                let key = "week-" + element.week.week
                let obj = utils.decodePromotion(element.selected_promotion)
                 
                weekly[key] = obj
                
            });
            // debugger
            if(this.promotion_viewed.scenario_type == "pricing"){
                weekly = {...weekly , ...{"price_id" : (this.promotion_viewed.meta as MetaInfo).id }}
                this.pricingService.updatePricingScenario(this.loaded_scenario.scenario_id , weekly).subscribe(data=>{
                    console.log(data , "update priing...")
                })
              
            }
            else{

           
            
            this.optimize.updatePromoScenario(weekly).subscribe(data=>{
                this.save_scenario_error = null
                this.modalService.close("save-scenario-popup")
                this.toastr.success('Scenario Updated Successfully', 'Success')
                
                console.log("saved data" , data)
                this.promotion_viewed.name = $event['name']
                this.scenarioTitle = $event['name']
                this.promotion_viewed.comments = $event["comments"]
                this.promotion_viewed.meta['product_group'] = this.selected_product
                this.promotion_viewed.meta['retailer'] = this.selected_retailer
                this.restApi.setIsSaveScenarioLoadedObservable({"flag" : true , "data" : {
                    "name" : $event['name'],
                    "comments" : $event["comments"],
                    "id" :  data["saved_id"],
                    "type" : "promo",
                    "source_type" : "promo"
                }})
            },
            error=>{
                console.log(error , "eror")
                this.save_scenario_error = error.detail
            })
        }
    }
    }

    receiveMessage($event: any) {
        // debugger
        console.log('recieved');
        if($event == 'Simulate'){
            this.isFilterApplied = true
            this.hideFilter = 'viewless'
        }
        else if($event == 'Reset'){
            this.isFilterApplied = false
            this.hideFilter = 'viewmore'
            this.restApi.setIsSaveScenarioLoadedObservable(null)
        }
        else if($event == 'save-scenario-popup'){
            
            this.save_scenario_error = null
            this.openModal($event);
        }
        else{
            this.show_save = false
            if($event == 'load-scenario-promosimulator'){
                this.loadScenarioPopuptitle = 'Load scenario'
            }
            this.openModal($event);
        }
    }
}
