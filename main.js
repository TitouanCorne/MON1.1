import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import proj4 from 'proj4'; //pour convertir les coordonnées d'une projection à une autre
import {fromLonLat} from 'ol/proj';

// Initialise la projection EPSG:4326
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

// Coordonnées de l'Autralie en EPSG:4326 (longitude latitude)
const australieCoordonnees = [133, -27]; // [longitude, latitude]

const australieCoordonnees3857 = fromLonLat(australieCoordonnees);

const map = new Map({
  target: 'map',          //ID html du container où sera affichée la carte
  layers: [
    new TileLayer({       //Couche de tuiles
      source: new OSM()   //Open Street Map 
    })
  ],
  view: new View({
    center: australieCoordonnees3857,
    zoom: 4.5               //Ajustement pour voir l'Australie entièrement
  })
});
