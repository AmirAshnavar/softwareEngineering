import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { ArtistsComponent } from './artists/artists.component';
import { ArtistPageComponent } from './artist/artist-page/artist-page.component';
import { AuthGuard } from './AAA/auth.guard';
import { LoginComponent } from './AAA/login/login/login.component';
import { SignupComponent } from './AAA/signup/signup/signup.component';
import { FourOFourComponent } from './four-o-four/four-o-four.component';


const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', canActivate: [AuthGuard], component: HomePageComponent },
  { path: 'showcase/:category', component: ShowcaseComponent },
  // { path: 'artist/:artist', component: ArtistsComponent },
  { path: 'artist/:artist', component: ArtistPageComponent },
  { path: 'not-found', component: FourOFourComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]

})
export class AppRoutingModule { }
