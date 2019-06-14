import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Pais } from './paises.model';
import { Ciudad } from './ciudades.model';

@Injectable ({
  providedIn: 'root'
})
export class ServicioSoapService {
  paises: Pais[]= [];
  paisesActualizados = new Subject<Pais[]>();
  ciudades: Ciudad[]= [];
  ciudadesActualizadas = new Subject<Ciudad[]>();

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
        this.ciudades= [response.ciudades]
      }
      this.ciudadesActualizadas.next([...this.ciudades]);
    });
  }

}
