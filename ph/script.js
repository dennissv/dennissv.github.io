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
    var config = {responsive: true, yaxis: {range: [1, 7]}, xaxis: {range: [0, 2000]}};
    Plotly.newPlot(this.plot, [{
    x: this.x,
    y: this.y}], config );

    // Table
    // this.table = document.getElementById('table');
    // this.table_values = [ ['<b>pH</b>'], [this.y[this.time]] ];
    // this.header_values = [["<b>μl HCl</b>"]];
    // for (var i = 0; i < 21; i++) {
    //   this.header_values.push(["<b>".concat(i.toString(), "</b>")]);
    // }
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

    if (this.time < this.bufferCapacity) {
      ph -= .07 + (Math.random()-.5) / 5;
      this.act = 1;
    } else if (this.time == this.bufferCapacity) {
      ph -= .2 * (1 + ((Math.random()-.5) / 2));
      this.act = 2;
    } else if (this.time > this.bufferCapacity && this.speed) {
      if (this.act == 2) {
        this.db = (ph - 3) / this.speed;
        this.act = 3;
      }
      ph -= this.db * (1 + ((Math.random()-.5)))
      ph = Math.max(2.5 + Math.random()/2, ph);
      this.speed -= 1;
    } else {
      if (this.act == 3) {
        ph -= .2 * (1 + ((Math.random()-.5) / 2));
        this.act = 4;
      } else {
      ph -= .07 + (Math.random()-.5) / 5;
      }
    }
    // ph -= this.dy[this.time] * (1 + ((Math.random()-.5) / 2));
    ph = round(ph, 2);
    this.y.push(ph);
    this.x.push(this.time * 100);

    // this.table_values.push([ph]);

    // ph -= (Math.random() * .4);
    // ph = round(ph)
    // this.y.push(ph)
    // this.table_values.push([ph]);
    //
    // this.time++;
    // this.x.push(this.time * 100);
  }

  update() {
    let data = {x: [this.x], y: [this.y]};
    var config = {responsive: true, yaxis: {range: [1, 7]}, xaxis: {range: [0, 2000]}};
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

  // async run() {
  //   for (var i = 0; i < 20; i++) {
  //     await delay(3);
  //     this.step();
  //     this.update();
  //   }
  // }

}

let simulation = new Main();

function drop() {
  console.log('drop');
  simulation.step();
  simulation.update();
  document.getElementById("verge3d").contentWindow.funcTest();
}

console.log('Hello from plotly v2');
document.getElementById("drop").addEventListener("click", drop);



// simulation.run();
