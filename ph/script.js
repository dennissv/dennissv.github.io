const delay = ms => new Promise(res => setTimeout(res, ms));
var bufferCapacity = 0;
var speed = 0;
var ph_log = [];
var ans_v_ph3 = 0;

class Main {
  constructor() {
    this.x = [0];
    this.y = [ph];
    this.dy = [0, .03, .04, .05, .04, .06, .07, .1, .1, .7, 1.5, .7, .15, .1, .06, .06, .04, .05, .03, .02, .03];
    this.time = 0;
    this.act = 0;
    this.timesteps = 20;
    this.bufferCapacity = Number.parseInt(round(Math.random()*5 + 5, 0));
    this.speed = Number.parseInt(round(2 + Math.random()*2, 0));
    bufferCapacity = this.bufferCapacity;

    // Graph
    this.plot = document.getElementById('plot');
    this.layout = {responsive: true, margin: {t: 30, b: 80, l: 80, r: 30},
      yaxis: {fixedrange: true, range: [1, 8], title: {text: 'pH', font: {size: 20}}, dtick: 0.5},
      xaxis: {fixedrange: true, range: [0, 2000], title: {text: 'Volym tillsatt HCl (μl)', font: {size: 20}}, dtick: 100},
      };
    this.config = {displayModeBar: false}
    this.data = [{name: 'pH', color: 'rgb(42, 71, 101)', line: {shape: 'spline'}, type: 'line', x: this.x, y: this.y, mode: 'lines+markers'},
      {type: 'line', name: 'Ekvivalenspunkt', hoverinfo: 'skip', x: [-100, -100], y: [0, 9]},
      {type: 'line', name: 'Halvtitrerpunkt', hoverinfo: 'skip', x: [-100, -100], y: [0, 9]},
      {type: 'line', name: 'pKa', hoverinfo: 'skip', x: [-100, -100], y: [0, 9]}];
    Plotly.newPlot(this.plot, this.data, this.layout, this.config);

    // Table
    this.table = document.getElementById('table');
    this.header_values = [["<b>μl HCl</b>"], ["<b>pH</b>"]];
    this.table_layout = {responsive: false, margin: {t: 10, b: 10, l: 20, r: 20}};
    let hcl_count = [];
    for (let i = 0; i < 21; i++) {
      hcl_count.push((i*100).toString());
    }
    this.table_values = [ hcl_count, this.y];
    var data = [{
      type: 'table',
      header: {
        values: this.header_values,
        align: "center",
        line: {width: 1, color: 'black'},
        fill: {color: "rgb(52, 83, 117)"},
        font: {family: "Arial", size: 14, color: "white"}
      },
      cells: {
        values: this.table_values,
        align: "center",
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 14, color: ["black"]}
      }
    }]
    Plotly.newPlot(table, data, this.layout, this.config);
  }

  step() {
    this.time++;

    if (this.time < this.bufferCapacity) {
      ph -= .07 + (Math.random()-.35) / 4;
      this.act = 1;
    } else if (this.time == this.bufferCapacity) {
      ph -= .2 * (1 + ((Math.random()-.5) / 2));
      this.act = 2;
    } else if (this.time > this.bufferCapacity && this.speed) {
      if (this.act == 2) {
        this.db = (ph - 3) / this.speed;
        this.act = 3;
      }
      ph -= this.db * (1 + ((Math.random()-.2)))
      if (ph < 2.7) {
        ph = Math.max(2.4 + Math.random()/2, ph);
      }
      this.speed -= 1;
      if ((this.y[this.time-1] - ph) > .3){
        speed += 1;
      }
    } else {
      if (this.act == 3) {
        ph -= .1 * (.5 + ((Math.random()-.5) / 2));
        this.act = 4;
      } else {
      ph -= .05 + (Math.random()-.35) / 4;
      }
      ph = Math.max(2.1 + (Math.random() - .45)/10, ph);
    }

    ph = round(ph, 2);
    this.y.push(ph);
    this.x.push(this.time * 100);
    ph_log.push(ph);
    if (ph < 3 && ans_v_ph3 == 0) {
      ans_v_ph3 = (this.time - .5) * 100;
    }
  }

  update() {
    if (this.time < 21) {
      var update = {x: [this.x], y: [this.y]};
      Plotly.restyle(this.table, update, [0]);
    }
  }

  slide(value, n) {
    if (n == 3) {
      value /= 100;
      var update = {x: [[-100, 2100]], y: [[value, value]]}
    } else {
      var update = {x: [[value, value]], y: [[0, 9]]};
    }
    Plotly.restyle(this.plot, update, [n]);
  }

  save_pdf() {
    var image = new Image();
    Plotly.plot(
      'plot',
      this.data,
      this.layout)
    .then(
      function(gd) {
        Plotly.toImage(gd, {
            height: 500,
            width: 700
          })
          .then(
            function(url) {
              const doc = new jsPDF();
              name = document.getElementById('name').value;
              doc.text(name, 10, 15)
              doc.addImage(url, 'png', 20, 20, 160, 90)

              let text = "";
              let correct = true;

              let ekvivalenspunkt = parseFloat(document.getElementById('eqvpv').value.replace(',', '.'));
              let halvtitrerpunkt = parseFloat(document.getElementById('heqvpv').value.replace(',', '.'));
              let pka = parseFloat(document.getElementById('pkav').value.replace(',', '.')) / 100;
              let v_ph3 = parseFloat(document.getElementById('vhclph3').value.replace(',', '.'));
              let n_ph3 = parseFloat(document.getElementById('molhclph3').value.replace(',', '.'));
              let c_ph3 = parseFloat(document.getElementById('chclph3').value.replace(',', '.'));

              let margin = .925;
              let ans_ekvivalenspunkt = (bufferCapacity + (speed / 2)) * 100;
              let ans_halvtitrerpunkt = ans_ekvivalenspunkt / 2;
              let ans_pka = ph_log[Math.round(ans_halvtitrerpunkt / 100)];
              let ans_n_ph3 = (ans_v_ph3 / 10**6) * .1;
              let ans_c_ph3 = ans_n_ph3 / (.005 + ans_v_ph3 / 10**6);

              let y = 130;

              doc.setTextColor(0, 255,0);
              if ((ekvivalenspunkt < (ans_ekvivalenspunkt * margin)) || (ekvivalenspunkt > (ans_ekvivalenspunkt / margin)) || isNaN(ekvivalenspunkt)) {
                correct = false;
                doc.setTextColor(255,0,0);
              }
              doc.text('Volym tillsatt HCl vid ekvivalenspunkt:  ' + ekvivalenspunkt, 10, y)
              doc.setTextColor(0, 255,0);
              y += 10
              if ((halvtitrerpunkt < (ans_halvtitrerpunkt * margin)) || (halvtitrerpunkt > (ans_halvtitrerpunkt / margin)) || isNaN(halvtitrerpunkt)) {
                correct = false;
                doc.setTextColor(255,0,0);
              }
              doc.text('Volym tillsatt HCl vid halvtitrerpunkt:  ' + halvtitrerpunkt, 10, y)
              doc.setTextColor(0, 255,0);
              y += 10
              if ((pka < (ans_pka * margin)) || (pka > (ans_pka / margin)) || isNaN(pka) || isNaN(ans_pka)) {
                correct = false;
                doc.setTextColor(255,0,0);
              }
              doc.text('Salivens pKa:  ' + pka, 10, y)
              doc.setTextColor(0, 255,0);
              y += 10
              if ((v_ph3 < (ans_v_ph3 * margin)) || (v_ph3 > (ans_v_ph3 / margin)) || isNaN(v_ph3)) {
                correct = false;
                doc.setTextColor(255,0,0);
              }
              doc.text('Volym tillsatt HCl (0.1M) vid pH 3:  ' + v_ph3, 10, y)
              doc.setTextColor(0, 255,0);
              y += 10
              if ((n_ph3 < (ans_n_ph3 * margin)) || (n_ph3 > (ans_n_ph3 / margin)) || isNaN(n_ph3)) {
                correct = false;
                doc.setTextColor(255,0,0);
              }
              doc.text('Substansmängd HCl vid pH 3:  ' + n_ph3, 10, y)
              doc.setTextColor(0, 255,0);
              y += 10
              if ((c_ph3 < (ans_c_ph3 * margin)) || (c_ph3 > (ans_c_ph3 / margin)) || isNaN(c_ph3)) {
                correct = false;
                doc.setTextColor(255,0,0);
              }
              doc.text('Koncentration HCl (M) vid pH 3:  ' + c_ph3, 10, y)
              doc.setTextColor(0, 255,0);

              if (correct) {
                doc.setDrawColor(0, 255, 0);
              } else {
                doc.setDrawColor(255, 0, 0);
              }
              doc.setLineWidth(7);
              doc.rect(3.5, 3.5, 203.5, 290.5);

              doc.save(name + "_pH_lab.pdf");
            })

      });
  }
}

