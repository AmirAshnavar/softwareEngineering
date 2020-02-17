import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-four-o-four',
  templateUrl: './four-o-four.component.html',
  styleUrls: ['./four-o-four.component.css']
})
export class FourOFourComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  navigateToMainPage(){
    this.router.navigate([""]);
  }

}
