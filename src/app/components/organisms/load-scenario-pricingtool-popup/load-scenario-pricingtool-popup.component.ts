import { Component, OnInit,Output , EventEmitter } from '@angular/core';
import { ListPromotion } from '@core/models';
import {OptimizerService , PricingService} from "@core/services"
import { ModalService } from '@molecules/modal/modal.service';
@Component({
    selector: 'nwn-load-scenario-pricingtool-popup',
    templateUrl: './load-scenario-pricingtool-popup.component.html',
    styleUrls: ['./load-scenario-pricingtool-popup.component.css'],
})
export class LoadScenarioPricingtoolPopupComponent implements OnInit {
    selectedIndex!: number;
    list_promotion:Array<ListPromotion> = []
    selected_promotion : ListPromotion = null as any
    promotion_viewed:ListPromotion = null as any
    @Output()
    load_scenario_event = new EventEmitter()
    constructor(private optimizerService : OptimizerService , private pricingService : PricingService,private modal : ModalService) {
        this.optimizerService.fetch_load_scenario()
    }

    ngOnInit() {

        this.optimizerService.getListObservation().subscribe(data=>{
            if(data){
                this.list_promotion = data.filter(data=>data.scenario_type == "pricing")
            }
            console.log(data , "LIST PROMOTION observable")
        })
    }

    loadPricingSimulatorItems: any[] = [
        {
            slcHead: 'Pricing scenario name',
            slcContent:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi enim ultrices eget donec in nunc, mi nisl elit. Nibh proin vitae faucibus tempor mauris, justo. Turpis adipiscing egestas.',
        },
        {
            slcHead: 'Pricing scenario name',
            slcContent:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi enim ultrices eget donec in nunc, mi nisl elit. Nibh proin vitae faucibus tempor mauris, justo. Turpis adipiscing egestas.',
        },
    ];

    loadScenario(){
        this.load_scenario_event.emit(this.selected_promotion)

    }

    select(index: number,slected_promotion) {
        this.selectedIndex = index;
        this.selected_promotion = slected_promotion
    }

    infoClickedEvent($event){
        this.promotion_viewed = $event
        console.log($event , "id of promotion ")
        this.modal.open("pricing-simulator-popup")
    }

    confirmationDelete($event){
        console.log(this.promotion_viewed , "protoion detaile to delete")
        console.log(this.promotion_viewed.id , "id to delete")
        console.log($event , "confimatin delete at load scenario")
        this.modal.close("delete-scenario")
        if($event == 'yes'){
            // this.optimize.deletePromoScenario(this.promotion_viewed.id).subscribe(data=>{
            //     this.optimize.deleteListPromotion(this.promotion_viewed.id)
            //     this.modal.close("promo-simulator-popup")
            // },err=>{
            //     console.log(err , "error")
            // })

        }
    }
    modalConfirmation($event){
        if($event == 'back'){
            this.modal.close('pricing-simulator-popup')
        }
        else if($event == 'load'){
            this.modal.close('pricing-simulator-popup')
            this.loadScenario()
        }
    }
}
