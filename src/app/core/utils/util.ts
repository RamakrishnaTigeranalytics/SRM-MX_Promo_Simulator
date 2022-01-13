// import { type } from "os"

import * as moment from "moment"

export function reducePercent(value , percent){
  return value * (1  - (percent / 100))
}
export function increasePercent(value , percent){
  return value * (1  + (percent / 100))

}

export function findPercentDifference(a,b){
  if(a == 0 || b ==0){
    return 0
  }
  
  // console.log(a,b , "findPercentDifferencefindPercentDifferencefindPercentDifference")
  let val = ((a-b)/a) * 100
  
  return parseFloat(val.toFixed(2));
  
}
export function _divide(n1 , n2){
    if(!n1 || !n2){
      return 0

    }
    return n1/n2
  }

  export function isArray(obj : any ) {
    return Array.isArray(obj)
 }


export function convertMomentToDate(moment_date){
  console.log(moment_date , "moentdatemoentdatemoentdatemoentdatemoentdatemoentdate")
  // debugger
  if(!moment_date){
    return null
  }
  // console.log()
  let x = moment_date
  if(moment_date instanceof moment){
    x = x.toDate()
  }
  
  let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
  let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
  x.setHours(hoursDiff);
  x.setMinutes(minutesDiff);
  return x
}


export function generateMessage1(metric , type){
  // debugger
  // arrow: "carret-up"
  let message = ``
  if(metric['arrow'] == "carret-up"){
    message += `in increase in ${type} by ${(metric['converted_difference']).replace(/[()]/g, '')} ${metric['percent']}`

  }
  else if(metric['arrow'] == "carret-down"){
    message += `in decrease in ${type} by ${(metric['converted_difference']).replace(/[()]/g, '')} ${metric['percent']}`

  }
  else {
    message += `in unchanged ${type}`

  }

return message
}
export function generateMessage2(metric){
  let message = ` Retailer Profit `
  if(metric['arrow'] == "carret-up"){
    message +=  `has increased by ${(metric['converted_difference']).replace(/[()]/g, '')} ${metric['percent']} as compared to the base calendar`

  }
  else if(metric['arrow'] == "carret-down"){
    message +=  `has decreased by ${(metric['converted_difference']).replace(/[()]/g, '')} ${metric['percent']} as compared to the base calendar`

  }
  else {
    message +=  `is unchanged`

  }
  return message
}

export function generateMessage3(metric){
  let message = ` Trade expense `
  if(metric['arrow'] == "carret-up"){
    message+= `has increased by ${(metric['converted_difference']).replace(/[()]/g, '')} ${metric['percent']}`

  }
  else if(metric['arrow'] == "carret-down"){
    message+= `has reduced by ${(metric['converted_difference']).replace(/[()]/g, '')} ${metric['percent']}`
  }
  else{
    message+= `is unchanged`
  }
  
  return message
}




export function generateMessageRandom(index: any,financial_metrics,metric1: any,metric2: any,metric3 :any,flag="optimizer"){
  let result1:any = ''
  let result2:any = ''
  let result3:any = ''
  if(index == 2){
    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp']) {
      result1 +=  'There is an increase of Trade expense by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' + metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp']){
      result1 +=  'There is an decrease of Retailer Profit by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' + metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] == financial_metrics['base']['total']['rp']) {
      result1 += 'There is an unchanged value for Trade expense '
    }


    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] +'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC increased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] +'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC decreased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] || financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC is unchanged.'
    }
    else if(financial_metrics['simulated']['total']['rp'] = financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC.'
    }


    let flagContent: any = ''
    if(flag == 'optimizer'){
      flagContent = 'optimized'
    }
    else {
      flagContent = 'simulated'
    }
    if(financial_metrics['simulated']['total']['te'] > financial_metrics['base']['total']['te']) {
      result3 +=  ' Trade expense has increased by '+ (metric3['percent']).replace(/[()]/g, '') +' with the current '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['te'] < financial_metrics['base']['total']['te']){
      result3 +=  ' Trade expense has come down by '+ (metric3['percent']).replace(/[()]/g, '') +' with the current '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['te'] == financial_metrics['base']['total']['te']) {
      result3 += ' Trade expense is unchanged with the current '+ flagContent +' calendar results.'
    }

    result1 = {
      result1 :  result1,
      result2 :  result2,
      result3 :  result3
    } 
  }
  else if(index == 3){
    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp']) {
      result1 +=  'Opportunity to increase  Trade Expenseby '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' +metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp']){
      result1 +=  'Opportunity to decrease Trade Expense by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' +metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] == financial_metrics['base']['total']['rp']) {
      result1 += 'There is an unchanged value for  Trade Expense '
    }

    let flagContent: any = ''
    if(flag == 'optimizer'){
      flagContent = 'optimal'
    }
    else {
      flagContent = 'simulated'
    }


    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] + ' exists with this '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC increased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] + ' exists with this '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC decreased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] + ' exists with this '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] + ' exists with this '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] || financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC is unchanged exists with this '+ flagContent +' calendar results.'
    }
    else if(financial_metrics['simulated']['total']['rp'] = financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC exists with this '+ flagContent +' calendar results.'
    }
    result1 = {
      result1 :  result1,
      result2 :  result2,
      result3 :  result3
    }
  }
  return result1
}

