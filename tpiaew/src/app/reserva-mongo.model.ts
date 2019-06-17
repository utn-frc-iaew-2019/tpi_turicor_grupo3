export interface ReservaMongo {
  codigoReserva: string;
  fechaReserva: string;
  idCliente: number;
  costo: number;
  precioVenta: number;
  // En el modelado sugerido hay idvendedor, idvehiculociudad, idciudad, idpais.
}
