// import { jsPDF } from "jspdf";
// function downloadPDF() {
//   const doc = new jsPDF();
//
//   text = '';
// 
//   name = document.getElementById('name').value;
//   text += name + '\n';
//   text += 'Volym tillsatt HCl vid ekvivalenspunkt: ' + document.getElementById('hcleq').value + '\n';
//   text += 'Volym tillsatt HCl vid halvtitrerpunkt: ' + document.getElementById('hclht').value + '\n';
//   text += 'Salivens pKa: ' + document.getElementById('pka').value + '\n';
//   text += 'Volym tillsatt HCl (1M) vid pH 3: ' + document.getElementById('vhcl').value + '\n';
//   text += 'Koncentration HCl (M) vid pH 3: ' + document.getElementById('chcl').value + '\n';
//   doc.text(text, 10, 10)
//
//   image = simulation.get_image();
//   console.log(image);
//   doc.addImage(image.src, 'jpeg', 10, 10, 150, 76)
//   doc.save(name.replace(' ', '_') + "_pH_lab.pdf");
//
// }
//
// var element = document.getElementById("downloadPDF");
// element.addEventListener("click", downloadPDF);
