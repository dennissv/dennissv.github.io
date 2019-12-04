const data = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 6, 1, 19, 1, 19, 10, 23, 2, 13, 23, 27, 1, 5, 27, 31, 2, 6, 31, 35, 1, 6, 35, 39, 2, 39, 9, 43, 1, 5, 43, 47, 1, 13, 47, 51, 1, 10, 51, 55, 2, 55, 10, 59, 2, 10, 59, 63, 1, 9, 63, 67, 2, 67, 13, 71, 1, 71, 6, 75, 2, 6, 75, 79, 1, 5, 79, 83, 2, 83, 9, 87, 1, 6, 87, 91, 2, 91, 6, 95, 1, 95, 6, 99, 2, 99, 13, 103, 1, 6, 103, 107, 1, 2, 107, 111, 1, 111, 9, 0, 99, 2, 14, 0, 0]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createFuelHeaders() {
    const fuelHeader = document.querySelector('.fuelHeader');
    for (i=0; i<24; i++) {
    	const div = document.createElement('div');
        div.setAttribute('id', (i).toString());
        div.innerHTML = '<code>'+data[i].toString()+'</code>';
    	fuelHeader.appendChild(div);

        const div2 = document.createElement('div');
        // div.setAttribute('id', (i).toString());
        div2.textContent = ' ';
    	fuelHeader.appendChild(div2);
    }
}

// async function createAlgoExplain() {
//     const algoExplain = document.querySelector('.algoExplain');
//
//     const div2 = document.createElement('div');
//     div2.innerHTML = 'Divide each item with 3 (rounding down) and subract 2';
//     algoExplain.appendChild(div2)
//     await sleep(4000);
//     const div3 = document.createElement('div');
//     div3.innerHTML = '<p style="animation-duration: '+(2).toString()+'s; \
//         animation-name: fadein;">Then sum the results</p>';
//     algoExplain.appendChild(div3)
//     await sleep(3000);
//     const div1 = document.createElement('div');
//     div1.innerHTML = 'Part 1 answer: <br><br>';
//     div1.style.cssText = 'animation-duration: 1s; animation-name: fadein';
//     algoExplain.appendChild(div1)
//     await sleep(500);
//     let answer = 0;
//     for (j=9; j>=0; j--) {
//         answer += Math.floor(data[j]/3)-2
//         div1.innerHTML = 'Part 1 answer: <code>'+answer.toString()+'</code><br><br>';
//         await sleep(500);
//     }
// }

async function createDynamicArrows() {
    // await sleep(2000);
    let dynamicFuel = document.querySelector('.dynamicFuel');
    for (i=0; i<47; i++) {
    	const div = document.createElement('div');
        div.classList.add('dynamicFuel'+(i).toString());
        div.innerHTML += '<p style="animation-duration: '+(4).toString()+'s; \
            animation-name: fadein;"><arrow>↑</arrow></p>';
    	dynamicFuel.appendChild(div);
        await sleep(50);
    }
}

function getSymbol(s) {
    console.log(s);
    if (s == 1) {
        return '+';
    }
    return '*';
}

async function main() {
    let dynamicFuel = document.querySelector('.dynamicFuel');
    for (i=0; i<47; i++) {
        let div = document.createElement('div');
        div.classList.add('dynamicIndex_'+(i).toString());
        // div.classList.add((i).toString());
        dynamicFuel.appendChild(div);
    }

    for (i=0; i<47; i+=8) {
        let dynamicContainer = document.querySelector('.dynamicIndex_'+(i).toString());
        dynamicContainer.innerHTML = '<p style="animation-duration: '+(4).toString()+'s; \
            animation-name: fadein;"><golden>↑</golden></p>';
        await sleep(200);
        dynamicContainer = document.querySelector('.dynamicIndex_'+(i+3).toString());
        dynamicContainer.innerHTML = '<p style="animation-duration: '+(4).toString()+'s; \
            animation-name: fadein;"><golden>'+getSymbol(data[i/2])+ '</golden></p>';
        let 
    }
}

createFuelHeaders();
main();
// createAlgoExplain();
// createDynamicArrows();