let simulation = new Main();

function drop() {
  simulation.step();
  simulation.update();
  document.getElementById("verge3d").contentWindow.colorIndicator();
}

function update_graph() {
  var update = {x: [simulation.x], y: [simulation.y]};
  Plotly.restyle(simulation.plot, update, [0]);
}

var element = document.getElementById("downloadPDF");
element.addEventListener("click", simulation.save_pdf);

var element = document.getElementById("drawGraph");
element.addEventListener("click", update_graph);

var slider1 = document.getElementById("eqvpv");
var eqvalue = document.getElementById("eqvps");
slider1.oninput = function() {
  eqvalue.innerHTML = this.value;
  simulation.slide(this.value, 1);
}

var slider2 = document.getElementById("heqvpv");
var heqvalue = document.getElementById("heqvps");
slider2.oninput = function() {
  heqvalue.innerHTML = this.value;
  simulation.slide(this.value, 2);
}

var slider3 = document.getElementById("pkav");
var pkavalue = document.getElementById("pkas");
slider3.oninput = function() {
  pkavalue.innerHTML = this.value / 100;
  simulation.slide(this.value, 3);
}

function reloadIframe() {
  document.getElementById("verge3d").src="ph_lab.html";
}

document.getElementById("verge3d").contentWindow.document.getElementById("loadLab").addEventListener("click", reloadIframe);
// var instructions = document.getElementById('verge3d').contentWindow.document.getElementById('loadLab');
// instructions.addEventListener("click", reloadIframe());

// for (let i = 0; i < 25; i++) {
//   drop();
// }