export function generateMessageRandomSimulator(index: any,financial_metrics,metric1: any,metric2: any,metric3 :any){
  // debugger
  let result1:any = ''
  let result2:any = ''
  let result3:any = ''
  if(index == 1){
    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp']) {
      result1 +=  'Simulated scenario results in an increase of Trade expense by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' + metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp']){
      result1 +=  'Simulated scenario results in an decrease of Trade expense by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' + metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] == financial_metrics['base']['total']['rp']) {
      result1 += 'Simulated scenario results has a unchanged value for Trade expense '
    }


    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] +'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC increased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] +'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC decreased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] || financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC is unchanged.'
    }
    else if(financial_metrics['simulated']['total']['rp'] = financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC.'
    }



    if(financial_metrics['simulated']['total']['units'] > financial_metrics['base']['total']['units']) {
      result3 +=  ' There is an increase in units by '+ (metric3['converted_difference']).replace(/[()]/g, '') + ' ' + metric3['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['units'] < financial_metrics['base']['total']['units']){
      result3 +=  ' There is an drop in units by '+ (metric3['converted_difference']).replace(/[()]/g, '')+ ' ' + metric3['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['units'] == financial_metrics['base']['total']['units']) {
      result3 += ' There is an unchanged value for units.'
    }

    result1 = {
      result1 :  result1,
      result2 :  result2,
      result3 :  result3
    } 
  }
  else if(index == 2){
    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp']) {
      result1 +=  'Simulated scenario results in an increase of Trade expense by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' + metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp']){
      result1 +=  'Simulated scenario results in an decrease of Trade expense by '+ (metric1['converted_difference']).replace(/[()]/g, '') + ' ' + metric1['percent']
    }
    else if(financial_metrics['simulated']['total']['rp'] == financial_metrics['base']['total']['rp']) {
      result1 += 'Simulated scenario results has a unchanged value for Trade expense '
    }


    if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] +'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] > financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC increased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent'] +'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC decreased by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] < financial_metrics['base']['total']['mac']) {
      result2 +=  ' and MAC by '+ (metric2['converted_difference']).replace(/[()]/g, '') + ' ' + metric2['percent']+'.'
    }
    else if(financial_metrics['simulated']['total']['rp'] > financial_metrics['base']['total']['rp'] || financial_metrics['simulated']['total']['rp'] < financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC is unchanged.'
    }
    else if(financial_metrics['simulated']['total']['rp'] = financial_metrics['base']['total']['rp'] && financial_metrics['simulated']['total']['mac'] == financial_metrics['base']['total']['mac']) {
      result2 += ' and MAC.'
    }

    result1 = {
      result1 :  result1,
      result2 :  result2,
      result3 :  result3
    } 
  }
  return result1
}

export function decodePromotion(promo_name){

  let mechanicName = promo_name.slice(0,promo_name.indexOf(promo_name.match(/\(.*?\)/g)[0])-1)

   const [promoPrice,costShare,volOnDeal] = promo_name.match(/\(.*?\)/g).map(x => x.replace(/[()]/g, "")).map(e=>e.replace(/[^0-9\.]+/g, "_")).join(',').split('_').filter(e=>e)
  console.log(promoPrice,costShare,volOnDeal)
   let obj ={
    "promo_activity" : "",
    "promo_price" : 0,
    "cost_share":0,
    "vol_on_deal":0

  }
      // let arr:Array<any>|null = promo_name.match(regex)
    obj["promo_activity"] = mechanicName??0
    obj["promo_price"] = parseFloat(promoPrice??0)
    obj["cost_share"] = parseFloat(costShare??0)
    obj["vol_on_deal"] = parseFloat(volOnDeal??0)

  return obj

}


