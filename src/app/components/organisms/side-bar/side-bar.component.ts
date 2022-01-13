import { Component, OnInit } from '@angular/core';
import{AuthService } from "@core/services"
import { Router,NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@core/models';

@Component({
    selector: 'nwn-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
    user$ : Observable<User>
    login_route =['/login']
    homePage = ['/home-page']
    hide_side = false
    is_logged_in = false
    constructor(private authService : AuthService,private router: Router){
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                // console.log(val, 'VAL OF ROUTER ');
                // console.log(val.url, 'VAL OF ROUTER ');
                if (this.login_route.includes(val.url) || this.homePage.includes(val.url)) {
                  // this.hideNav()
                  this.hide_side = true;
                } else {
                  this.hide_side = false;
                }
                 
              }
        });

    }
    token:any;
    ngOnInit(){
        this.token=localStorage.getItem('token');
        this.user$ = this.authService.getUser()
        this.user$.subscribe(data=>{
            if(data){
               this.is_logged_in = true 
            }
        })
    }
    redirectPage(url: any){
        if(url == 'price-tool'){
            this.authService.redirectAuth().subscribe((data:any) =>{
                window.open(data.url+"scenario?token="+data.encrypted_token, '_blank')
            })
        }
        else if(url == 'promo-tool'){
          this.router.navigate(['/promo'])
        }
        else if(url == 'price-tracker'){
          window.open("https://app.powerbi.com/groups/53d31380-4cac-4e73-9f6b-18c7d4b633f2/reports/8f0a298d-a24a-4457-aca2-4f8c522e7fc9/ReportSection38083be9c726d8eda147?ctid=2fc13e34-f03f-498b-982a-7cb446e25bc6&openReportSource=ReportInvitation", '_blank')
          // this.router.navigate(['/profit'])
        }
        else if(url == 'price-pack'){
          window.open("https://app.powerbi.com/groups/53d31380-4cac-4e73-9f6b-18c7d4b633f2/reports/5071d67a-5436-40a6-8f12-1a9721e4f8be/ReportSection93667eadf694ea410eb8?ctid=2fc13e34-f03f-498b-982a-7cb446e25bc6&openReportSource=ReportInvitation", '_blank')
          // this.router.navigate(['/pricing'])
        }
        else if(url == 'srm-insight'){
            window.open(" https://app.powerbi.com/groups/53d31380-4cac-4e73-9f6b-18c7d4b633f2/reports/3ac1a6ad-c021-4ab0-9ed4-b30b33201ffe/ReportSection07ee99648d9dfba5fe18", '_blank')
        }
     }

    logout(){
this.authService.logout().subscribe(data=>{
     localStorage.removeItem('token');
    localStorage.removeItem('user')
    this.authService.isLoggedInObservable.next(false);
    this.authService.setUser(null as any)
    this.router.navigate(['/login'])
})

    }

}
