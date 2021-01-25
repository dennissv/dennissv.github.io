const delay = ms => new Promise(res => setTimeout(res, ms));

class Main {
  constructor() {
    ph = ph;
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
    var config = {responsive: true, yaxis: {range: [1, 7]}, xaxis: {range: [0, 2000]},
    margin: {t: 30, b: 30, l: 30, r: 30}};
    Plotly.newPlot(this.plot, [{
    x: this.x,
    y: this.y}], config );
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
    let data = {x: [this.x], y: [this.y]};
    Plotly.update(this.plot, data);

  }
}

let simulation = new Main();

function drop() {
  console.log('drop');
  simulation.step();
  simulation.update();
  document.getElementById("verge3d").contentWindow.funcTest();
}

console.log('Hello from plotly v3');
document.getElementById("drop").addEventListener("click", drop);
