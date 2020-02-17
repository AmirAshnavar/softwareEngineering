import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "../AAA/auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private category: string;
  private username: string;
  private artisic: string;
  private productCount: number;
  private followersCount: number;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getUsername() {
    return this.username;
  }

  getProductCount() {
    return this.productCount;
  }
  getFollowersCount() {
    return this.followersCount;
  }
  getCategory() {
    return this.category;
  }
  getArtisic() {
    return this.artisic;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(password: string, username: string, artisicName: string, category: string) {
    const authData = {

      password: password,
      username: username,
      artisic: artisicName,
      category: category
    };
    this.http
      .post<{ message: string }>("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        if (response.message && response.message == 'User created!') {
          this.login(username, password);
        };
      });
  }

  login(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.http
      .post<{
        token: string,
        expiresIn: number,
        category: string,
        artisic: string,
        productsCount: number,
        followersCount: number
      }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          console.log(response)
          this.setCategory(response.category);
          this.username = username;
          this.artisic = response.artisic;
          this.productCount = response.productsCount;
          this.followersCount = response.followersCount;
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }
  setCategory(category: string) {
    switch (category) {
      case '0':
        this.category = 'نقاش';
        break;
      case '1':
        this.category = 'سفالگر';
        break;
      case '2':
        this.category = 'فرش باف';
        break;
      case '3':
        this.category = 'مجسمه ساز';
        break;
      case '4':
        this.category = 'میناکار';
        break;
    }
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.username = authInformation.username;
      this.category = authInformation.category;
      this.artisic = authInformation.artisic;
      this.productCount = parseInt(authInformation.productsCount);
      this.followersCount = parseInt(authInformation.followersCount);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.username = null;
    this.category = null;
    this.artisic = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", this.username);
    localStorage.setItem("productCount", this.productCount + '');
    localStorage.setItem("followersCount", this.followersCount + '');
    localStorage.setItem("category", this.category);
    localStorage.setItem("artisic", this.artisic);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("username");
    localStorage.removeItem("productCount");
    localStorage.removeItem("followersCount");
    localStorage.removeItem("category");
    localStorage.removeItem("artisic");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const artisic = localStorage.getItem("artisic");
    const category = localStorage.getItem("category");
    const username = localStorage.getItem("username");
    const followersCount = localStorage.getItem("followersCount");
    const productsCount = localStorage.getItem("productCount");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      artisic: artisic,
      username: username,
      category: category,
      followersCount: followersCount,
      productsCount: productsCount
    }
  }
}
