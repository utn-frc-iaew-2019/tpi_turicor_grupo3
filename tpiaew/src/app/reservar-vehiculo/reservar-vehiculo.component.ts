import { Component, OnInit } from '@angular/core';
import { ServicioSoapService } from '../serviciosoap.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Reserva } from '../reservas.model';

@Component({
  selector: 'app-reservar-vehiculo',
  templateUrl: './reservar-vehiculo.component.html',
  styleUrls: ['./reservar-vehiculo.component.css']
})
export class ReservarVehiculoComponent implements OnInit {

  suscripcion: Subscription;
  idVehiculoCiudad: number;
  detalleReserva: Reserva;
  hayReserva: boolean=false;

  constructor(public servicio: ServicioSoapService) { }

  ngOnInit() {
    this.idVehiculoCiudad=this.servicio.getIdVehiculoCiudad();
  }

  onReserva(form: NgForm){
    this.servicio.reservarVehiculo(
      form.value.apellidoNombre,
      form.value.fechaDevolucion,
      form.value.fechaRetiro,
      this.idVehiculoCiudad,
      form.value.lugarDevolucion,
      form.value.lugarRetiro,
      form.value.nroDocumento);
    this.servicio.getReservaListener().subscribe(detalleReserva =>{
        this.hayReserva=true;
        // console.dir(detalleReserva);
        this.detalleReserva=detalleReserva;
      });
    //Aca se deberia guardar el detalle de la reserva en nuestra bd
  }
}
