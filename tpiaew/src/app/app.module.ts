import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConsultarVehiculosDisponiblesComponent } from './consultar-vehiculos-disponibles/consultar-vehiculos-disponibles.component';
import { MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatTableModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReservarVehiculoComponent } from './reservar-vehiculo/reservar-vehiculo.component';
import { ListarReservasComponent } from './listar-reservas/listar-reservas.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ConsultarVehiculosDisponiblesComponent,
    ReservarVehiculoComponent,
    ListarReservasComponent,
    LoginComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    HttpClientModule,
    AppRoutingModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
