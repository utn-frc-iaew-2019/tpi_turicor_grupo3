import { Component, OnInit } from "@angular/core";
import { ServicioSoapService } from "../serviciosoap.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { ReservaMongo } from "../reserva-mongo.model";
import { Cliente } from '../clientes.model';


@Component({
  selector: "app-reservar-vehiculo",
  templateUrl: "./reservar-vehiculo.component.html",
  styleUrls: ["./reservar-vehiculo.component.css"]
})
export class ReservarVehiculoComponent implements OnInit {
  suscripcion: Subscription;
  idVehiculoCiudad: number;
  hayReserva: boolean = false;
  reservaMongo: ReservaMongo;
  apellidoNombreUsuario: string;
  cliente: Cliente;

  constructor(public servicio: ServicioSoapService) {}

  ngOnInit() {
    this.idVehiculoCiudad = this.servicio.getIdVehiculoCiudad();
    this.apellidoNombreUsuario =  this.servicio.cliente.nombre + " " + this.servicio.cliente.apellido ;

  }

  onReserva(form: NgForm) {
    this.servicio.reservarVehiculo(
      this.apellidoNombreUsuario,
      form.value.fechaDevolucion,
      form.value.fechaRetiro,
      this.idVehiculoCiudad,
      form.value.lugarDevolucion,
      form.value.lugarRetiro,
      form.value.nroDocumento
    );
    this.servicio.getReservaMongoListener().subscribe(reservamongo => { //2019-06-24T14:37:19.0040197-07:00
      this.reservaMongo = reservamongo;
      this.reservaMongo.fechaReserva = this.reservaMongo.fechaReserva.slice(0,10);
      this.hayReserva = true;
    });
  }
}
