import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  branchList: any = [];
  message : string = '';

  constructor(
    private router: Router,
    private service: ServiceService
  ) { }

  ngOnInit() {
    // logged or not
    if(Boolean(sessionStorage.getItem("faculty_id"))){
      this.router.navigate(['home']);
    }

    // get branch service call
    this.service.getBranch().subscribe(
      response => {
        this.branchList = response["payload"];
      }
    );
  }

  // sign up
  signup(){
    var full_name = (<HTMLInputElement>document.getElementById("full_name")).value;
    var email = (<HTMLInputElement>document.getElementById("email")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var branch = (<HTMLInputElement>document.getElementById("branch")).value;

    // validation
    if(full_name.length == 0){
      this.message = "Full Name is required"
      return 0;
    }

    if(email.length == 0){
      this.message = "Email is required"
      return 0;
    }

    if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
      this.message = "Email is invalid"
      return 0;
    }

    if(password.length == 0){
      this.message = "Password is required"
      return 0;
    }

    if(password.length < 8){
      this.message = "Password sholud be minimun 8 character"
      return 0;
    }

    for(var i=0;i<this.branchList.length;i++){
      if(this.branchList[i]["branch_name"] == branch)
        var branch_id = this.branchList[i]["branch_id"] ;
    }

    if(branch_id == undefined)
      branch_id = 'null';

    this.message = '';

    // create faculty service call
    this.service.createFaculty(full_name, email, password, branch_id).subscribe(
      response => {
        if(response["payload"][0]["message"] == "Faculty added successfully."){
          this.router.navigate(['sign-in']);
        }
        else{
          alert(response["payload"][0]["message"]);
        }
        console.log(response)
      }
    );
  }

}
