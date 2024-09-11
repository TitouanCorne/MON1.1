import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import proj4 from 'proj4'; //pour convertir les coordonnées d'une projection à une autre
import {fromLonLat} from 'ol/proj';
import {Style, Fill, Stroke} from 'ol/style'; //pour définir le style des polygones

// Initialise la projection EPSG:4326 (pour longitude et latitude exprimées en °)
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

// Coordonnées de l'Autralie en EPSG:4326 (longitude latitude)
const australieCoordonnees = [133, -27]; // [longitude, latitude]

const australieCoordonnees3857 = fromLonLat(australieCoordonnees);

// Chemin vers les données GeoJson (les états de l'Australie)
const etatGeoJsonUrl = 'geoJSON-data/australian-states.geojson';

//Création d'une couche vectorielle pour représenter les polygones du fichier GeoJson
const vectorLayer = new VectorLayer({
  source : new VectorSource({
    url: etatGeoJsonUrl,
    format: new GeoJSON()
  }),
  style: function (feature) {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)' // Couleur de remplissage
      }),
      stroke: new Stroke({
        color: '#319FD3', // Couleur du contour
        width: 1 // Largeur du contour
      })
    });
  }
});

const map = new Map({
  target: 'map',          //ID html du container où sera affichée la carte
  layers: [
    new TileLayer({       //Couche de tuiles
      source: new OSM()   //Open Street Map 
    }),
    vectorLayer
  ],
  view: new View({
    center: australieCoordonnees3857,
    zoom: 4.5               //Ajustement pour voir l'Australie entièrement
  })
});
