import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  categories = ['همه', 'سفالگری', 'میناکاری', 'نقاشی', 'مجسمه سازی', 'فرش بافی'];
  categoryNames = ['all', 'pottery', 'enamels', 'painting', 'sculpture', 'weaving'];
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
