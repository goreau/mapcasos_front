<template>
    <div ref="map-root" style="height: 60rem">
    </div>
</template>
  
<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Cluster, OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import {transform} from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {
  Fill,
  Text,
  Icon,
  Style,
} from 'ol/style.js';

import PointR from '../../assets/icons/red-blank.png'
import PointO from '../../assets/icons/orange-blank.png'
import PointG from '../../assets/icons/grn-blank.png'
import SizeA from '../../assets/cluster/m1.png'
import SizeB from '../../assets/cluster/m2.png'
import SizeC from '../../assets/cluster/m3.png'


// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'

export default {
    name: 'ClusterContainer',
    components: {},
    data(){
        return {
            map: null,
            coisa: 'coisa'
        }
    },
    props: { arrData: [] },
    methods: {
        loadMap(){
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    }),
                ],
                target: this.$refs['map-root'],
                view: new View({
                    center: fromLonLat([-48, -22]),
                    zoom: 7,
                    constrainResolution: true
                })
            });
            this.loadCluster();  
        },
        loadCluster(){
            const count = this.arrData.length;
            const features = new Array(count);
            
            for (let i = 0; i < count; ++i) {
                const coordinates = [this.arrData[i].longitude , this.arrData[i].latitude];
                features[i] = new Feature(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')));
                features[i].setProperties({'agravo':this.arrData[i].id_agravo, 'status':this.arrData[i].id_resultado})
            }

           /* const e = 4500000;
            for (let i = 0; i < count; ++i) {
                const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
                features[i] = new Feature(new Point(coordinates));
            }*/

            const source = new VectorSource({
                features: features,
            });

            const clusterSource = new Cluster({
                distance: 10,
                minDistance: 10,
                source: source,
            });
            const styleCache = {};
            const letra = ['', 'D', 'Z', 'K', 'C', 'V', 'T', 'E', 'B', 'A', 'M', 'X'];
            const clusters = new VectorLayer({
                source: clusterSource,
                style: function (feature) {
                    const size = feature.get('features').length;
                    var src = '';
                    let style = styleCache[size];
                    if (!style) {
                      /*  style = new Style({
                            image: new CircleStyle({
                            radius: 10,
                            stroke: new Stroke({
                                color: '#fff',
                            }),
                            fill: new Fill({
                                color: '#3399CC',
                            }),
                            }),
                            text: new Text({
                            text: size.toString(),
                            fill: new Fill({
                                color: '#fff',
                            }),
                            }),
                        });
                        styleCache[size] = style;*/
                        if (size == 1) {
                            var res = feature.get('features')[0].get('status');
                            var lt = letra[feature.get('features')[0].get('agravo')];

                            switch (res) {
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
                            style = new Style({
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
                        } else {
                            if (size < 20) {
                                src = SizeA;
                            } else if (size < 100) {
                                src = SizeB;
                            } else {
                                src = SizeC;
                            }
                            style = new Style({
                                image: new Icon({
                                    src: src
                                }),
                                text: new Text({
                                    text: size.toString(),
                                    fill: new Fill({
                                        color: '#fff'
                                    })
                                })
                            });
                        }
                        styleCache[size] = style;
                    }
                    return style;
                },
            });

            this.map.addLayer(clusters);
        }
    },
    mounted() {  
        this.loadMap();
    },
    watch: {
        arrData(value) {
            this.loadCluster();   
        },
        
    }
}
</script>