const WIRE1_INSTRUCTIONS = ['R8', 'U5', 'L5', 'D3'];
const WIRE2_INSTRUCTIONS = ['U7', 'R6', 'D4', 'L4'];
const GRID_SIZE = 11;
const DIRECTION_DICT = {'U': [1, 1], 'D': [1, -1], 'R': [0, 1], 'L': [0, -1]};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createGrid() {
    let wireGrid = document.querySelector('.wireGrid');
    for (i=0; i<121; i++) {
        let div = document.createElement('div');
        div.classList.add('dynamicWire'+(i).toString());
        if (i==100) {
            div.textContent = 'o';
            div.classList.add('green')
        }
        else {
            div.textContent = '.';
        }
    	wireGrid.appendChild(div);
    }
}

async function animateWires(instructions) {
    let position = [1, 1]
    for (let i=0; i<instructions.length; i++) {
        let instruction = instructions[i];
        let command = instruction[0];
        let steps = parseInt(instruction.slice(1, instruction.length));
        for (let step=0; step<steps; step++) {
            position[DIRECTION_DICT[command][0]] += DIRECTION_DICT[command][1];
            let activeCell = document.querySelector('.dynamicWire'+
            indexFromCoordinate(position));
            if (activeCell.textContent != '.') {
                // activeCell.innerHTML = '<p style="animation-duration: 1s; \
                // animation-name: fadein;">X</p>';
                activeCell.textContent = 'X';
            }
            else if ((step < steps-1) || (i == instructions.length-1)) {
                // activeCell.innerHTML = '<p style="animation-duration: 1s; \
                // animation-name: fadein;">'+getSymbol(command)+'</p>';
                activeCell.textContent = getSymbol(command);
            }
            else {
                // activeCell.innerHTML = '<p style="animation-duration: 1s; \
                // animation-name: fadein;">+</p>';
                activeCell.textContent = '+';
            }
            activeCell.classList.add('green');
            await sleep(200);
        }
    }
}

function indexFromCoordinate(position) {
    return (position[0]+
            (GRID_SIZE**2-position[1]*GRID_SIZE-GRID_SIZE)).toString();
}

function getSymbol(s) {
    if ((s == 'U') || (s == 'D')) {
        return '|';
    }
    return '-';
}

async function main() {
    createGrid();
    await sleep(500);
    animateWires(WIRE1_INSTRUCTIONS);
    animateWires(WIRE2_INSTRUCTIONS);
}

main()
