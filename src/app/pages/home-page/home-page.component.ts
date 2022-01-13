import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '@core/models';
import {AuthService} from "@core/services"

@Component({
  selector: 'nwn-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  user : User
  groups : any[] = []

  constructor(private router: Router , private authService : AuthService) { }
  token:any;
  ngOnInit(): void {
    // debugger
    this.token = localStorage.getItem('token');
    this.user=this.authService.userObservable.getValue()
    this.groups = this.user.user.groups.map(d=>d.name)
    console.log(this.user , "user value inhome page")
    // console.log("groupsName",this.groups);
  }

  redirectPage(url: any){
    if(url == 'pricing-tool'){
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

}