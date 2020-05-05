import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.css']
})
export class JoinUsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goCustomImageUpload(type) {
    if (type === 'solo') {
      this.router.navigate(['image-upload-solo'], { queryParams: { type: type } });
    } else if (type === 'familia') {
      this.router.navigate(['image-upload-familia'], { queryParams: { type: type } });
    }
  }

}