export function genratePromotion( promo_price , co_inv,vol_on_deal?,promo_depth?,promoActivity?){
  let promo_name = promoActivity
  let promo_string = ""

  if(promo_depth){
    if(promo_price){
      promo_string+=promo_name + "-" + "(Pp-"+promo_price+","+ ""
      }
      if(co_inv){
        if(promo_price){
          promo_string+= "Co-"+co_inv.toFixed(2)+"%,"
        }
        else{
          promo_string+=promo_name + " Co-"+co_inv.toFixed(2)+"%,"
    
        }
       
      }else{
        promo_string+= " Co-"+100+"%,"
      }
      if(vol_on_deal){
        if(promo_price){
          promo_string+= " Vol-"+vol_on_deal.toFixed(2)+"%)"
        }else {
          promo_string+=promo_name + " Vol-"+vol_on_deal.toFixed(2)+"%)"
        }
       
      }else{
        promo_string+= " Vol-"+100+"%)"
      }
  }

  // console.log(promo_string , "generate promotion details promo-string")
  return promo_string
}


export function convertCurrency(value:any , per?:any , is_curr = true){
    if(value){
      let symbol = ""
      if(is_curr){
        symbol  = " $ "

      }
      
      let str = value.toFixed(2).split(".")[0]
      let strlen = str.length
      let final = value
      let curr = ""
      if(strlen >=4 && strlen <=6){
        final = value / 1000;
        curr = "K"
  
      }
      else if (strlen >=7 && strlen <=9){
        final = value / 1000000
        curr = "M"
      }
      else if(strlen >= 10){
        final = value / 1000000000
        curr = "B"
      }
      // console.log(value , "ACTUAL")
      // console.log(strlen , "ACTUAL LEN")
      // console.log(final , "FINAL")
      if(per){
        symbol = " %"
      }
      return  final.toFixed(2) + curr + symbol
  
    }
    return 0
  }

  export function  percentageDifference(a: number, b: number , debug = false){
    // if(debug){
    //   debugger
    // }
    a  = parseFloat(a.toFixed(2));
    b  = parseFloat(b.toFixed(2));
    
    if (a == 0 && b == 0){
        return (0).toFixed(2)
    }
    if (a > 0 && b == 0){
        return (100).toFixed(2)
    }
    // return  (100 * Math.abs( ( a - b ) / ( (a+b)/2 ) )).toFixed(2);
    // return  (100 * ( ( a - b ) / ( (a+b)/2 ) )).toFixed(2);
    return (100 * ((a - b)/b)).toFixed(2);
}

export function colorForDifference(base:any, simulated:any){
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

export function formatNumber(number: any,currency: boolean,percentage: boolean,debug=false ){
  // console.log(number , "format Fplchatdata....number funtion ")
  // if(debug){
  //   debugger
  // }
  number  = parseFloat(number.toFixed(2));
  
    var SI_SYMBOL = ["", "K", "M", "B", "T", "P", "E"];
    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number.toFixed(2);

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier]?? 0;
    var scale = Math.pow(10, tier * 3)?? 0;

    // scale the number
    var scaled = number / scale;

    if(currency && percentage){
        return scaled.toFixed(1) + '%';
    }

    if(currency && !percentage){
        return '$ '+scaled.toFixed(1) + suffix ;
    }
    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}


export function generate_consecutive_list_max_diff(arr:Array<number>){
  // debugger
  if(arr.length > 0){
    let final:any[] = []
    let temp:number[] = [arr[0]]
    let max_diff = 52
    for(let i =1;i <= arr.length;i++ ){
      if(arr[i] - arr[i-1]!=1){
        let diff = arr[i] - temp[temp.length -1]
        if(diff < max_diff){
          max_diff = diff
        }
        final.push(temp)
        temp = []
        if(arr[i]){
          temp.push(arr[i])

        }
        
      }
      else{
        temp.push(arr[i])
      }
    }
    if(temp.length > 0){
      final.push(temp)

    }
    
    // console.log(final , "final brfore return")

    return {
      "min_diff" : max_diff,
      "consecutive" : final,
      "max_len_consecutive" : Math.max(...final.map(d=>d.length)),
     
    }

  }
  
return {
  "min_diff" : 0,
  "max_len_consecutive" : 52,
  "consecutive" : []
}
}

export function check_validate_gap(min_gap , calculated_gap){
  return calculated_gap > min_gap || calculated_gap == 0 || calculated_gap == 1

}

export function calculate_not_allowed_array(comp_week , max_con){
  // console.log(comp_week , "calculate not allowed comp")
  let not_allowed:any[]= []
  // debugger
  for(let i =0;i < comp_week.length;i++ ){
    let min_extreme = comp_week[i][0]  - max_con
    let max_extreme = comp_week[i][comp_week[i].length - 1]  + max_con
    for(let j = min_extreme ; j <=max_extreme ; j++){
      // console.log(j)
      not_allowed.push(j)
      // not_allowed.push(j)

    }
  }
  return not_allowed
  

}
  
  
// def check_valide_gap(min_gap , calculated_gap):
// return calculated_gap >= min_gap or calculated_gap ==1 or calculated_gap ==0