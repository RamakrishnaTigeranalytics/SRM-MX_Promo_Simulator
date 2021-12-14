import { Component, OnInit, Input ,EventEmitter, Output} from '@angular/core';
import { CheckboxModel, FilterModel } from '@core/models';
import { SimulatorService } from '@core/services/simulator.service';
import {ModalApply} from "../../../shared/modal-apply.component"

@Component({
  selector: 'nwn-filter-sub-segment',
  templateUrl: './filter-sub-segment.component.html',
  styleUrls: ['./filter-sub-segment.component.css']
})
export class FilterSubSegmentComponent extends ModalApply implements OnInit {

  @Input()
  pricing = false

  all_ : CheckboxModel = {"value" : "All" , "checked" : false}
  // brandFormatSelectedPricing :any[] = []
  @Input()
  sub_Segments:Array<CheckboxModel> = []
  @Output()
  subSegmentChange = new EventEmitter()
  @Input()
  filter_model : FilterModel

  @Input()
  count_ret : any = null

  placeholder:any = 'Search Subsegment'
  // retailerSelected:any = ''
  constructor(public restApi: SimulatorService) { 
    super()
  }

  ngOnInit(): void {
    this.restApi.ClearScearchText.asObservable().subscribe(data=>{
      if(data=="filter-sub-segment"){
        console.log(data,"from modal apply")
      this.searchText = ""

      if(this.count_ret){
        if(this.count_ret["sub_segment"].length == 0){
          this.all_.checked = false
          this.sub_Segments.forEach(element => {
            element.checked = false
            
            
          });
           
          
          
        }
        this.sub_Segments.forEach(d=>d.checked = this.count_ret['sub_segment'].includes(d.value))
        if(this.sub_Segments.length == this.count_ret['sub_segment'].length){
          this.all_.checked = true
        }
        else{
          this.all_.checked = false
        }


      }
      else{
        if(this.filter_model.sub_segment == "Subsegment"){

          this.sub_Segments.forEach(element => {
            element.checked = false
            
          });
          this.valueChangeSelect({...this.retailerSelected , ...{"checked" : false}})
        }

      }
     
      }
      
    })
  }
  allselect($event){
     
    if($event.checked){
     
      // this.brandFormatSelectedPricing = []
       
       this.sub_Segments.forEach(d=>{
         d.checked = true
        //  this.brandFormatSelectedPricing.push(d.value)
       })
       this.all_ = {...this.all_ , ...{"checked": true}}
    }
    else{
     
      // this.brandFormatSelectedPricing = []
      this.sub_Segments.forEach(d=>{
        d.checked = false
        
      })
      this.all_ = {...this.all_ , ...{"checked": false}}

    }
     
    
  }
  valueChangeSelectPricing(event:any){
    this.sub_Segments.filter(d=>d.value == event.value)[0].checked = event.checked
     
    if(event.checked){
      // if(!(event.value in this.brandFormatSelectedPricing)){
      //   this.brandFormatSelectedPricing.push(event.value)

      // }
    }
    else{
      this.all_ = {...this.all_ , ...{"checked": false}}
      
      // this.brandFormatSelectedPricing = this.brandFormatSelectedPricing.filter(d=>d!=event.value)
    }
    
     


  }
 
  valueChangeSelect(event:any){
    this.retailerSelected = event
    this.subSegmentChange.emit(event)
   
  }
  apply(id){
    if(this.pricing){
      this.filterApply.emit({"key" : "Subsegment" , "values" : this.sub_Segments.filter(d=>d.checked).map(d=>d.value)})

    }
    else{
      this.filterApply.emit({"key" : "Subsegment"})

    }

   
    this.closeModal.emit(id)
    this.searchText = ""
  }


}
