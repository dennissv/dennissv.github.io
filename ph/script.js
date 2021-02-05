const delay = ms => new Promise(res => setTimeout(res, ms));

class Main {
  constructor() {
    this.x = [0];
    this.y = [ph];
    this.dy = [0, .03, .04, .05, .04, .06, .07, .1, .1, .7, 1.5, .7, .15, .1, .06, .06, .04, .05, .03, .02, .03];
    this.time = 0;
    this.act = 0;
    this.timesteps = 20;
    this.bufferCapacity = round(Math.random()*5 + 5, 0);
    this.speed = round(2 + Math.random()*2, 0);

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
      ph = Math.max(2.5 + Math.random()/2, ph);
      this.speed -= 1;
    } else {
      if (this.act == 3) {
        ph -= .2 * (1 + ((Math.random()-.5) / 2));
        this.act = 4;
      } else {
      ph -= .05 + (Math.random()-.35) / 4;
      }
    }

    ph = round(ph, 2);
    this.y.push(ph);
    this.x.push(this.time * 100);
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
              doc.text(name, 10, 10)

              doc.addImage(url, 'png', 20, 20, 160, 90)

              let text = "";
              text += 'Volym tillsatt HCl vid ekvivalenspunkt:  ' + document.getElementById('pkarange').value + '\n';
              text += 'Volym tillsatt HCl vid halvtitrerpunkt:  ' + document.getElementById('hclht').value + '\n';
              text += 'Salivens pKa:  ' + document.getElementById('pka').value + '\n';
              text += 'Volym tillsatt HCl (1M) vid pH 3:  ' + document.getElementById('vph3').value + '\n';
              text += 'Koncentration HCl (M) vid pH 3:  ' + document.getElementById('chcl').value + '\n';
              doc.text(text, 10, 130)

              doc.save(name + "_pH_lab.pdf");
            })

      });
    // return image;
  }
}

let simulation = new Main();

function drop() {
  console.log('drop');
  simulation.step();
  simulation.update();
  document.getElementById("verge3d").contentWindow.colorIndicator();
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
