import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import proj4 from 'proj4'; //pour convertir les coordonnées d'une projection à une autre
import {fromLonLat} from 'ol/proj';
import {Style, Fill, Stroke, Circle as CircleStyle} from 'ol/style'; //pour définir le style des polygones et points

// Initialise la projection EPSG:4326 (pour longitude et latitude exprimées en °)
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");

// Coordonnées de l'Autralie en EPSG:4326 (longitude latitude)
const australieCoordonnees = [133, -27]; // [longitude, latitude]

const australieCoordonnees3857 = fromLonLat(australieCoordonnees);

// Chemin vers les données GeoJson
const etatGeoJsonUrl = 'geoJSON-data/australian-states.geojson';
const villesGeoJsonUrl = 'geoJSON-data/australian-cities.geojson';

//Création d'une couche vectorielle pour représenter les états sous forme de polygones
const stateVectorLayer = new VectorLayer({
  source : new VectorSource({
    url: etatGeoJsonUrl,
    format: new GeoJSON()
  }),
  style: function (feature) {
    const visited = feature.get("VISITED");
    let stateColor;
    if(visited){ //couleur de remplissage = vert si je suis déjà allé dans cet état
      stateColor = 'rgba(0, 255, 0, 0.6)';
    }
    else{ // couleur de remplissage = orange si je ne suis jamais allé dans cet état
      stateColor = 'rgba(255, 165, 0, 0.6)';
    }
    return new Style({
      fill: new Fill({
        color: stateColor  // Couleur de remplissage
      }),
      stroke: new Stroke({
        color: '#000000', // Couleur du contour
        width: 1 // Largeur du contour
      })
    })
  }
});

//Création d'une couche vectorielle pour représenter les villes sous forme de points
const cityVectorLayer = new VectorLayer({
  source : new VectorSource({
    url: villesGeoJsonUrl,
    format: new GeoJSON()
  }),
  style: function (feature) {
    return new Style({
      image: new CircleStyle({
        radius: 6, // Taille du cercle
        fill: new Fill({
          color: '#ff0000' // Couleur rouge pour les villes
        }),
        stroke: new Stroke({
          color: '#ffffff', // Contour blanc pour les rendre plus visibles
          width: 2
        })
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
    stateVectorLayer,
    cityVectorLayer
  ],
  view: new View({
    center: australieCoordonnees3857,
    zoom: 4.5               //Ajustement pour voir l'Australie entièrement
  })
});

// Ajout d'une div pour afficher les informations du polygone survolé
const infoDiv = document.getElementById('info');

// Écouteur pour pointermove pour détecter les survols de polygones
map.on('pointermove', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    // Récupérer les propriétés du polygone
    const properties = feature.getProperties();
    infoDiv.innerHTML = `Etat: ${properties.STATE_NAME}`;
    infoDiv.style.display= 'block';
  }else {
    // Ne rien afficher lorsque la souris ne survole rien
    infoDiv.style.display= 'none';
  }
});