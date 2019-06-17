import { Component, OnInit } from '@angular/core';
import { ServicioSoapService } from '../serviciosoap.service';
import { ReservaMongo } from '../reserva-mongo.model';

@Component({
  selector: 'app-listar-reservas',
  templateUrl: './listar-reservas.component.html',
  styleUrls: ['./listar-reservas.component.css']
})
export class ListarReservasComponent implements OnInit {
reservas: ReservaMongo[];
hayReservas: boolean = false;
idCliente: number; //Falta completar los comportamientos de cliente
  constructor(public servicio: ServicioSoapService) { }

  ngOnInit() {
    this.obtenerReservas();
  }

  onCancelarReserva(codigo: string){
    this.servicio.cancelarReserva(codigo);
    this.obtenerReservas();
  }

  obtenerReservas(){
    this.servicio.getReservasCliente(1);
    this.servicio.getReservasClienteListener().subscribe(reservas => {
      this.reservas = reservas;
      this.hayReservas = true;
    });
  }

}
