const delay = ms => new Promise(res => setTimeout(res, ms));
const round = f => parseFloat(f.toFixed(2));

class Main {
  constructor() {
    this.ph = round(Math.random() + 6);
    this.x = [0]
    this.y = [this.ph]
    this.time = 0
    this.timesteps = 20;

    // Graph
    this.plot = document.getElementById('plot');
    var config = {responsive: true};
    Plotly.newPlot(plot, [{
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
    Plotly.newPlot(table, data);
  }

  step() {
    this.ph -= (Math.random() * .4);
    this.ph = round(this.ph)
    this.y.push(this.ph)
    this.table_values.push([this.ph]);

    this.time++;
    this.x.push(this.time * 100);
  }

  update() {
    let data = {x: [this.x], y: [this.y]};
    Plotly.update(this.plot, data);

    var tdata = [{
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
    Plotly.newPlot(this.table, tdata, {displayModeBar: false});
  }

  async run() {
    for (var i = 0; i < 20; i++) {
      await delay(2000);
      this.step();
      this.update();
    }
  }


}

simulation = new Main();
simulation.run();


// var table = document.getElementById('table');
//
// var values = [ ['<b>pH</b>'] ]
//
// var header_values = [["<b>μl HCl</b>"]];
// for (var i = 0; i < 21; i++) {
//   header_values.push(["<b>".concat(i.toString(), "</b>")]);
// }
// console.log(header_values);
//
// var data = [{
//   type: 'table',
//   header: {
//     values: header_values,
//     align: "center",
//     line: {width: 1, color: 'black'},
//     fill: {color: "grey"},
//     font: {family: "Arial", size: 12, color: "white"}
//   },
//   cells: {
//     values: values,
//     align: "center",
//     line: {color: "black", width: 1},
//     font: {family: "Arial", size: 11, color: ["black"]}
//   }
// }]
//
// Plotly.newPlot(table, data);
