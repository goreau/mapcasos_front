<template>
    <div ref="map-root" style="height: 60rem">
        <div id="info"></div>
    </div>
    
</template>
  
<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Group, Layer, Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Source, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import Feature from 'ol/Feature.js';
import Circle from 'ol/geom/Circle.js';
import {
  Fill,
  Text,
  Icon,
  Style,
  Stroke,
} from 'ol/style.js';
import {createEmpty, extend} from 'ol/extent';

import PointR from '../../assets/icons/red-blank.png'
import PointO from '../../assets/icons/orange-blank.png'
import PointG from '../../assets/icons/grn-blank.png'


export default {
    name: 'MapContainer',
    components: {},
    data(){
        return {
            map: null,
            layerGroup: {}
        }
    },
    props: { feats: [], rem: '', revis: '' },
    methods: {
        loadLayer() {
            if (this.feats.length == 0){
                return false;
            }

            const letra = ['', 'D', 'Z', 'K', 'C', 'V', 'T', 'E', 'B', 'A', 'M', 'X'];
            var styleCache = {};

            var geojsonObject = {
                // if the next line is commented out you get: Unsupported GeoJSON type: undefined
                type: "FeatureCollection",
                features: this.feats
            };

            var features = new GeoJSON().readFeatures(geojsonObject, {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857"
            });

            var vectorSource = new VectorSource({
                features
            });
            var myName = this.feats[0].properties.semana;

            var vectorLayer = new VectorLayer({
                source: vectorSource,
                name: myName, 
                tipo: 'casos',
                style: function (feature) {
                    var src = '';
                    var teste = feature.getProperties();
                    var style = styleCache[0];
                    if (!style) {
                            var lt = letra[teste.agravo];

                            switch (teste.status) {
                                case 1:
                                    src = PointR;
                                    break;
                                case 2:
                                    src = PointO;
                                    break;
                                default :
                                    src = PointG;
                                    break;
                            }
                            var style = new Style({
                                image: new Icon({
                                    src: src,
                                    scale: 0.5
                                }),
                                text: new Text({
                                    text: lt,
                                    offsetY: -5,
                                    font: 'bold 10px arial',
                                    fill: new Fill({
                                        color: '#000000'
                                    })
                                })
                            });
                            styleCache[teste.status] = style;
                    }
                    return style;
                },
            });

            this.map.addLayer(vectorLayer);
           // this.layerGroup.layers.push(vectorLayer);
            this.layerGroup.getLayers().push(vectorLayer);

            var source = vectorLayer.getSource();
       
            //this.map.getView().fit(source.getExtent());
            var extent = createEmpty();
            this.layerGroup.getLayers().forEach(function(layer) {
                extend(extent, layer.getSource().getExtent());
            });
            //this.map.getView().fitExtent(extent, this.map.getSize());
            this.map.getView().fit(extent);
        },
        loadMap(){
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    }),
                   // this.layerGroup
                ],
                target: this.$refs['map-root'],
                view: new View({
                    center: fromLonLat([-48, -22]),
                    zoom: 7,
                    constrainResolution: true
                })
            });
            const info = document.getElementById('info');
            let currentFeature;
            this.map.on('pointermove', (evt) => {
               // this.displayFeatureInfo(evt.pixel);
                const clicked = this.map.forEachFeatureAtPixel(
                    evt.pixel,
                    (feature) => feature
                )
                if (clicked){
                    info.style.left = (evt.pixel[0] + 120) + 'px';
                    info.style.top = evt.pixel[1] + 'px';
                    if (clicked !== currentFeature) {
                        info.style.visibility = 'visible';
                        var details = "SINAN: " + clicked.get('sinan') + '\r\n'+
                        "NOME: " + clicked.get('nome');
                        info.innerText = details;
                    }
                } else {
                    info.style.visibility = 'hidden';
                }   
                currentFeature = clicked;            
            });

        },
        raiar() {
            //usando as preferencias
            var obj = JSON.parse(localStorage.getItem('prefs'));
            var style = new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 1
                }),
                fill: new Fill({
                    color: obj.raioC + '1A'
                })
            });


            var vectorSource = new VectorSource();
            var circleLayer = new VectorLayer({
                source: vectorSource,
                name: 'raio',
                style: style
            });

            var layer;

            this.map.getLayers().forEach(function (lyr) {
                if (lyr.get('tipo') == 'casos') {
                    if (lyr.getVisible()) {
                        layer = lyr;
                        var source = layer.getSource();//.getFeatures();
                        if (source.getState() === 'ready') {
                            var features = source.getFeatures();
                            features.forEach((feature) => {
                                var p = feature.getGeometry().getCoordinates();
                                vectorSource.addFeature(new Feature(new Circle(p, obj.raioD)));
                            });
                        }
                    }
                } else if ('raio' == lyr.get('name')) {
                    this.map.removeLayer(lyr);
                }
            });

            circleLayer.setZIndex(1);
            this.map.addLayer(circleLayer);
        }
    },
    mounted() {
        this.loadMap(); 
        this.layerGroup = new Group({
            title: 'grpCasos',
            layers: []
        });       
    },
    watch: {
        feats(value) {
            this.loadLayer();
        },
        rem(value){
            if (value == '') return;
            this.map.getLayers().forEach(element => {
                if (element.get('name') === value){
                    element.setVisible(false);
                }
            });
        },
        revis(value){
            if (value == '') return;
            this.map.getLayers().forEach(element => {
                if (element.get('name') === value){
                    element.setVisible(true);
                }
            });
        }
    }
}
</script>
<style scoped>
#info {
        position: absolute;
        display: inline-block;
        height: auto;
        width: auto;
        z-index: 100;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        padding: 5px;
        left: 50%;
        transform: translateX(3%);
        visibility: hidden;
        pointer-events: none;
      }
</style>