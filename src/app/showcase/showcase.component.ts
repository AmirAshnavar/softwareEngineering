import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})
export class ShowcaseComponent implements OnInit {
  isLoading = false;
  category = '-1';
  productsToShow: [Product];
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dataService: DataService) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        const category = this.activatedRoute.snapshot.paramMap.get('category');
        switch (category) {
          case 'all':
            break;
          case 'painting':
            this.category = '0';
            break;
          case 'sculpture':
            this.category = '3';
            break;
          case 'pottery':
            this.category = '1';
            break;
          case 'enamels':
            this.category = '4';
            break;
          case 'weaving':
            this.category = '2';
            break;
        }
        this.fetchCategoryProducts(this.category);
      }
    });

  }

  ngOnInit() {
  }

  fetchCategoryProducts(category: string) {
    this.isLoading = true;


    this.dataService.fetchCategoryProducts(category).subscribe(result => {
      this.productsToShow = result.products;
      this.isLoading = false;

    });

  }

}
