import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultarVehiculosDisponiblesComponent } from './consultar-vehiculos-disponibles/consultar-vehiculos-disponibles.component';
import { ReservarVehiculoComponent } from './reservar-vehiculo/reservar-vehiculo.component';
import { ListarReservasComponent } from './listar-reservas/listar-reservas.component';

const routes: Routes = [
  { path: '', component: ConsultarVehiculosDisponiblesComponent },
  { path: 'reserva', component: ReservarVehiculoComponent },
  { path: 'lista/reserva', component: ListarReservasComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
