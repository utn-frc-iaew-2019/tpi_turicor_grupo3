import { Pais } from './paises.model';

export interface Ciudad {
  "b:Id": string,
  "b:Nombre": string,
  "b:PaisEntity": Pais;
}
