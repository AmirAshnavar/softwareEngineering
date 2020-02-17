import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;

  myProducts = [];
  myProductsLoaded = false;

  myFavoriteProducts = [];
  myFavoriteProductsLoaded = false;
  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {
    this.getMyProducts();
    this.getMyFavoriteProducts();
    this.dataService.newPostAdded.subscribe((product) => {
      this.myProducts.push(product);
      this.closeBtn.nativeElement.click();
    });
  }
  getMyProducts() {

    this.dataService.getMyProducts().subscribe(response => {
      this.myProducts = response.products;
      this.myProductsLoaded = true;
    });
  }

  getMyFavoriteProducts() {

    this.dataService.getMyFavoriteProducts().subscribe(response => {
      this.myFavoriteProducts = response.products;
      this.myFavoriteProductsLoaded = true;
      console.log(this.myFavoriteProducts ,response );
    });
  }

}
