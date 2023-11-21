import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComboboxComponent } from './combobox/combobox.component';
import { StationsService } from './stations.service';
import { FormsModule } from '@angular/forms';
import { TestFormComponent } from './test-form/test-form.component';

@NgModule({
  declarations: [AppComponent, ComboboxComponent, TestFormComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [StationsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
