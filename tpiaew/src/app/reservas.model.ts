import { VehiculoPorCiudad } from "./vehiculoPorCiudad.model";

export interface Reserva {
  "b:ApellidoNombreCliente": string;
  "b:CodigoReserva": string;
  "b:Estado": string;
  "b:FechaCancelacion": string; //Esta en null
  "b:FechaHoraDevolucion": string;
  "b:FechaHoraRetiro": string;
  "b:FechaReserva": string;
  "b:Id": number;
  "b:LugarDevolucion": string;
  "b:LugarRetiro": string;
  "b:NroDocumentoCliente": number;
  "b:TotalReserva": number;
  "b:UsuarioCancelacion": any; //Esta en null
  "b:UsuarioReserva": string;
  // "b:VehiculoPorCiudadEntity": VehiculoPorCiudad,
  "b:VehiculoPorCiudadEntity": {
    "a:CantidadDisponible": number;
    "b:CiudadEntity": string; //Esta en null
    "b:CiudadId": number;
    "b:Id": number;
    "b:VehiculoEntity": {
      "b:CantidadPuertas": number;
      "b:Id": number;
      "b:Marca": string;
      "b:Modelo": string;
      "b:PrecioPorDia": number;
      "b:Puntaje": number;
      "b:TieneAireAcon": boolean;
      "b:TieneDireccion": boolean;
      "b:TipoCambio": string;
    };
    "b:VehiculoId": number;
  };
  "b:VehiculoPorCiudadId": number;
}
