import {Component, OnInit} from '@angular/core';
declare let ol: any;
import View from 'ol/view';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

   constructor() {}

    london = ol.proj.fromLonLat([-0.12755, 51.507222]);
      moscow = ol.proj.fromLonLat([37.6178, 55.7517]);
      istanbul = ol.proj.fromLonLat([28.9744, 41.0128]);
      rome = ol.proj.fromLonLat([12.5, 41.9]);
      bern = ol.proj.fromLonLat([7.4458, 46.95]);

      view = new ol.View({
        center: this.istanbul,
        zoom: 6
      });

      map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            preload: 4,
            source: new ol.source.OSM()
          })
        ],
        // Improve user experience by loading tiles while animating. Will make
        // animations stutter on mobile or slow devices.
        loadTilesWhileAnimating: true,
        view: this.view
      });
      s: any;
      p: any;
      l;
      bounce(t) {
        this.s = 7.5625;
        this.p = 2.75;
        if (t < (1 / this.p)) {
          this.l = this.s * t * t;
        } else {
          if (t < (2 / this.p)) {
            t -= (1.5 / this.p);
            this.l = this.s * t * t + 0.75;
          } else {
            if (t < (2.5 / this.p)) {
              t -= (2.25 / this.p);
              this.l = this.s * t * t + 0.9375;
            } else {
              t -= (2.625 / this.p);
              this.l = this.s * t * t + 0.984375;
            }
          }
        }
        return this.l;
      }

      elastic(t) {
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
      }

      onClick(id, callback) {
        document.getElementById(id).addEventListener('click', callback);
      }
    //  let duration;
     // let zoom;

      flyTo(location, done) {
       const  duration  = 2000;
       const  zoom   = this.view.getZoom();
        let parts = 2;
        let called = false;
        function callback(complete) {
          --parts;
          if (called) {
            return;
          }
          if (parts === 0 || !complete) {
            called = true;
            done(complete);
          }
        }
        this.view.animate({
          center: location,
          duration: duration
        }, callback);
        this.view.animate({
          zoom: zoom - 1,
          duration: duration / 2
        }, {
          zoom: zoom,
          duration: duration / 2
        }, callback);
      }

      // tour() {
      //   locations = [this.london, this.bern, this.rome, this.moscow, this.istanbul];
      //   index = -1;
      //   this.next(more) => {
      //     if (more) {
      //       ++index;
      //       if (index < locations.length) {
      //         let delay = index === 0 ? 0 : 750;
      //         setTimeout(() => {
      //           flyTo(locations[index], this.next);
      //         }, delay);
      //       } else {
      //         alert('Tour complete');
      //       }
      //     } else {
      //       alert('Tour cancelled');
      //     }
      //   }
      //   next(true);
      // }
  ngOnInit(): any {
    this.onClick('rotate-left', () => {
      this.view.animate({
        rotation: this.view.getRotation() + Math.PI / 2
      });
    });
    this.onClick('rotate-right', () => {
      this.view.animate({
        rotation: this.view.getRotation() - Math.PI / 2
      });
    });
    let rotation;
    this.onClick('rotate-around-rome', () => {
      // Rotation animation takes the shortest arc, so animate in two parts
      rotation = this.view.getRotation();
      this.view.animate({
        rotation: rotation + Math.PI,
        anchor: this.rome,
        easing: ol.easing.easeIn
      }, {
        rotation: rotation + 2 * Math.PI,
        anchor: this.rome,
        easing: ol.easing.easeOut
      });
    });

    this.onClick('pan-to-london', () => {
      this.view.animate({
        center: this.london,
        duration: 2000
      });
    });

    this.onClick('elastic-to-moscow', () => {
      this.view.animate({
        center: this.moscow,
        duration: 2000,
        easing: this.elastic
      });
    });

    this.onClick('bounce-to-istanbul', () => {
      this.view.animate({
        center: this.istanbul,
        duration: 2000,
        easing: this.bounce
      });
    });

    let center;
    this.onClick('spin-to-rome', () => {
      // Rotation animation takes the shortest arc, so animate in two parts
       center = this.view.getCenter();
      this.view.animate({
        center: [
          center[0] + (this.rome[0] - center[0]) / 2,
          center[1] + (this.rome[1] - center[1]) / 2
        ],
        rotation: Math.PI,
        easing: ol.easing.easeIn
      }, {
        center: this.rome,
        rotation: 2 * Math.PI,
        easing: ol.easing.easeOut
      });
    });

    this.onClick('fly-to-bern', () => {
      this.flyTo(this.bern, () => {});
    });

    // this.onClick('tour', this.tour)
  }
}
