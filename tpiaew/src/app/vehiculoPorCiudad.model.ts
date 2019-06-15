export interface VehiculoPorCiudad {
  "a:CantidadDisponible": number,
  "b:CiudadEntity": string,//Esta en null
  "b:CiudadId": number,
  "b:Id": number,
  "b:VehiculoEntity":{
    "b:CantidadPuertas": number,
    "b:Id":number,
    "b:Marca": string,
    "b:Modelo": string,
    "b:PrecioPorDia":number,
    "b:Puntaje":number,
    "b:TieneAireAcon": boolean,
    "b:TieneDireccion": boolean,
    "b:TipoCambio": string,
  }
  "b:VehiculoId": number
}
