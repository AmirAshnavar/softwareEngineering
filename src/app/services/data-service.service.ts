import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  newPostAdded = new Subject<Product>();
  constructor(private http: HttpClient, private auth: AuthService) { }

  addPost(title: string, content: string, image: File, category: string, price: string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    postData.append("category", category);
    postData.append("price", price);
    this.http
      .post<{ message: string; product: Product }>(
        "http://localhost:3000/api/products",
        postData
      )
      .subscribe(responseData => {
        this.newPostAdded.next(responseData.product);
        console.log('responseData.product ', responseData.product, 'responseData ', responseData)
      });
  }

  getMyProducts() {
    return this.http.get<{ products: [Product] }>('http://localhost:3000/api/products/myProducts');
  }

  getMyFavoriteProducts() {
    return this.http.get<{ products: [Product] }>('http://localhost:3000/api/products/favorites');
  }

  fetchCategoryProducts(categoryId: string) {
    return this.http.get<{ products: [Product] }>('http://localhost:3000/api/products/category/' + categoryId);
  }

  getArtistProducts(artistUsername: string) {
    console.log(artistUsername);
    return this.http.post<{ products: [Product] }>('http://localhost:3000/api/products/artistProducts/' + artistUsername,
      { username: this.auth.getUsername() }
    );
  }

  getArtistData(artistUsername: string) {
    console.log(artistUsername);
    return this.http.get<{
      userData: {
        artisicName: string,
        followersCount: number,
        productsCount: string,
        category: string,
        followers:[string]
      }
    }>('http://localhost:3000/api/user/artist/' + artistUsername);
  }

  pushLikeAction(postId: string) {
    return this.http.post<{ message: string }>('http://localhost:3000/api/products/like', { postId: postId });
  }

  pushFollowAction(artist: string) {
    return this.http.post<{ message: string }>('http://localhost:3000/api/user/follow', { artistUsername: artist });
  }
}
