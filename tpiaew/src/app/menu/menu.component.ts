import { Component, OnInit } from '@angular/core';
import { ServicioSoapService } from '../serviciosoap.service';
import { Cliente } from '../clientes.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  cliente: Cliente;

  constructor(public servicio: ServicioSoapService) { }

  ngOnInit() {
    this.servicio.getUsuario();
    this.servicio.getClienteListener().subscribe(cliente =>
      {
        this.cliente = cliente;
      });
  }

}
