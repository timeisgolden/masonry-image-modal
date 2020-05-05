import { Component, OnInit, ElementRef, Inject, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'app/shared/services/config.service';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit, AfterViewInit {
  // @ViewChild('wrapper', { static: false }) wrapper: ElementRef;

  // hideSidebar: boolean;
  // iscollapsed = false;

  // public config: any = {};


  constructor(private elementRef: ElementRef, private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {


  }

  ngOnInit() {
    // this.config = this.configService.templateConf;
  }

  ngAfterViewInit() {
    setTimeout(() => {

      // if (this.config.layout.variant === "Dark") {
      //   this.renderer.addClass(this.document.body, 'layout-dark');
      // }
      // else if (this.config.layout.variant === "Transparent") {
      //   this.renderer.addClass(this.document.body, 'layout-dark');
      //   this.renderer.addClass(this.document.body, 'layout-transparent');
      //   if (this.config.layout.sidebar.backgroundColor) {
      //     this.renderer.addClass(this.document.body, this.config.layout.sidebar.backgroundColor);
      //   }
      //   else {
      //     this.renderer.addClass(this.document.body, 'bg-glass-1');
      //   }
      // }


    }, 0);

  }


  toggleHideSidebar($event: boolean): void {
    setTimeout(() => {
      // this.hideSidebar = $event;
    }, 0);
  }
}
