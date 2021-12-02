import { Component, OnInit,Input,EventEmitter, Output } from '@angular/core';
import { SimulatorService } from '@core/services/simulator.service';
import { CheckboxModel, FilterModel } from 'src/app/core/models';
import {ModalApply} from "../../../shared/modal-apply.component"
@Component({
  selector: 'nwn-filter-product-groups',
  templateUrl: './filter-product-groups.component.html',
  styleUrls: ['./filter-product-groups.component.css']
})
export class FilterProductGroupsComponent extends ModalApply implements OnInit {

  @Input()
  product_groups:Array<CheckboxModel> = []
  @Input()
  filter_model : FilterModel

  @Output()
  productChange = new EventEmitter()

  productSelected:any = ''

  placeholder:any = 'Search product groups'
  constructor(public restApi: SimulatorService) { 
    super()
  }

  ngOnInit(): void {
    this.restApi.ClearScearchText.asObservable().subscribe(data=>{
      console.log(data , "data...closing modal")
      if(data=="filter-product-groups"){
        console.log(data,"from modal apply")
      console.log(this.product_groups , "produt groups clear search")
      this.searchText = ""
      if(this.filter_model.product_group == "Product groups"){

        this.product_groups.forEach(element => {
          element.checked = false
          
        });
        this.valueChangeSelect({...this.productSelected , ...{"checked" : false}})
      }

      }
      
    })
  }
  valueChangeSelect(event:any){
    this.productSelected = event
    this.productChange.emit(event)
  }
  apply(id){

    this.filterApply.emit({"key" : "Product groups"})
    this.closeModal.emit(id)
    this.searchText = ""
  }

}
