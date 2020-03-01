// -*- mode: javascript; indent-tabs-mode: nil; c-basic-offset: 8 -*-
"use strict";

// Base layers configuration
//			"url" : "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//			"url" : "http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
//			"url" : "http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
//			"url" : "https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
//			"url" : "https://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}"
//			"url" : "https://{a-c}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
//			"url" : "http://{a-c}.tilessputnik.ru/tiles/kmt2/{z}/{x}/{y}.png"
//			"url" : "https://{a-c}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
//			"url" : "https://{a-c}.tile.openstreetmap.se/osm/{z}/{x}/{y}.png"

function createBaseLayers() {
    var layers = new ol.Collection();
    var layers_group = new ol.layer.Group({
        layers: layers,
    });

    var world = new ol.Collection();
    var us = new ol.Collection();
    var uk = new ol.Collection();
    var custom = new ol.Collection();

    if (localStorage['customTiles'] != undefined) {
        custom.push(new ol.layer.Tile({
            source: new ol.source.OSM({
                "url" : localStorage['customTiles'],
            }),
            name: 'custom_tiles',
            title: 'Custom tiles',
            type: 'base',
        }));
    }
    /*
    world.push(new ol.layer.Tile({
        source: new ol.source.OSM({
            "url" : "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
        }),
        name: 'wikimedia',
        title: 'OpenStreetMap Wikimedia',
        type: 'base',
    }));
    */

    world.push(new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: 'osm',
        title: 'OpenStreetMap',
        type: 'base',
    }));

    world.push(new ol.layer.Tile({
        source: new ol.source.XYZ({
            "url" : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            "attributions" : "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }),
        name: 'esri',
        title: 'ESRI Sat.',
        type: 'base',
    }));

    /*
    world.push(new ol.layer.Tile({
        source: new ol.source.OSM({
            "url" : "http://{a-d}.tile.stamen.com/terrain/{z}/{x}/{y}.png", 
            "attributions" : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' 
            + 'Data by <a _href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        }),
        name: 'terrain_roads',
        title: 'Terrain + Roads',
        type: 'base',
    }));

    world.push(new ol.layer.Tile({
        source: new ol.source.OSM({
            "url" : "http://{a-d}.tile.stamen.com/terrain-background/{z}/{x}/{y}.png", 
            "attributions" : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ' 
            + 'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        }),
        name: 'terrain',
        title: 'Terrain',
        type: 'base',
    }));
    */

    world.push(new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/' +
            'MODIS_Terra_CorrectedReflectance_TrueColor/default/2019-07-22/' +
            'GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
        }),
        name: 'GIBS',
        title: 'GIBS',
        type: 'base',
    }));
    // carto.com basemaps, see the following URLs for details on them:
    // http://basemaps.cartocdn.com
    // https://github.com/CartoDB/cartodb/wiki/BaseMaps-available

    var basemaps = [ "dark_all", "dark_nolabels",
        "light_all", "light_nolabels"
    ]

    for (var i in basemaps) {
        var basemap_id = basemaps[i];

        world.push(new ol.layer.Tile({
            source: new ol.source.OSM({
                "url" : "https://{a-z}.basemaps.cartocdn.com/"+ basemap_id + "/{z}/{x}/{y}.png",
                "attributions" : 'Courtesy of <a href="https://carto.com">CARTO.com</a>'
                + ' using data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
            }),
            name: "carto_" + basemap_id,
            title: 'carto.com ' +basemap_id,
            type: 'base',
        }));
    }

    if (BingMapsAPIKey) {
        world.push(new ol.layer.Tile({
            source: new ol.source.BingMaps({
                key: BingMapsAPIKey,
                imagerySet: 'Aerial'
            }),
            name: 'bing_aerial',
            title: 'Bing Aerial',
            type: 'base',
        }));
        world.push(new ol.layer.Tile({
            source: new ol.source.BingMaps({
                key: BingMapsAPIKey,
                imagerySet: 'Road'
            }),
            name: 'bing_roads',
            title: 'Bing Roads',
            type: 'base',
        }));
    }

    if (ChartBundleLayers) {

        var chartbundleTypes = {
            sec: "Sectional Charts",
            tac: "Terminal Area Charts",
            hel: "Helicopter Charts",
            enrl: "IFR Enroute Low Charts",
            enra: "IFR Area Charts",
            enrh: "IFR Enroute High Charts"
        };

        for (var type in chartbundleTypes) {
            us.push(new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://wms.chartbundle.com/wms',
                    params: {LAYERS: type},
                    projection: 'EPSG:3857',
                    attributions: 'Tiles courtesy of <a href="http://www.chartbundle.com/">ChartBundle</a>'
                }),
                name: 'chartbundle_' + type,
                title: chartbundleTypes[type],
                type: 'base',
                group: 'chartbundle'}));
        }
    }

    world.push(new ol.layer.Tile({
        source: new ol.source.OSM({
            "url" : "https://map.adsbexchange.com/mapproxy/tiles/1.0.0/osm/osm_grid/{z}/{x}/{y}.png",
            "attributions" : 'Courtesy of ADS-B Exchange <a href="https://adsbexchange.com/">adsbexchange.com</a>'
            + ' using data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        }),
        name: 'osm_adsbx',
        title: 'OSM by ADSBx',
        type: 'base',
    }));

    var nexrad = new ol.layer.Tile({
        name: 'nexrad',
        title: 'NEXRAD',
        type: 'overlay',
        opacity: 0.3,
        visible: false
    });

    var refreshNexrad = function() {
        // re-build the source to force a refresh of the nexrad tiles
        var now = new Date().getTime();
        nexrad.setSource(new ol.source.XYZ({
            url : 'http://mesonet{1-3}.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_=' + now,
            attributions: 'NEXRAD courtesy of <a href="http://mesonet.agron.iastate.edu/">IEM</a>'
        }));
    };

    refreshNexrad();
    window.setInterval(refreshNexrad, 4 * 60000);

    var dwd;
    if (enableDWD) {
        dwd = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'https://maps.dwd.de/geoserver/wms',
                params: {LAYERS: 'dwd:RX-Produkt', validtime: (new Date()).getTime()},
                projection: 'EPSG:3857',
                attributions: 'Deutscher Wetterdienst (DWD)'
            }),
            name: 'radolan',
            title: 'DWD RADOLAN',
            type: 'overlay',
            opacity: 0.3,
            visible: false
        });


        var refreshDwd = function () {
            dwd.getSource().updateParams({"validtime": (new Date()).getTime()});
        };
        refreshDwd();
        window.setInterval(refreshDwd, 4 * 60000);
    }

    var createGeoJsonLayer = function (title, name, url, fill, stroke) {
        return new ol.layer.Vector({
            type: 'overlay',
            title: title,
            name: name,
            source: new ol.source.Vector({
              url: url,
              format: new ol.format.GeoJSON({
                defaultDataProjection :'EPSG:4326', 
                    projection: 'EPSG:3857'
              })
            }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                      color : fill
                }),
                stroke: new ol.style.Stroke({
                        color: stroke,
                        width: 1
                }),
            })
        });
    }

    // Taken from https://github.com/alkissack/Dump1090-OpenLayers3-html
    uk.push(createGeoJsonLayer('Radar Corridors', 'ukradarcorridors', 'layers/UK_Mil_RC.geojson', 'rgba(22, 171, 22, 0.3)', 'rgba(22, 171, 22, 1)'));
    uk.push(createGeoJsonLayer('A2A Refuleing', 'uka2arefueling', 'layers/UK_Mil_AAR_Zones.geojson', 'rgba(52, 50, 168, 0.3)', 'rgba(52, 50, 168, 1)'));

    if (custom.getLength() > 0) {
        layers.push(new ol.layer.Group({
            name: 'custom',
            title: 'Custom',
            layers: new ol.Collection(custom.getArray().reverse())
        }));
    }

    if (us.getLength() > 0) {
        layers.push(new ol.layer.Group({
            name: 'us',
            title: 'US',
            layers: new ol.Collection(us.getArray().reverse())
        }));
    }

    if (world.getLength() > 0) {
        layers.push(new ol.layer.Group({
            name: 'world',
            title: 'Worldwide',
            layers: new ol.Collection(world.getArray().reverse())
        }));
    }

    if (uk.getLength() > 0) {
        layers.push(new ol.layer.Group({
            name: 'uk',
            title: 'UK',
            layers: new ol.Collection(uk.getArray())
        }));
    }

    layers.push(new ol.layer.Tile({
        source: new ol.source.XYZ({
            "url" : "https://map.adsbexchange.com/mapproxy/tiles/1.0.0/openaip/ul_grid/{z}/{x}/{y}.png",
            "attributions" : "openAIP.net",
        }),
        name: 'openaip',
        title: 'openAIP TMS',
        type: 'overlay',
        opacity: 0.7,
        visible: false,
    }));


    if (enableDWD) {
        layers.push(dwd);
    }

    layers.push(nexrad);

    return layers_group;
}
