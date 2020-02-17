import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent implements OnInit {

  artistProducts = [];
  artistProductsLoaded = false;
  userDataLoaded = false;
  userValid = true;
  followed: boolean;
  artistData: { artisicName: string, followersCount: number, followers: [string], productsCount: string, category: string }
  artist = '';

  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService) {
    this.artist = this.activatedRoute.snapshot.paramMap.get('artist');
  }


  ngOnInit() {
    if (this.authService.getUsername() === this.artist) {
      this.router.navigate(["/home"]);
    }
    this.getArtistData();
    this.getArtistProducts();
  }

  getArtistProducts() {
    this.dataService.getArtistProducts(this.artist).subscribe(response => {
      this.artistProducts = response.products.map(item => {
        const isliked = (item.likes['likedBy'].includes(this.authService.getUsername()));
        return {
          ...item,
          isLiked: isliked
        }

      });
      this.artistProductsLoaded = true;
      console.log(this.artistProducts);
    });
  }

  getArtistData() {
    this.dataService.getArtistData(this.artist).subscribe(response => {
      if (response['message'] === 'found') {
        this.artistData = response.userData;
        let category = ''
        switch (response.userData.category) {
          case '0':
            category = 'نقاش';
            break;
          case '1':
            category = 'سفالگر';
            break;
          case '2':
            category = 'فرش باف';
            break;
          case '3':
            category = 'مجسمه ساز';
            break;
          case '4':
            category = 'میناکار';
            break;
        }
        if (response.userData.followers.includes(this.authService.getUsername())) {
          this.followed = true;
        } else {
          this.followed = false;
        }
        this.artistData.category = category;
        this.userDataLoaded = true;
      } else {
        this.userValid = false;
        this.router.navigate(['/not-found']);
      }
    });
  }

  pushLikeAction(id: string, index: number) {
    if (!this.authService.getIsAuth()) {
      this.router.navigate(['/login']);
    } else {
      this.dataService.pushLikeAction(id).subscribe((response) => {
        if (response.message === 'liked') {
          this.artistProducts[index].likes.count++;
          this.artistProducts[index].isLiked = true;
        } else if (response.message === 'unliked') {
          this.artistProducts[index].likes.count--;
          this.artistProducts[index].isLiked = false;
        } else {
          return;
        }
      });
    }
  }

  pushFollowAction(id: string, index: number) {
    if (!this.authService.getIsAuth()) {
      this.router.navigate(['/login']);
    } else {
      this.dataService.pushFollowAction(this.artist).subscribe((response) => {
        console.log(response);
        if (response.message === 'followed') {
          this.artistData.followers.push(this.authService.getUsername());
          this.artistData.followersCount++;
          this.followed = true;
        } else if (response.message === 'unfollowed') {
          this.artistData.followersCount--;
          this.followed = false;
        } else {
          return;
        }
      });
    }
  }

}
