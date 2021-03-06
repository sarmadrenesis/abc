import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any
  submitted = false;

  constructor(private apiService : ApiService,public router: Router) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })

  }

  get f() { return this.loginForm.controls; }

  save() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const finalObject = {
      email : this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    }
    this.apiService.add(`users/login`,finalObject).subscribe((resp:any)=>{
      if (resp.type === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Done.!',
          text: resp.message,
        });
        localStorage.setItem('token', resp.data)
        this.apiService.get(`roles/findOne/${resp.role}`).subscribe(result=>{
          if(result.data.roleName === 'admin'){
            this.router.navigateByUrl('/admin-dashboard');
          }
        })
      }else{
        Swal.fire({
          icon: 'error',
          text: resp.message,
        });
      } 
    })  

  }

}