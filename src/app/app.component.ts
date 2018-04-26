import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template:
`
  <div class="tag"><h1><b>This is Angular Universal</b></h1>
  <a routerLink="/">Home</a>
  <a routerLink="/lazy">Lazy</a>
  <a routerLink="/lazy/nested">Lazy_Nested</a></div>
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {

}
