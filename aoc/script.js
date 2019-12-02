const data = [147308, 51605, 71317, 110882, 92545, 126856, 104937, 92433, 107850, 119538, 82733, 52216, 105704, 123682, 105919, 136265, 100540, 84245, 72006, 111652, 85116, 85841, 71374, 144196, 125493, 113529, 64637, 87489, 138161, 120897, 53384, 83310, 126144, 120672, 107681, 101369, 77469, 141056, 140426, 114920, 124454, 130867, 64611, 104813, 138808, 114234, 148654, 59031, 91367, 83316, 106192, 127495, 139980, 119024, 149567, 57007, 61075, 65637, 75293, 61670, 104044, 77230, 80201, 137094, 99733, 50801, 68922, 148404, 79980, 62716, 67666, 72694, 81951, 108427, 111721, 55532, 94442, 88562, 101088, 111656, 111649, 92085, 91730, 114744, 59355, 55842, 100926, 146370, 147829, 62160, 91447, 115745, 141815, 106837, 68151, 89077, 60357, 89856, 75040, 139131]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createFuelHeaders() {
    const fuelHeader = document.querySelector('.fuelHeader');
    for (i=0; i<10; i++) {
    	const div = document.createElement('div');
        div.setAttribute('id', (i).toString());
        div.innerHTML = '<code>'+data[i].toString()+'</code>';
    	fuelHeader.appendChild(div);
    }
}

async function createAlgoExplain() {
    const algoExplain = document.querySelector('.algoExplain');

    const div2 = document.createElement('div');
    div2.innerHTML = 'Divide each item with 3 (rounding down) and subract 2';
    algoExplain.appendChild(div2)
    await sleep(4000);
    const div3 = document.createElement('div');
    div3.innerHTML = '<p style="animation-duration: '+(2).toString()+'s; \
        animation-name: fadein;">Then sum the results</p>';
    algoExplain.appendChild(div3)
    await sleep(3000);
    const div1 = document.createElement('div');
    div1.innerHTML = 'Part 1 answer: <br><br>';
    div1.style.cssText = 'animation-duration: 1s; animation-name: fadein';
    algoExplain.appendChild(div1)
    await sleep(500);
    let answer = 0;
    for (j=9; j>=0; j--) {
        answer += Math.floor(data[j]/3)-2
        div1.innerHTML = 'Part 1 answer: <code>'+answer.toString()+'</code><br><br>';
        await sleep(500);
    }
}

async function createDynamicFuel() {
    // await sleep(2000);
    let dynamicFuel = document.querySelector('.dynamicFuel');
    for (i=0; i<10; i++) {
    	const div = document.createElement('div');
        // div.setAttribute('id', 'dynamicFuel'+(i+1).toString());
        div.classList.add('dynamicFuel'+(i).toString());
        div.innerHTML += '<p style="animation-duration: '+(4).toString()+'s; \
            animation-name: fadein;">'+(Math.floor(data[i]/3)-2).toString()+'</p>'
    	dynamicFuel.appendChild(div);
        await sleep(200);
    }
    await sleep(5500);
    for (i=9; i>=0; i--) {
        const div = document.querySelector('.dynamicFuel'+(i).toString());
        // div.innerHTML = '<p style="animation-duration: '+(4).toString()+'s; \
        //     animation-name: fadein;">'+(Math.floor(data[i]/3)-2).toString()+'</p>'
        if (i > 0) {
            dynamicFuel.removeChild(div)
        }
        else {
            div.innerHTML = "<p style='opacity: 0'>.</p>";
        }
        await sleep(500);
    }
}

createFuelHeaders();
createAlgoExplain();
createDynamicFuel();
