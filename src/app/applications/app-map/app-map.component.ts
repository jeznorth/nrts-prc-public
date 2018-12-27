import { Component, AfterViewInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationRef, ElementRef, SimpleChanges, Injector, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'leaflet';
import 'leaflet.markercluster';
import * as _ from 'lodash';

import { Application } from 'app/models/application';
import { ApplicationService } from 'app/services/application.service';
import { ConfigService } from 'app/services/config.service';
import { UrlService } from 'app/services/url.service';
import { MarkerPopupComponent } from './marker-popup/marker-popup.component';

declare module 'leaflet' {
  export interface Marker<P = any> {
    dispositionId: number;
  }
}

const L = window['L'];

const markerIcon = L.icon({
  iconUrl: 'assets/images/baseline-location-24px.svg',
  // Retina Icon is not needed here considering we're using an SVG. Enable if you want to change to a raster asset.
  // iconRetinaUrl: 'assets/images/marker-icon-2x-yellow.svg',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  tooltipAnchor: [16, -28]
});

const markerIconLg = L.icon({
  iconUrl: 'assets/images/baseline-location_on-24px.svg',
  // Retina Icon is not needed here considering we're using an SVG. Enable if you want to change to a raster asset.
  // iconRetinaUrl: 'assets/images/marker-icon-yellow-lg.svg',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  // popupAnchor: [1, -34], // TODO: update, if needed
  // tooltipAnchor: [16, -28] // TODO: update, if needed
});

@Component({
  selector: 'app-map',
  templateUrl: './app-map.component.html',
  styleUrls: ['./app-map.component.scss']
})

export class AppMapComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() isLoading: boolean; // from applications component
  @Input() applications: Array<Application> = []; // from applications component
  @Input() isMapVisible: Array<Application> = []; // from applications component
  @Output() toggleCurrentApp = new EventEmitter(); // to applications component
  @Output() updateCoordinates = new EventEmitter(); // to applications component

  private map: L.Map = null;
  private markerList: Array<L.Marker> = []; // list of markers
  private currentMarker: L.Marker = null; // for removing previous marker
  private markerClusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 40, // NB: change to 0 to disable clustering
    iconCreateFunction: this.clusterCreate
  });
  private oldZoom: number = null;
  private isMapReady = false;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  readonly defaultBounds = L.latLngBounds([48, -139], [60, -114]); // all of BC

  constructor(
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    public applicationService: ApplicationService,
    public configService: ConfigService,
    public urlService: UrlService,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {
    this.urlService.onNavEnd$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        // FUTURE
        // // try to load new map state
        // if (this.isMapReady) {
        //   const lat = this.urlService.query('lat');
        //   const lng = this.urlService.query('lng');
        //   const zoom = this.urlService.query('zoom');

        //   if (lat && lng && zoom) {
        //     console.log('...updating map state');
        //     this.map.setView(L.latLng(+lat, +lng), +zoom);
        //   } else {
        //     console.log('...fitting default bounds');
        //     this.fitBounds(); // default bounds
        //   }
        // }
      });
  }

  // for creating custom cluster icon
  private clusterCreate(cluster): L.Icon | L.DivIcon {
    const childCount = cluster.getChildCount();
    let c = ' marker-cluster-';
    if (childCount < 10) {
      c += 'small';
    } else if (childCount < 100) {
      c += 'medium';
    } else {
      c += 'large';
    }

    return new L.DivIcon({
      html: `<div><span title="${childCount} applications near this location">${childCount}</span></div>`,
      className: 'cluster-marker-count' + c,
      iconSize: new L.Point(48, 48),
      iconAnchor: [25, 46]
    });
  }

  // create map after view (which contains map id) is initialized
  ngAfterViewInit() {
    const self = this; // for closure function below

    // custom control to reset map view
    const resetViewControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function () {
        const element = L.DomUtil.create('button');

        element.title = 'Reset view';
        element.innerText = 'refresh'; // material icon name
        element.onclick = () => self.resetView();
        element.className = 'material-icons map-reset-control';

        // prevent underlying map actions for these events
        L.DomEvent.disableClickPropagation(element); // includes double-click
        L.DomEvent.disableScrollPropagation(element);

        return element;
      },
    });

    const Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
      maxZoom: 13,
      noWrap: true
    });
    const Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
      maxZoom: 16,
      noWrap: true
    });
    const OpenMapSurfer_Roads = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
      attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 20,
      noWrap: true
    });
    const World_Topo_Map = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
      maxZoom: 16,
      noWrap: true
    });
    const World_Imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 17,
      noWrap: true
    });

    this.map = L.map('map', {
      zoomControl: false, // will be added manually below
      maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)), // restrict view to "the world"
      zoomSnap: 0.1, // for greater granularity when fitting bounds
      attributionControl: false
    });

    // identify when map has initialized with a view
    this.map.whenReady(() => this.isMapReady = true);

    // map state change events
    this.map.on('zoomstart', function () {
      // console.log('zoomstart');
      this.oldZoom = this.map.getZoom();
    }, this);

    // this.map.on('movestart', function () {
    //   console.log('movestart');
    // }, this);

    // this.map.on('resize', function () {
    //   console.log('resize');
    // }, this);

    // NB: moveend is called after zoomstart, movestart and resize
    // NB: fitBounds() also ends up here
    this.map.on('moveend', () => {
      // console.log('moveend');

      // notify applications component of updated coordinates
      // const newZoom = this.map.getZoom();
      // const doEmit = newZoom <= this.oldZoom; // ignore zooming in
      // this.oldZoom = newZoom;
      // if (doEmit) { this.emitCoordinates(); }
      if (this.isMapReady) { this.emitCoordinates(); }

      // FUTURE
      // // save map state
      // if (this.isMapReady) {
      //   console.log('...saving map state');
      //   const center = this.map.getCenter();
      //   const zoom = this.map.getZoom();
      //   this.urlService.save('lat', center.lat.toFixed(4).toString());
      //   this.urlService.save('lng', center.lng.toFixed(4).toString());
      //   this.urlService.save('zoom', zoom.toFixed(1).toString());
      // }
    });

    // add markers group
    this.map.addLayer(this.markerClusterGroup);

    // ensure that when we zoom to the cluster group we allocate some space around the edge of the map
    // TODO: make this work
    // this.markerClusterGroup.on('clusterclick', a => a.layer.zoomToBounds({padding: [100, 100]}));

    // define baselayers
    const baseLayers = {
      'Ocean Base': Esri_OceanBasemap,
      'Nat Geo World Map': Esri_NatGeoWorldMap,
      'Open Surfer Roads': OpenMapSurfer_Roads,
      'World Topographic': World_Topo_Map,
      'World Imagery': World_Imagery
    };

    // add layer control
    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(this.map);

    // map attribution
    L.control.attribution({ position: 'bottomright' }).addTo(this.map);

    // add scale control
    // L.control.scale({ position: 'bottomleft' }).addTo(this.map);

    // add zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // add reset view control
    this.map.addControl(new resetViewControl());

    // load base layer
    for (const key of Object.keys(baseLayers)) {
      if (key === this.configService.baseLayerName) {
        this.map.addLayer(baseLayers[key]);
        break;
      }
    }

    // save any future base layer changes
    this.map.on('baselayerchange', (e: L.LayersControlEvent) => {
      this.configService.baseLayerName = e.name;
    });

    this.fixMap();
  }

  // to avoid timing conflict with animations (resulting in small map tile at top left of page),
  // ensure map component is visible in the DOM then update it; otherwise wait a bit...
  // ref: https://github.com/Leaflet/Leaflet/issues/4835
  // ref: https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  private fixMap() {
    // console.log('fixing map');
    if (this.elementRef.nativeElement.offsetParent) {
      // try to restore map state
      const lat = this.urlService.query('lat');
      const lng = this.urlService.query('lng');
      const zoom = this.urlService.query('zoom');

      if (lat && lng && zoom) {
        this.map.setView(L.latLng(+lat, +lng), +zoom); // NOTE: unary operators
      } else {
        this.fitBounds(); // default bounds
      }
    } else {
      setTimeout(this.fixMap.bind(this), 50);
    }
  }

  // called when apps list changes
  public ngOnChanges(changes: SimpleChanges) {
    // update map only if it's visible
    if (this.isMapVisible) {
      if (changes.applications && !changes.applications.firstChange && changes.applications.currentValue) {
        // console.log('map: got changed apps =', changes.applications);

        const deletedApps = _.differenceBy(changes.applications.previousValue as Array<Application>, changes.applications.currentValue as Array<Application>, '_id');
        const addedApps = _.differenceBy(changes.applications.currentValue as Array<Application>, changes.applications.previousValue as Array<Application>, '_id');
        // console.log('deleted =', deletedApps);
        // console.log('added =', addedApps);

        // (re)draw the matching apps
        this.drawMap(deletedApps, addedApps);
      }
    }
  }

  // when map becomes visible, draw all apps
  // TODO: or just emit current bounds and cause a reload?
  public onMapVisible() {
    // delete any old apps
    this.markerList.forEach(marker => {
      this.markerClusterGroup.removeLayer(marker);
    });
    this.markerList = []; // empty the list

    // draw all new apps
    this.drawMap([], this.applications);
  }

  public ngOnDestroy() {
    if (this.map) { this.map.remove(); }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Resets map view.
   */
  public resetView() {
    // console.log('resetting view');
    this.fitBounds(); // default bounds

    // FUTURE
    // // clear map state
    // this.urlService.save('lat', null);
    // this.urlService.save('lng', null);
    // this.urlService.save('zoom', null);
    // this.emitCoordinates();
  }

  /**
   * Emits an event to notify applications component of updated coordinates.
   * Debounced function executes when 250ms have elapsed since last call.
   */
  // tslint:disable-next-line:member-ordering
  private emitCoordinates = _.debounce(() => {
    this.updateCoordinates.emit(this.getCoordinates());
  }, 250);

  /**
   * Returns coordinates in GeoJSON format that specify map bounding box.
   */
  public getCoordinates(): string {
    let bounds: L.LatLngBounds;
    if (this.elementRef.nativeElement.offsetParent) {
      // actual bounds
      bounds = this.map.getBounds();
    } else {
      // map not ready yet - use default
      bounds = this.defaultBounds;
    }

    // OLD CODE WITH WORKAROUND FOR API $GEOWITHIN PROJECTION BEHAVIOUR
    const west = bounds.getWest();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const north = bounds.getNorth();

    // build coordinates using right hand rule (CCW)
    let coordinates = '';
    coordinates += this.latLngToCoord(bounds.getSouthWest()) + ','; // bottom left
    for (let x = Math.ceil(west); x < east; x++) {
      coordinates += this.latLngToCoord(L.latLng(south, x)) + ','; // along the bottom
    }
    coordinates += this.latLngToCoord(bounds.getSouthEast()) + ','; // bottom right
    coordinates += this.latLngToCoord(bounds.getNorthEast()) + ','; // topright
    for (let x = Math.floor(east); x > west; x--) {
      coordinates += this.latLngToCoord(L.latLng(north, x)) + ','; // along the top
    }
    coordinates += this.latLngToCoord(bounds.getNorthWest()) + ','; // topleft
    coordinates += this.latLngToCoord(bounds.getSouthWest()) + ','; // bottom left

    // remove last comma and convert to a GeoJSON coordinates string
    return `[[${coordinates.slice(0, -1)}]]`;

    // NEW CODE (USING API $BOX QUERY)
    // // return box parameters
    // return `[${this.latLngToCoord(bounds.getSouthWest())},${this.latLngToCoord(bounds.getNorthEast())}]`;
  }

  private latLngToCoord(ll: L.LatLng): string {
    return `[${ll.lng},${ll.lat}]`;
  }

  private fitBounds(bounds: L.LatLngBounds = null) {
    // console.log('fitting bounds');
    const fitBoundsOptions: L.FitBoundsOptions = {
      // disable animation to prevent known bug where zoom is sometimes incorrect
      // ref: https://github.com/Leaflet/Leaflet/issues/3249
      animate: false
    };

    if (bounds && bounds.isValid()) {
      this.map.fitBounds(bounds, fitBoundsOptions);
    } else {
      this.map.fitBounds(this.defaultBounds, fitBoundsOptions);
    }
  }

  /**
   * Removes deleted / draws added applications.
   */
  private drawMap(deletedApps: Application[], addedApps: Application[]) {
    // console.log('drawing map');

    // remove deleted apps from list and map
    deletedApps.forEach(app => {
      const markerIndex = _.findIndex(this.markerList, { dispositionId: app.tantalisID });
      if (markerIndex >= 0) {
        const markers = this.markerList.splice(markerIndex, 1);
        this.markerClusterGroup.removeLayer(markers[0]);
      }
    });

    // draw added apps
    addedApps.forEach(app => {
      // add marker
      if (app.centroid.length === 2) { // safety check
        const title = `${app.client || 'Applicant Name Not Available'}\n`
          + `${app.purpose || '-'} / ${app.subpurpose || '-'}\n`
          + `${app.location || 'Location Not Available'}\n`;
        const marker = L.marker(L.latLng(app.centroid[1], app.centroid[0]), { title: title })
          .setIcon(markerIcon)
          .on('click', L.Util.bind(this.onMarkerClick, this, app));
        marker.dispositionId = app.tantalisID;
        this.markerList.push(marker); // save to list
        this.markerClusterGroup.addLayer(marker); // save to marker clusters group
      }
    });

    // FUTURE
    // DOESN'T WORK QUITE RIGHT -- ALSO NEEDS TO BE CALLED WHEN MOVING/ZOOMING AROUND THE MAP
    // // get number visible on map
    // let count = 0;
    // const mapBounds = this.map.getBounds();
    // for (const marker of this.markerList) {
    //   const app = _.find(this.applications, { tantalisID: marker.dispositionId });
    //   if (app) {
    //     // app is visible if map contains its marker
    //     if (mapBounds.contains(marker.getLatLng())) {
    //       count++;
    //     }
    //   }
    // }
    // console.log('numberVisible =', count);
  }

  // called when user clicks on app marker
  private onMarkerClick(...args: any[]) {
    const app = args[0] as Application;
    const marker = args[1].target as L.Marker;

    // update selected item in app list
    // this.toggleCurrentApp.emit(app); // DO NOT TOGGLE LIST ITEM AT THIS TIME

    // if there's already a popup, delete it
    let popup = marker.getPopup();
    if (popup) {
      const wasOpen = popup.isOpen();
      popup.remove();
      marker.unbindPopup();
      if (wasOpen) { return; }
    }

    const popupOptions = {
      className: 'map-popup-content',
      autoPanPaddingTopLeft: L.point(40, 300),
      autoPanPaddingBottomRight: L.point(40, 20)
    };

    // compile marker popup component
    const compFactory = this.resolver.resolveComponentFactory(MarkerPopupComponent);
    const compRef = compFactory.create(this.injector);
    compRef.instance.id = app._id;
    this.appRef.attachView(compRef.hostView);
    compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));
    const div = document.createElement('div').appendChild(compRef.location.nativeElement);

    popup = L.popup(popupOptions)
      .setLatLng(marker.getLatLng())
      .setContent(div);

    // bind popup to marker so it automatically closes when marker is removed
    marker.bindPopup(popup).openPopup();
  }

  /**
   * Called when an app is selected or unselected.
   */
  public async onHighlightApplication(app: Application, show: boolean) {
    // reset icon on previous marker, if any
    if (this.currentMarker) {
      this.currentMarker.setIcon(markerIcon);
      this.currentMarker = null;
    }

    // set icon on new marker
    if (show && app) { // safety check
      // wait for apps to finish loading
      // ref: https://basarat.gitbooks.io/typescript/docs/async-await.html
      while (this.isLoading) { await this.delay(100); }

      const marker = _.find(this.markerList, { dispositionId: app.tantalisID });
      if (marker) {
        this.currentMarker = marker;
        marker.setIcon(markerIconLg);
        const visibleParent = this.markerClusterGroup.getVisibleParent(marker);
        // if marker is in a cluster, zoom into it
        if (marker !== visibleParent) {
          this.markerClusterGroup.zoomToShowLayer(marker);
        }
        // if not already open, show popup
        if (!marker.getPopup() || !marker.getPopup().isOpen()) {
          this.onMarkerClick(app, { target: marker });
        }
      }
    }
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
  }

}
