import { Component, OnInit } from '@angular/core';
import { ServicioSoapService } from '../serviciosoap.service';
import { Pais } from '../paises.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Ciudad } from '../ciudades.model';
import { Vehiculo } from '../vehiculos.model';

@Component({
  selector: 'app-consultar-vehiculos-disponibles',
  templateUrl: './consultar-vehiculos-disponibles.component.html',
  styleUrls: ['./consultar-vehiculos-disponibles.component.css']
})
export class ConsultarVehiculosDisponiblesComponent implements OnInit {

  paises: Pais[]= [];
  vehiculos: Vehiculo[]= [];
  ciudades: Ciudad[]=[];
  suscripcion: Subscription;
  displayedColumns: string[] = [
    "CantidadDisponible",
     "CantidadPuertas",
     "Marca",
     "Modelo",
     "PrecioPorDia",
     "PrecioDeVenta",
     "Puntaje",
     "TieneAireAcon",
     "TieneDireccion",
     "TipoCambio",
     "Reservar"
      ];

  constructor(public servicio: ServicioSoapService) { }


  ngOnInit() {
      this.servicio.getPaises();
      this.suscripcion = this.servicio
        .getPaisesListener()
        .subscribe(paisesActualizadas => {
          this.paises = paisesActualizadas;
        });

      }

  obtenerCiudades(idPais){
    this.servicio.getCiudades(idPais);
    this.suscripcion = this.servicio
      .getCiudadesListener()
      .subscribe(ciudadesActualizadas => {
        this.ciudades = ciudadesActualizadas;
      });
  }

  formatearDatosVehiculo(){
    this.vehiculos.forEach(vehiculo => {
      if(vehiculo["a:TieneAireAcon"])
      {
        vehiculo["a:TieneAireAcon"]='Sí'
      }
      else{
        vehiculo["a:TieneAireAcon"]='No'
      }
      if(vehiculo["a:TieneDireccion"])
      {
        vehiculo["a:TieneDireccion"]='Sí'
      }
      else{
        vehiculo["a:TieneDireccion"]='No'
      }
      if(vehiculo["a:TipoCambio"]==='M')
      {
        vehiculo["a:TipoCambio"]='Manual'
      }
      else{
        vehiculo["a:TipoCambio"]='Automático'
      }
    });
  }

  onBuscar(form: NgForm){
    const ciudadFiltrada=this.ciudades.find(ciudad => ciudad["b:Nombre"] ==form.value.ciudad);
    this.servicio.getVehiculosDisponibles(ciudadFiltrada["b:Id"],form.value.fechaRetiro,form.value.fechaDevolucion);
    this.suscripcion = this.servicio
      .getVehiculosListener()
      .subscribe(vehiculosActualizados => {
        this.vehiculos = vehiculosActualizados;
        this.formatearDatosVehiculo();
      });
  }

  envioIdVehiculo(row){
    this.servicio.setIdVehiculoCiudad(row["a:VehiculoCiudadId"]);
  }
}
