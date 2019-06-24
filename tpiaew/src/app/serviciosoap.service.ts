import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";
import { Pais } from "./paises.model";
import { Ciudad } from "./ciudades.model";
import { Vehiculo } from "./vehiculos.model";
import { ReservaMongo } from "./reserva-mongo.model";
import { Cliente } from "./clientes.model";

@Injectable({
  providedIn: "root"
})
export class ServicioSoapService {
  paises: Pais[] = [];
  paisesActualizados = new Subject<Pais[]>();
  ciudades: Ciudad[] = [];
  ciudadesActualizadas = new Subject<Ciudad[]>();
  vehiculos: Vehiculo[] = [];
  vehiculosActualizados = new Subject<Vehiculo[]>();
  idVehiculoCiudad: number;
  idVehiculoCiudadActualizado = new Subject<number>();
  reservamongoActualizada = new Subject<ReservaMongo>();
  reservasCliente: ReservaMongo[];
  reservasClienteActualizadas = new Subject<ReservaMongo[]>();
  clienteActualizado = new Subject<Cliente>();
  cliente: Cliente;

  constructor(public http: HttpClient) {}

  getPaisesListener() {
    return this.paisesActualizados.asObservable();
  }

  getClienteListener() {
    return this.clienteActualizado.asObservable();
  }

  getPaises() {
    this.http
      .get<{ paises: Pais[] }>("http://localhost:3000/paises")
      .subscribe(response => {
        this.paises = response.paises;
        this.paisesActualizados.next([...this.paises]);
      });
  }

  getCiudadesListener() {
    return this.ciudadesActualizadas.asObservable();
  }

  getCiudades(idPais: string) {
    let params = new HttpParams().set("idPais", idPais);
    this.http
      .get<{ ciudades: Ciudad[] }>("http://localhost:3000/ciudades", {
        params: params
      })
      .subscribe(response => {
        if (response.ciudades instanceof Array) {
          this.ciudades = response.ciudades;
        } else {
          this.ciudades = [response.ciudades];
        }
        this.ciudadesActualizadas.next([...this.ciudades]);
      });
  }

  getVehiculosListener() {
    return this.vehiculosActualizados.asObservable();
  }

  getVehiculosDisponibles(
    idCiudad: string,
    fechaRetiro: string,
    fechaDevolucion: string
  ) {
    let params = new HttpParams()
      .set("idCiudad", idCiudad)
      .set("fechaRetiro", fechaRetiro)
      .set("fechaDevolucion", fechaDevolucion);
    this.http
      .get<{ vehiculos: Vehiculo[] }>(
        "http://localhost:3000/vehiculosDisponibles",
        { params: params }
      )
      .subscribe(response => {
        if (response.vehiculos instanceof Array) {
          this.vehiculos = response.vehiculos;
        } else {
          this.vehiculos = [response.vehiculos];
        }
        this.vehiculosActualizados.next([...this.vehiculos]);
      });
  }

  getReservaMongoListener() {
    return this.reservamongoActualizada.asObservable();
  }

  reservarVehiculo(
    apellidoNombre: string,
    fechaDevolucion: string,
    fechaRetiro: string,
    idVehiculoCiudad: number,
    lugarDevolucion: string,
    lugarRetiro: string,
    nroDocumento: number
  ) {
    const idCliente = this.cliente.id;
    const payload = {
      apellidoNombre,
      fechaDevolucion,
      fechaRetiro,
      idVehiculoCiudad,
      lugarDevolucion,
      lugarRetiro,
      nroDocumento,
      idCliente
    };
    this.http
      .post<{ message: string; reserva: ReservaMongo }>(
        "http://localhost:3000/reservar",
        payload
      )
      .subscribe(response => {
        this.reservamongoActualizada.next(response.reserva);
        console.log(response.message);
      });
  }

  getIdVehiculoCiudad() {
    return this.idVehiculoCiudad;
  }

  setIdVehiculoCiudad(idVehiculoCiudad: number) {
    this.idVehiculoCiudad = idVehiculoCiudad;
  }

  getReservasClienteListener() {
    return this.reservasClienteActualizadas.asObservable();
  }

  getReservasCliente() {
    let params = new HttpParams().set("idCliente", this.cliente.id.toString());
    this.http
      .get<{ reservas: ReservaMongo[] }>(
        "http://localhost:3000/lista/reserva",
        {
          params: params
        }
      )
      .subscribe(response => {
        if (response.reservas instanceof Array) {
          this.reservasCliente = response.reservas;
        } else {
          this.reservasCliente = [response.reservas];
        }
        this.reservasClienteActualizadas.next([...this.reservasCliente]);
      });
  }

  cancelarReserva(codigoReserva: string) {
    this.http
      .post<{ message: string }>("http://localhost:3000/cancelar", {
        codigoReserva: codigoReserva
      })
      .subscribe(response => {
        console.log("cancelarReserva -> servicio");
        this.reservasCliente = this.reservasCliente.filter(
          reserva => reserva.codigoReserva != codigoReserva
        );
        this.reservasClienteActualizadas.next(this.reservasCliente);
        console.log(response.message);
      });
  }

  getUsuario() {
    this.http
      .get<{cliente: Cliente}>("http://localhost:3000/cliente")
      .subscribe( response => {
        console.dir(response.cliente);
        this.cliente = response.cliente;
        this.clienteActualizado.next(this.cliente);
      });
  }


}
