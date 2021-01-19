'use strict';

/* __V3D_TEMPLATE__ - template-based file; delete this line to prevent this file from being updated */

window.addEventListener('load', function() {

var CONTAINER_ID = 'v3d-container';

(function() {

    var params = v3d.AppUtils.getPageParams();

    var PUZZLES_DIR = '/puzzles/';
    var logicURL = params.logic ? params.logic : '__LOGIC__visual_logic.js'.replace('__LOGIC__', '');
    var sceneURL = params.load ? params.load : '__URL__ph_lab.gltf'.replace('__URL__', '');
    if (!sceneURL) {
        console.log('No scene URL specified');
        return;
    }

    // some puzzles can benefit from cache
    v3d.Cache.enabled = true;

    if (v3d.AppUtils.isXML(logicURL)) {
        var logicURLJS = logicURL.match(/(.*)\.xml$/)[1] + '.js';
        new v3d.PuzzlesLoader().loadEditorWithLogic(PUZZLES_DIR, logicURLJS,
            function() {
                var initOptions = v3d.PL ? v3d.PL.execInitPuzzles({
                        container: CONTAINER_ID }).initOptions
                        : { useFullscreen: true };
                var appInstance = loadScene(sceneURL, initOptions);
                v3d.PE.viewportUseAppInstance(appInstance);
            }
        );
    } else if (v3d.AppUtils.isJS(logicURL)) {
        new v3d.PuzzlesLoader().loadLogic(logicURL, function() {
            var initOptions = v3d.PL ? v3d.PL.execInitPuzzles({
                    container: CONTAINER_ID }).initOptions
                    : { useFullscreen: true };
            loadScene(sceneURL, initOptions);
        });
    } else {
        loadScene(sceneURL, { useFullscreen: true });
    }
})();

function loadScene(sceneURL, initOptions) {

    initOptions = initOptions || {};

    var ctxSettings = {};
    if (initOptions.useBkgTransp) ctxSettings.alpha = true;
    if (initOptions.preserveDrawBuf) ctxSettings.preserveDrawingBuffer = true;

    var preloader = initOptions.useCustomPreloader
            ? createCustomPreloader(initOptions.preloaderProgressCb,
            initOptions.preloaderEndCb)
            : new v3d.SimplePreloader({ container: CONTAINER_ID });

    if (v3d.PE) {
        puzzlesEditorPreparePreloader(preloader);
    }

    var app = new v3d.App(CONTAINER_ID, ctxSettings, preloader);
    if (initOptions.useBkgTransp) {
        app.clearBkgOnLoad = true;
        app.renderer.setClearColor(0x000000, 0);
    }

    // namespace for communicating with code generated by Puzzles
    app.ExternalInterface = {};
    prepareExternalInterface(app);

    if (initOptions.preloaderStartCb) initOptions.preloaderStartCb();
    if (initOptions.useFullscreen) {
        initFullScreen();
    } else {
        var fsButton = document.getElementById('fullscreen_button');
        if (fsButton) fsButton.style.display = 'none';
    }

    sceneURL = initOptions.useCompAssets ? sceneURL + '.xz' : sceneURL;
    app.loadScene(sceneURL, function() {
        app.enableControls();
        app.run();

        if (v3d.PE) v3d.PE.updateAppInstance(app);
        if (v3d.PL) v3d.PL.init(app, initOptions);

        runCode(app);
    }, null, function() {
        console.log('Can\'t load the scene ' + sceneURL);
    });

    return app;
}

function createCustomPreloader(updateCb, finishCb) {
    function CustomPreloader() {
        v3d.Preloader.call(this);
    }

    CustomPreloader.prototype = Object.assign(Object.create(v3d.Preloader.prototype), {
        onUpdate: function(percentage) {
            v3d.Preloader.prototype.onUpdate.call(this, percentage);
            if (updateCb) updateCb(percentage);
        },
        onFinish: function() {
            v3d.Preloader.prototype.onFinish.call(this);
            if (finishCb) finishCb();
        }
    });

    return new CustomPreloader();
}

/**
 * Modify the app's preloader to track the loading process in the Puzzles Editor.
 */
function puzzlesEditorPreparePreloader(preloader) {
    // backward compatibility for loading new projects within the old Puzzles Editor
    if (v3d.PE.loadingUpdateCb !== undefined && v3d.PE.loadingFinishCb !== undefined) {
        var _onUpdate = preloader.onUpdate.bind(preloader);
        preloader.onUpdate = function(percentage) {
            _onUpdate(percentage);
            v3d.PE.loadingUpdateCb(percentage);
        }

        var _onFinish = preloader.onFinish.bind(preloader);
        preloader.onFinish = function() {
            _onFinish();
            v3d.PE.loadingFinishCb();
        }
    }
}

function initFullScreen() {

    var fsButton = document.getElementById('fullscreen_button');
    if (!fsButton) return;

    var container = document.getElementById(CONTAINER_ID);

    if (document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled)
        fsButton.style.display = 'inline';

    fsButton.addEventListener('click', function(event) {
        event.stopPropagation();
        if (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
            exitFullscreen();
        } else
            requestFullscreen(container);
    });

    function changeFullscreen() {
        if (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
            fsButton.classList.remove('fullscreen-open');
            fsButton.classList.add('fullscreen-close');
        } else {
            fsButton.classList.remove('fullscreen-close');
            fsButton.classList.add('fullscreen-open');
        }
    }

    document.addEventListener('webkitfullscreenchange', changeFullscreen);
    document.addEventListener('mozfullscreenchange', changeFullscreen);
    document.addEventListener('msfullscreenchange', changeFullscreen);
    document.addEventListener('fullscreenchange', changeFullscreen);

    function requestFullscreen(elem) {
        if (elem.requestFullscreen)
            elem.requestFullscreen();
        else if (elem.mozRequestFullScreen)
            elem.mozRequestFullScreen();
        else if (elem.webkitRequestFullscreen)
            elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen)
            elem.msRequestFullscreen();
    }

    function exitFullscreen() {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
    }
}

function prepareExternalInterface(app) {
    // register functions in the app.ExternalInterface to call them from Puzzles, e.g:
    // app.ExternalInterface.myJSFunction = function() {
    //     console.log('Hello, World!');
    // }

}

function runCode(app) {
    // add your code here, e.g. console.log('Hello, World!');

}

});

