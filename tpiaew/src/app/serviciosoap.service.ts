import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Pais } from './paises.model';
import { Ciudad } from './ciudades.model';
import { Vehiculo } from './vehiculos.model';
import { Reserva } from './reservas.model';

@Injectable ({
  providedIn: 'root'
})
export class ServicioSoapService {
  paises: Pais[]= [];
  paisesActualizados = new Subject<Pais[]>();
  ciudades: Ciudad[]= [];
  ciudadesActualizadas = new Subject<Ciudad[]>();
  vehiculos: Vehiculo[]= [];
  vehiculosActualizados = new Subject<Vehiculo[]>();
  reserva: Reserva;
  reservaActualizada= new Subject<Reserva>();
  idVehiculoCiudad: number;
  idVehiculoCiudadActualizado= new Subject<number>();

  constructor(public http: HttpClient) {}

  getPaisesListener(){
    return this.paisesActualizados.asObservable();
  }

  getPaises() {
    this.http.get<{paises: Pais[]}>('http://localhost:3000/paises')
    .subscribe((response) => {
      this.paises = response.paises;
      this.paisesActualizados.next([...this.paises]);
    });
  }

  getCiudadesListener(){
    return this.ciudadesActualizadas.asObservable();
  }

  getCiudades(idPais:string) {
    let params = new HttpParams().set("idPais", idPais);
    this.http.get<{ciudades: Ciudad[]}>('http://localhost:3000/ciudades',{params:params})
    .subscribe((response) => {
      if(response.ciudades instanceof Array){
        this.ciudades = response.ciudades;
      }else{
        this.ciudades= [response.ciudades];
      }
      this.ciudadesActualizadas.next([...this.ciudades]);
    });
  }

  getVehiculosListener(){
    return this.vehiculosActualizados.asObservable();
  }

  getVehiculosDisponibles(idCiudad: string, fechaRetiro: string, fechaDevolucion: string){
    let params = new HttpParams().set("idCiudad", idCiudad).set("fechaRetiro", fechaRetiro).set("fechaDevolucion", fechaDevolucion);
    this.http.get<{vehiculos: Vehiculo[]}>('http://localhost:3000/vehiculosDisponibles',{params:params})
    .subscribe((response) => {
      if(response.vehiculos instanceof Array){
        this.vehiculos = response.vehiculos;
      }else{
        this.vehiculos= [response.vehiculos];
      }
      this.vehiculos.forEach(vehiculo => vehiculo["a:PrecioPorDia"]=vehiculo["a:PrecioPorDia"] * 1.2);
      this.vehiculosActualizados.next([...this.vehiculos]);
    });
  }

  getReservaListener(){
    return this.reservaActualizada.asObservable();
  }

  reservarVehiculo(apellidoNombre: string, fechaDevolucion: string, fechaRetiro: string,
    idVehiculoCiudad: number, lugarDevolucion: string, lugarRetiro: string, nroDocumento: number){
    const payload ={
      apellidoNombre,
      fechaDevolucion,
      fechaRetiro,
      idVehiculoCiudad,
      lugarDevolucion,
      lugarRetiro,
      nroDocumento
      }
      this.http.post<{reserva: any}>('http://localhost:3000/reservar',payload)
    .subscribe((response) => {
      this.reserva = response.reserva;
      console.dir(response.reserva);
      this.reservaActualizada.next(this.reserva);
    });
  }

  getIdVehiculoCiudad(){
    return this.idVehiculoCiudad;
  }

  setIdVehiculoCiudad(idVehiculoCiudad: number){
    this.idVehiculoCiudad=idVehiculoCiudad;
  }
}
