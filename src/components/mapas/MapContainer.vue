<template>
    <div ref="map-root" style="height: 60rem">
        <div id="info"></div>
        <div id="legenda" v-show="hasLegenda"><Legenda :title="lTitle"/></div>
    </div>
    <salva-pol-dialog ref="salvaPolDialog"></salva-pol-dialog>
    <load-pol-dialog ref="loadPolDialog"></load-pol-dialog>
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
import Draw from 'ol/interaction/Draw.js';

import { jsPDF } from "jspdf";

import PointR from '../../assets/icons/red-blank.png';
import PointO from '../../assets/icons/orange-blank.png';
import PointG from '../../assets/icons/grn-blank.png';
import SalvaPolDialog from '../forms/SalvaPolDialog.vue';
import LoadPolDialog from '../forms/LoadPolDialog.vue';
import Legenda from '@/components/mapas/LegendaView.vue';

import Control from 'ol/control/Control.js';

export default {
    name: 'MapContainer',
    components: {
        SalvaPolDialog,
        LoadPolDialog,
        Legenda,
    },
    data(){   
        return {
            map: null,
            layerGroup: {},
            onPoligon: 0,
        }
    },
    props: { feats: [], rem: '', revis: '', hasLegenda: true, lTitle: '' },
    emits:['onPoligon'],
    methods: {
        exportMap(){
            document.body.style.cursor = 'progress';

            const format = 'a4';
            const resolution = '72';
            const dim = [297,210];
            const width = Math.round((dim[0] * resolution) / 25.4);
            const height = Math.round((dim[1] * resolution) / 25.4);
            const size = this.map.getSize();
            const viewResolution = this.map.getView().getResolution();

            this.map.once('rendercomplete', (event) => event_handler(event, this.map)); 

            const event_handler = (event, arg) => {

           // this.map.once('rendercomplete', function () {
                const mapCanvas = document.createElement('canvas');
                mapCanvas.width = width;
                mapCanvas.height = height;
                const mapContext = mapCanvas.getContext('2d');
                Array.prototype.forEach.call(
                    document.querySelectorAll('.ol-layer canvas'),
                    function (canvas) {
                        if (canvas.width > 0) {
                            const opacity = canvas.parentNode.style.opacity;
                            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                            const transform = canvas.style.transform;
                            // Get the transform parameters from the style's transform matrix
                            const matrix = transform
                                .match(/^matrix\(([^\(]*)\)$/)[1]
                                .split(',')
                                .map(Number);
                                // Apply the transform to the export map context
                                CanvasRenderingContext2D.prototype.setTransform.apply(
                                    mapContext,
                                    matrix
                                );
                                mapContext.drawImage(canvas, 0, 0);
                        }
                    }
                );
                mapContext.globalAlpha = 1;
                mapContext.setTransform(1, 0, 0, 1, 0, 0);
                const pdf = new jsPDF('landscape', undefined, format);
                pdf.addImage(
                    mapCanvas.toDataURL('image/jpeg'),
                    'JPEG',
                    0,
                    0,
                    dim[0],
                    dim[1]
                );
                pdf.save('mapcasos.pdf');
                // Reset original map size
                arg.setSize(size);
                arg.getView().setResolution(viewResolution);
               // exportButton.disabled = false;
                document.body.style.cursor = 'auto';
            };//);

            // Set print size
            const printSize = [width, height];
            this.map.setSize(printSize);
            const scaling = Math.min(width / size[0], height / size[1]);
            this.map.getView().setResolution(viewResolution / scaling);
        },
        limpaMap(){
            var layersToRemove = [];
            this.map.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined && layer.get('name') !== 'base') {
                    layersToRemove.push(layer);
                }
            });

            var len = layersToRemove.length;
            for (var i = 0; i < len; i++) {
                this.map.removeLayer(layersToRemove[i]);
            }

            this.map.getView().setZoom(7);
            this.map.getView().setCenter(fromLonLat([-48, -22]));
        },
        limpaPol(){
            var layersToRemove = [];
            this.map.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined && layer.get('name') === 'poligono') {
                    layersToRemove.push(layer);
                }
            });

            var len = layersToRemove.length;
            for (var i = 0; i < len; i++) {
                this.map.removeLayer(layersToRemove[i]);
            }
        },
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
            vectorLayer.setZIndex(10);
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
            //this.$refs['map-root'].innerText="<div id=\"info\"></div>";
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM(),
                        name: 'base'
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
                    var tipo = clicked.getGeometry().getType();
                    if (tipo == 'Point'){
                        info.style.left = (evt.pixel[0] + 120) + 'px';
                        info.style.top = evt.pixel[1] + 'px';
                        if (clicked !== currentFeature) {
                            info.style.visibility = 'visible';
                            var details = "SINAN: " + clicked.get('sinan') + '\r\n'+
                            "NOME: " + clicked.get('nome');
                            info.innerText = details;
                        }
                    }
                } else {
                    info.style.visibility = 'hidden';
                }   
                currentFeature = clicked;            
            });

          /*  var customControl = new Control({
                element: document.createElement('div'),
                className: 'custom-control',
                content: 'Meu Controle'
            });*/
            var customControl = new Control({element: document.getElementById("legenda")});

            // Adicione o controle ao mapa
            this.map.addControl(customControl);
        },
        async loadPoligono(){
            const file = await this.$refs.loadPolDialog.show({
                  okButton: 'Confirmar',
                });
                if (file != ''){
                  return this.carregaPoligon(file);
                };
        },
        async carregaPoligon(file){
            var tmppath = URL.createObjectURL(file);

            const response = await fetch(tmppath);
            const data = await response.json();

            var source = new VectorSource({
                features: new GeoJSON().readFeatures(data)
            });
            var vector = new VectorLayer({
                source: source,
                name: 'poligono'   
            });
            vector.setZIndex(5);
            this.map.addLayer(vector);
            
        },
        async doSavePoligono(){
            const nome = await this.$refs.salvaPolDialog.show({
                  okButton: 'Confirmar',
                });
                if (nome != ''){
                  return this.savePoligon(nome);
                };
        },

        doPoligono() {
            var obj = JSON.parse(localStorage.getItem('prefs'));
            var source = new VectorSource({wrapX: false});
            this.onPoligon = 1;

            var vector = new VectorLayer({
                source: source,
                name: 'poligono'
            });
            vector.setZIndex(5);
            this.map.addLayer(vector);

            var draw = new Draw({
                source: source,
                type: 'Polygon'
            });

            draw.on('drawstart', function (event) {
                var s = new Style({
                    fill: new Fill({
                        color: obj.poligC + '30'
                    })
                });

                event.feature.setStyle(s);

            });
       
            const event_handler = (event, arg) => {
                var parent = draw.getMap();
                parent.removeInteraction(draw);
                arg();
            }
            draw.addEventListener('drawend', (event) => event_handler(event, this.doSavePoligono));       

           /* draw.on('drawend', function (event) {
                var parent = draw.getMap();
                parent.removeInteraction(draw);
                this.onPoligon = 9;
            });*/
            this.map.addInteraction(draw);
        },
        savePoligon(nome) {
            try{
                var layer;
                this.map.getLayers().forEach(function (lyr) {
                    if ('poligono' == lyr.get('name')) {
                        layer = lyr;
                    }
                });


                var features = layer.getSource().getFeatures();
                var newForm = new GeoJSON();
                var featColl = newForm.writeFeaturesObject(features);

                var txtArray = [];
                txtArray.push(JSON.stringify(featColl));

                var blob = new Blob(txtArray, {type: 'text/json;charset=utf8'});

                const e = document.createEvent('MouseEvents'),
                a = document.createElement('a');
                a.download = nome + ".json";
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);  
                return true;
            } catch (e){
                return false;
            }
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
        },
        checkPrefs(){
            var obj = JSON.parse(localStorage.getItem('prefs'));
            if (obj == null){
                var prefs = {
                    raioD: 200,
                    raioC: '#332245',
                    poligC: '#7398C0'
                }
                localStorage.setItem('prefs', JSON.stringify(prefs));
            }
        }
    },
    mounted() {
        this.loadMap(); 
        this.checkPrefs();
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
        },
        onPoligon(value){
            this.$emit('onPoligon', value);
        }
    }
}
</script>
<style scoped>
#legenda{
    padding-right: 1rem;
}
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