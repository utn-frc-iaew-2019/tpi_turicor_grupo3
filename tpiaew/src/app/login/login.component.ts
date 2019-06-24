import { Component, OnInit } from '@angular/core';
import { ServicioSoapService } from '../serviciosoap.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public servicio: ServicioSoapService) { }

  ngOnInit() {
  }

  loguearGoogle(){
    this.servicio.getUsuario();
  }
}
