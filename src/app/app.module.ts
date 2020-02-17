import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ShowcaseItemComponent } from './main-page/showcase-item/showcase-item.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { LoginComponent } from './AAA/login/login/login.component';
import { SignupComponent } from './AAA/signup/signup/signup.component';
import { ArtistPageComponent } from './artist/artist-page/artist-page.component';
import { NavComponent } from './layout/nav/nav.component';
import { MostPopularComponent } from './main-page/most-popular/most-popular.component';
import { LatestComponent } from './main-page/latest/latest.component';
import { OffPriceComponent } from './main-page/off-price/off-price.component';
import { CategoryCorouselComponent } from './main-page/category-corousel/category-corousel.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { ArtistsComponent } from './artists/artists.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NewProductComponent } from './showcase/new-product/new-product.component';
import { AuthInterceptor } from './AAA/auth-interceptor';
import { FourOFourComponent } from './four-o-four/four-o-four.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    ShowcaseItemComponent,
    HomePageComponent,
    LoginComponent,
    SignupComponent,
    ArtistPageComponent,
    NavComponent,
    MostPopularComponent,
    LatestComponent,
    OffPriceComponent,
    CategoryCorouselComponent,
    ShowcaseComponent,
    ArtistsComponent,
    NewProductComponent,
    FourOFourComponent],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
