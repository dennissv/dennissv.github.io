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
      yaxis: {range: [1, 8], title: {text: 'pH', font: {size: 20}}, dtick: 0.5},
      xaxis: {range: [0, 2000], title: {text: 'Volym tillsatt HCl (μl)', font: {size: 20}}, dtick: 100},
      };
    this.config = {displayModeBar: false}
    this.data = [{name: 'pH', color: 'rgb(42, 71, 101)', line: {shape: 'spline'}, type: 'line', x: this.x, y: this.y, mode: 'lines+markers'},
      {type: 'line', name: 'Ekvivalenspunkt', hoverinfo: 'skip', x: [-100, -100], y: [0, 9]},
      {type: 'line', name: 'Halvtitrerpunkt', hoverinfo: 'skip', x: [-100, -100], y: [0, 9]},
      {type: 'line', name: 'pKa', hoverinfo: 'skip', x: [-100, -100], y: [0, 9]}];
    Plotly.newPlot(this.plot, this.data, this.layout, this.config);
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
    var update = {x: [this.x], y: [this.y]};
    Plotly.restyle(this.plot, update, [0]);
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
              doc.text(name, 10, 20)
              doc.addImage(url, 'png', 20, 20, 160, 90)

              let text = "";
              let correct = true;

              let ekvivalenspunkt = parseFloat(document.getElementById('eqvpv').value.replace(',', '.'));
              let halvtitrerpunkt = parseFloat(document.getElementById('heqvpv').value.replace(',', '.'));
              let pka = parseFloat(document.getElementById('pkav').value.replace(',', '.')) / 100;
              let v_ph3 = parseFloat(document.getElementById('vhclph3').value.replace(',', '.'));
              let n_ph3 = parseFloat(document.getElementById('molhclph3').value.replace(',', '.'));
              let c_ph3 = parseFloat(document.getElementById('chclph3').value.replace(',', '.'));

              let margin = .95;
              let ans_ekvivalenspunkt = (bufferCapacity + (speed / 2)) * 100;
              let ans_halvtitrerpunkt = ans_ekvivalenspunkt / 2;
              let ans_pka = ph_log[Math.round(ans_halvtitrerpunkt / 100)];
              let ans_n_ph3 = (ans_v_ph3 / 10**6) * .1;
              let ans_c_ph3 = ans_n_ph3 / (.005 + ans_v_ph3 / 10**6);

              console.log(ans_ekvivalenspunkt, ekvivalenspunkt);
              console.log(ans_halvtitrerpunkt, halvtitrerpunkt);
              console.log(ans_pka, pka);

              console.log(ans_v_ph3, v_ph3);
              console.log(ans_n_ph3, n_ph3);
              console.log(ans_c_ph3, c_ph3);

              if ((ekvivalenspunkt < (ans_ekvivalenspunkt * margin)) || (ekvivalenspunkt > (ans_ekvivalenspunkt / margin))) {
                correct = false;
              }
              if ((halvtitrerpunkt < (ans_halvtitrerpunkt * margin)) || (halvtitrerpunkt > (ans_halvtitrerpunkt / margin))) {
                correct = false;
              }
              if ((pka < (ans_pka * margin)) || (pka > (ans_pka / margin))) {
                correct = false;
              }
              if ((v_ph3 < (ans_v_ph3 * margin)) || (v_ph3 > (ans_v_ph3 / margin))) {
                correct = false;
              }
              if ((n_ph3 < (ans_n_ph3 * margin)) || (n_ph3 > (ans_n_ph3 / margin))) {
                correct = false;
              }
              if ((c_ph3 < (ans_c_ph3 * margin)) || (c_ph3 > (ans_c_ph3 / margin))) {
                correct = false;
              }

              text += 'Volym tillsatt HCl vid ekvivalenspunkt:  ' + ekvivalenspunkt + '\n';
              text += 'Volym tillsatt HCl vid halvtitrerpunkt:  ' + halvtitrerpunkt + '\n';
              text += 'Salivens pKa:  ' + pka + '\n';
              text += 'Volym tillsatt HCl (0.1M) vid pH 3:  ' + v_ph3 + '\n';
              text += 'Substansmängd HCl (M) vid pH 3:  ' + n_ph3 + '\n';
              text += 'Koncentration HCl (M) vid pH 3:  ' + c_ph3 + '\n';
              text += ans_pka;
              doc.text(text, 10, 130)

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
    // return image;
  }
}

let simulation = new Main();

function drop() {
  simulation.step();
  simulation.update();
  // document.getElementById("verge3d").contentWindow.colorIndicator();
}

var element = document.getElementById("downloadPDF");
element.addEventListener("click", simulation.save_pdf);

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
