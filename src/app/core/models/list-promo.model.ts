export interface PricingPromoModel{
    lpi : number,
    rsp : number,
    cogs : number ,
    promo? : number,
    base_lpi? : number,
    base_rsp? : number,
    base_cogs? : number ,
    base_promo? : number,
    cogs_date? : Date
    list_price_date? : Date,  
    rsp_date? : Date,
    promo_date? : Date,
    follow_competition? : boolean,
    inc_elasticity? : number,
    inc_net_elasticity?:number,
    base_elasticity? : number,
    base_net_elasticity?:number,
    is_tpr_constant?:boolean

}

export interface MetaInfo {
    id?: number,
    retailer : string,
    product_group : string,
    
    pricing : boolean | PricingPromoModel,
}


export interface ListPromotion {
    id: number,
    name: string,
    comments: string,
    scenario_type: string,
    meta: MetaInfo | Array<MetaInfo>,
    
    
    }


// "id": 37,
//         "name": "optimizer-promo-map-test",
//         "comments": "optimizer-promo-map-test",
//         "scenario_type": "optimizer",
//         "has_price": false