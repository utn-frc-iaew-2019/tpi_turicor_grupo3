import { Component, OnInit } from '@angular/core';
import { ServicioSoapService } from '../serviciosoap.service';
import { Pais } from '../paises.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-consultar-vehiculos-disponibles',
  templateUrl: './consultar-vehiculos-disponibles.component.html',
  styleUrls: ['./consultar-vehiculos-disponibles.component.css']
})
export class ConsultarVehiculosDisponiblesComponent implements OnInit {

  paises: Pais[]= [];
  ciudadesFiltradas;
  ciudades;
  suscripcion: Subscription;
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
}
