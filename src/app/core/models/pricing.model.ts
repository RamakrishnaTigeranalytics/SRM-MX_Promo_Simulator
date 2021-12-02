export interface PricingModel {
    account_name:string;
    brand_filter:string;
    brand_format:string;
    corporate_segment:string;
    product_group : string;
    strategic_cell_filter : string;
    
base_price_elasticity: number
base_units: number
base_split : number
incremental_split : number
cogs:number;

cross_elasticity: number
date: any
gmac: number
list_price: number
month: number
net_elasticity: number
off_inv: number
on_inv: number
period: any
product_weight_in_grams:number
quarter: number
retail_median_base_price_w_o_vat: number

tpr_discount: number
tpr_coefficient:number
week: number
year: number
  }


  
  export interface Weekly{
    asp: number
    base_unit: number
    date: Date
    incremental_unit: number
    lift: number
    mars_cogs_per_unit: number
    mars_mac: number
    mars_mac_percent_of_nsv:number
    mars_total_net_invoice_price: number
    mars_total_nrv: number
    mars_total_off_invoice:number
    mars_total_on_invoice: number
    mars_uplift_net_invoice_price:number
    mars_uplift_nrv: number
    mars_uplift_off_invoice:number
    mars_uplift_on_invoice: number
    predicted_units:number
    retailer_margin: number
    retailer_margin_percent_of_nsv:number
    retailer_margin_percent_of_rsp: number
    roi: number
    te_per_units:number
    te_percent_of_lsv: number
    total_cogs: number
    total_lsv:number
    total_nsv: number
    total_rsv_w_o_vat: number
    total_trade_expense: number
    total_uplift_cost: number
    total_weight_in_tons: number
    tpr_budget: number
    tpr_budget_roi: number
    trade_expense: number
    uplift_cogs: number
    uplift_gmac_lsv: number
    uplift_lsv: number
    uplift_mac: number
    uplift_nsv: number
    uplift_promo_cost: number
    uplift_royalty: number
    uplift_trade_expense: number
    week: number
    year: number
  }

  export interface Total{
    asp: number
    base_units: number
    cogs:number
    increment_units: number
    lift: number
    lsv: number
    mac: number
    mac_percent: number
    nsv: number
    roi: number
    rp: number
    rp_percent: number
    te: number
    te_per_unit: number
    te_percent_of_lsv: number
    total_rsv_w_o_vat: number
    total_uplift_cost:number
    units:number
    uplift_gmac_lsv: number
    volume: number
    
  }

  export interface PriceSimulated{
      base : Array<{
          account_name : string,
          product : string,
          total : Total,
          weekly : Array<Weekly>
        }>
        simulated : Array<{
            account_name : string,
            product : string,
            total : Total,
            weekly : Array<Weekly>
          }>
  }

  export interface PS{
    id : any
    account_name : string,
    product :  string ,
    base : {
      total : Total,
      weekly : Array<Weekly>
    }
    simulated : {
      total : Total,
      weekly : Array<Weekly>
    }
  }