const delay = ms => new Promise(res => setTimeout(res, ms));
const round = f => parseFloat(f.toFixed(2));

class Main {
  constructor() {
    this.ph = round(Math.random() / 2 + 6.5);
    this.x = [0]
    this.y = [this.ph]
    this.dy = [0, .03, .04, .05, .04, .06, .07, .1, .1, .7, 1.5, .7, .15, .1, .06, .06, .04, .05, .03, .02, .03];
    console.log(this.dy.length);
    this.time = 0
    this.timesteps = 20;

    // Graph
    this.plot = document.getElementById('plot');
    var config = {responsive: true, yaxis: {range: [0, 8]}, xaxis: {range: [0, 2000]}};
    Plotly.newPlot(this.plot, [{
    x: this.x,
    y: this.y}], {
    margin: { t: 0 } }, config );

    // Table
    this.table = document.getElementById('table');
    this.table_values = [ ['<b>pH</b>'], [this.y[this.time]] ];
    this.header_values = [["<b>μl HCl</b>"]];
    for (var i = 0; i < 21; i++) {
      this.header_values.push(["<b>".concat(i.toString(), "</b>")]);
    }
    // var data = [{
    //   type: 'table',
    //   header: {
    //     values: this.header_values,
    //     align: "center",
    //     line: {width: 1, color: 'black'},
    //     fill: {color: "rgb(52, 83, 117)"},
    //     font: {family: "Arial", size: 14, color: "white"}
    //   },
    //   cells: {
    //     values: this.table_values,
    //     align: "center",
    //     line: {color: "black", width: 1},
    //     font: {family: "Arial", size: 14, color: ["black"]}
    //   }
    // }]
    //Plotly.newPlot(table, data);
  }

  step() {
    this.time++;
    console.log(((Math.random()-.5) / 10));
    this.ph -= this.dy[this.time] * (1 + ((Math.random()-.5) / 2));
    this.ph = round(this.ph);
    this.y.push(this.ph);
    this.x.push(this.time * 100);

    this.table_values.push([this.ph]);

    // this.ph -= (Math.random() * .4);
    // this.ph = round(this.ph)
    // this.y.push(this.ph)
    // this.table_values.push([this.ph]);
    //
    // this.time++;
    // this.x.push(this.time * 100);
  }

  update() {
    let data = {x: [this.x], y: [this.y]};
    var config = {responsive: true, yaxis: {range: [0, 8]}, xaxis: {range: [0, 2000]}};
    Plotly.update(this.plot, data, config);

    // var tdata = [{
    //   type: 'table',
    //   header: {
    //     values: this.header_values,
    //     align: "center",
    //     line: {width: 1, color: 'black'},
    //     fill: {color: "rgb(52, 83, 117)"},
    //     font: {family: "Arial", size: 14, color: "white"}
    //   },
    //   cells: {
    //     values: this.table_values,
    //     align: "center",
    //     line: {color: "black", width: 1},
    //     font: {family: "Arial", size: 14, color: ["black"]}
    //   }
    // }]
    // Plotly.newPlot(this.table, tdata, {displayModeBar: false});
  }

  async run() {
    for (var i = 0; i < 20; i++) {
      await delay(3);
      this.step();
      this.update();
    }
  }

}

simulation = new Main();
simulation.run();
