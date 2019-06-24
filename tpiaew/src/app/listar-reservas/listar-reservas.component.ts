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
nombreApellidoCliente: string;
  constructor(public servicio: ServicioSoapService) { }

  ngOnInit() {
    this.obtenerReservas();
    this.nombreApellidoCliente = this.servicio.cliente.nombre + " " + this.servicio.cliente.apellido
  }

  onCancelarReserva(codigo: string){
    this.servicio.cancelarReserva(codigo);
    this.obtenerReservas();
  }

  obtenerReservas(){
    this.servicio.getReservasCliente();
    this.servicio.getReservasClienteListener().subscribe(reservas => {
      this.reservas = reservas;
      this.reservas.forEach(reserva => {
        reserva.fechaReserva = reserva.fechaReserva.slice(0,10);
      });
      this.hayReservas = true;
    });
  }

}
