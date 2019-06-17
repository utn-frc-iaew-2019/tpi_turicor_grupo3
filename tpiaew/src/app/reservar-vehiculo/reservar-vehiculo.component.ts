import { Component, OnInit } from "@angular/core";
import { ServicioSoapService } from "../serviciosoap.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { ReservaMongo } from "../reserva-mongo.model";

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

  constructor(public servicio: ServicioSoapService) {}

  ngOnInit() {
    this.idVehiculoCiudad = this.servicio.getIdVehiculoCiudad();
  }

  onReserva(form: NgForm) {
    this.servicio.reservarVehiculo(
      form.value.apellidoNombre,
      form.value.fechaDevolucion,
      form.value.fechaRetiro,
      this.idVehiculoCiudad,
      form.value.lugarDevolucion,
      form.value.lugarRetiro,
      form.value.nroDocumento
    );
    this.servicio.getReservaMongoListener().subscribe(reservamongo => {
      this.reservaMongo = reservamongo;
      this.hayReserva = true;
    });
  }
}
