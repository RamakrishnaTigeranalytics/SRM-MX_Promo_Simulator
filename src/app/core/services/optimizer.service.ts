import { Injectable } from '@angular/core'
import {ApiService} from './api.service'
import {Product , ProductWeek , ListPromotion , LoadedScenarioModel,UploadModel,OptimizerModel} from "../models"
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {Product , ProductWeek , ListPromotion , LoadedScenarioModel, UploadModel} from "../models"
import { retry, catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject, throwError,combineLatest } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OptimizerService {
    public isAccAndProductFiltered = new BehaviorSubject<boolean>(false)
    public isUserGuideResetFlag = new BehaviorSubject<any>('')
    public ClearScearchText = new BehaviorSubject<any>('')
  private compareScenarioObservable = new BehaviorSubject<LoadedScenarioModel[]>([])
  private optimizerDataObservable = new BehaviorSubject<OptimizerModel>(null as any)
  private uploadedScenarioObservable = new BehaviorSubject<UploadModel>(null as any)
  private loadedScenarioObservable = new BehaviorSubject<LoadedScenarioModel>(null as any)
  private simulatedDataObservable = new BehaviorSubject<any>(null)
  public optimizerMetricsData = new BehaviorSubject<any>(null)
  public optimizerResponseObservable = new BehaviorSubject<any>(null)
  private listPromotionObservable = new BehaviorSubject<ListPromotion[]>(null as any)
  
  private compareScenarioIdObservable = new BehaviorSubject<Array<number>>([])
  private productWeekObservable = new BehaviorSubject<Array<ProductWeek>>([])
  base_line_promotion:Array<string> = []
  private promotionObservable = new BehaviorSubject<string[]>([]);
  token = environment.token;
  apiURL = environment.api_url;
  constructor(
    private apiService: ApiService,private http: HttpClient
  ) { }
  public setCompareScenarioObservable(scenario : LoadedScenarioModel[]){
    //   let compare_scenario = this.compareScenarioObservable.getValue()
    //   compare_scenario = [...compare_scenario , ...scenario]
      this.compareScenarioObservable.next(scenario)

  }
  public clearCompareScenarioObservable(){
    this.compareScenarioObservable.next([])
  }
  public getCompareScenarioObservable():Observable<LoadedScenarioModel[]>{
      return this.compareScenarioObservable.asObservable()
  }
  public setListPromotionObservable(promotion:ListPromotion[]){
      this.listPromotionObservable.next(promotion)
  }
  public getListObservation():Observable<ListPromotion[]>{
      return this.listPromotionObservable.asObservable()
  }
  public deleteListPromotion(id){
      let list_promotions = this.listPromotionObservable.getValue()
      list_promotions = list_promotions.filter(promo=>promo.id != id)
      this.setListPromotionObservable(list_promotions)
  }
  public addPromotionList(promotion : ListPromotion){
    let list_promotions = this.listPromotionObservable.getValue()
    list_promotions.push(promotion)
    this.setListPromotionObservable(list_promotions)


  }
  public getPromotionById(id):ListPromotion{
   let list_promo : ListPromotion[] =  this.listPromotionObservable.getValue()
   return list_promo.find(d=>d.id == id)!

  }
  public setoptimizerDataObservable(data:OptimizerModel){
      this.optimizerDataObservable.next(data)
  }
  public getoptimizerDataObservable():Observable<OptimizerModel>{
    return this.optimizerDataObservable.asObservable()
  }

    // Set and Get Account and Product Filtered Flag
    public setAccAndPPGFilteredFlagObservable(value:any){
        this.isAccAndProductFiltered.next(value)
      }
      public getAccAndPPGFilteredFlagObservable(){
        return this.isAccAndProductFiltered.asObservable()
      }
    
    // Set and Get clear search result
    public setClearScearchTextObservable(value:any){
    this.ClearScearchText.next(value)
    }
    public getClearScearchTextObservable(){
    return this.ClearScearchText.asObservable()
    }

    // Set and Get clear user guide state
    public setResetUserGuideFlagObservable(value:any){
    this.isUserGuideResetFlag.next(value)
    }
    public getResetUserGuideFlagObservable(){
    return this.isUserGuideResetFlag.asObservable()
    }

    // Error handling 
    handleError(error: any) {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
     }

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('token')
        })
      }  

  public setUploadedScanarioObservable(data : UploadModel){
      this.uploadedScenarioObservable.next(data)

  }

  diffArray(arr1, arr2) {
    return arr1
      .concat(arr2)
      .filter(item => !arr1.includes(item) || !arr2.includes(item));
  }

  public getUploadedScenarioObservable():Observable<UploadModel>{
      return this.uploadedScenarioObservable.asObservable()
  }
  public setCompareScenarioIdObservable(id:Array<number>){
    // debugger
     let available_ids =  this.compareScenarioObservable.getValue().map(s=>s.scenario_id)
     let id_unselected = this.diffArray(available_ids,id)
     id = id.filter(i=>!available_ids.includes(i))
     let compare_scenario = this.compareScenarioObservable.getValue()
     this.clearCompareScenarioObservable()
    //  console.log(available_ids , "available ids" )
    //  console.log(id_unselected , "id unselected")
    //  console.log(id , "final id")

    let obs$:Array<any>=[]
   

   

    if(available_ids.length > 0){
        if(id_unselected.length > 0){
            for(let i = 0; i < id_unselected.length; i++){
                compare_scenario = compare_scenario.filter((item:any) => item.scenario_id != id_unselected[i])
                // compare_scenario.splice(index, 1)
            }

            // this.setCompareScenarioObservable(compare_scenario)
        }
    }
    console.log(compare_scenario , "compare scenario")
    


    // this.clearCompareScenarioObservable()
    if(id.length > 0 ||  id_unselected.length > 0){
        obs$ = id.map(v=> this.fetch_load_scenario_by_id(v))
        // console.log(obs$ , "obseravable http")
        if(obs$.length == 0){
          this.setCompareScenarioObservable([...compare_scenario])

        }
        combineLatest(obs$).subscribe((data:any)=>{
            // debugger
            let temp_data = [...compare_scenario , ...data]
            this.setCompareScenarioObservable(temp_data)
        })
    }
  }

  arrayDiff(a:any, b:any) {
    return [
        ...a.filter(x => !b.includes(x)),
        ...b.filter(x => !a.includes(x))
    ];
    }
  public deleteCompareScenario(id){
      let scenarios = this.compareScenarioObservable.getValue()
      scenarios = scenarios.filter(data=>data.scenario_id != id)
      this.compareScenarioObservable.next(scenarios)


  }
  public setSimulatedDataObservable(data:any){
    this.simulatedDataObservable.next(data)

  }
  public getSimulatedDataObservable():Observable<any>{
    return this.simulatedDataObservable.asObservable()
  }
  public getProductWeekObservable():Observable<ProductWeek[]>{
    return this.productWeekObservable.asObservable()
  }
  public setProductWeekObservable(val:any[]){
     this.productWeekObservable.next(val)
  }
  public getCompareScenarioIdObservable(){
    return this.compareScenarioIdObservable.asObservable()

  }
  public setLoadedScenarioModel(loaded:LoadedScenarioModel){
    this.loadedScenarioObservable.next(loaded)

  }
  public getLoadedScenarioModel():Observable<LoadedScenarioModel>{
    return this.loadedScenarioObservable.asObservable()
  }
  

  public getPromotionObservable(): Observable<string[]> {
    return this.promotionObservable.asObservable();
  }
  public setPromotionObservable(val:string[]) {
    this.promotionObservable.next(val);
  }
  public setOptimizerResponseObservable(data : any){
      this.optimizerResponseObservable.next(data)

  }
  public getOptimizerResponseObservabe() : Observable<any>{
      return this.optimizerResponseObservable.asObservable()
  }

  fetchVal(){  
    return this.apiService.get<Product[]>('api/scenario/promo-simulate-test/')
  }
  fetch_optimizer_data(formdata):Observable<OptimizerModel>{
     return this.apiService.post<OptimizerModel>('api/optimiser/calculate/' , formdata)

  }
  fetch_week_value(id:number){
   
    this.apiService.get<ProductWeek[]>('api/scenario/promo-simulate-test/'+id).subscribe(
      data=>this.productWeekObservable.next(data),
      err=>{throw err}
      )

  }
  getPromoSimulateData(requestData: any): Observable<any> {
    return this.apiService.post<any>('api/scenario/promo-simulate/', requestData)
    
  }  
  savePromoScenario(requestData: any):Observable<any>{
    return this.apiService.post<any>('api/scenario/save/' , requestData)
  }
  updatePromoScenario(requestData: any):Observable<any>{
    return this.apiService.post<any>('api/scenario/update/' , requestData)
  }
  saveOptimizerScenario(requestData: any):Observable<any>{
    return this.apiService.post<any>('api/optimiser/save/' , requestData)

  }
  deletePromoScenario(id){
      return this.apiService.delete('api/scenario/savedscenario/'+id)
  }
  downloadPromo(requestData: any):Observable<any>{
    // promo-download/
    return this.apiService.postd('api/scenario/promo-download/' , requestData 
      )
  }
  
  fetch_load_scenario(){
    this.apiService.get<ListPromotion[]>('api/scenario/list-saved-promo/').subscribe(data=>{
        this.setListPromotionObservable(data)
    })
      // http://localhost:8000/api/scenario/list-saved-promo/39/
  }
  fetch_load_scenario_by_id(id:number , pricing_id= null){
    let arg= String(id)
    if(pricing_id){
    arg  = id + "/" + pricing_id
    }
    return this.apiService.get<LoadedScenarioModel>('api/scenario/list-saved-promo/' + arg)
      // http://localhost:8000/api/scenario/list-saved-promo/39/
  }
  fetch_optimizer_scenario_by_id(id , pricing_id){
    let arg= String(id)
    if(pricing_id){
    arg  = id + "/" + pricing_id
    }
      return this.apiService.get<any>('api/optimiser/list-saved-optimizer/' + arg)

  } 
  set_base_line_promotion(promotions:any){
    this.base_line_promotion = [...this.base_line_promotion , ...promotions]
    this.base_line_promotion = [...new Set(this.base_line_promotion)]
    // console.log(this.base_line_promotion , "Base line promotion set")

  }

  insert_base_line_promotion(promotions:string){
      this.base_line_promotion.push(promotions)
  }
  set_baseline_null(){
      this.base_line_promotion = []
  }
  get_base_line_promotions(){
    return this.base_line_promotion
  }
  optimizeResult(data){
      return this.apiService.post("api/optimiser/calculate/" , data)
  }

  getOptimizerMetrics(requestData: any): Observable<any> {
    return this.http.post<any>(this.apiURL + 'optimiser/calculate/', JSON.stringify(requestData), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  downloadCompareScenarioExcel(requestData: any): Observable<any> {
        return this.apiService.postd('api/scenario/compare-scenario-download/' , requestData 
          )
  }
  downloadCompareScenarioExcelPricing(requestData: any): Observable<any> {
    return this.apiService.postd('api/scenario/compare-scenario-download-pricing/' , requestData 
      )
}

  downloadOptimiserExcel(requestData: any): Observable<any> {
    return this.apiService.postd('api/optimiser/optimizer-download/' , requestData 
      )
  }

  public getOptimizerMetricsObservable():Observable<any>{
    return this.optimizerMetricsData.asObservable()
  }
  public setOptimizerMetricsObservable(val:any){
     this.optimizerMetricsData.next(val)
  }
  }
