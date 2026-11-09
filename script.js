const display = document.getElementById('display');
const MAX_LENGTH = 16; // Batas maksimal karakter untuk pengujian BVA (Boundary Value Analysis)

let currentExpression = '0';

function updateDisplay() {
    let visualString = currentExpression
        .replace(/\//g, '÷')
        .replace(/\*/g, '×');
    display.value = visualString;
}

function appendChar(char) {
    if (currentExpression === '0' || currentExpression === 'Error') {
        currentExpression = char;
    } else if (currentExpression.length < MAX_LENGTH) { // Penerapan BVA (Menahan input berlebih)
        currentExpression += char;
    }
    updateDisplay();
}

function appendOperator(op) {
    const lastChar = currentExpression.slice(-1);
    // Penerapan EP (Handling invalid input: mencegah penumpukan operator seperti 5+*2)
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + op;
    } else if (currentExpression !== 'Error' && currentExpression.length < MAX_LENGTH) {
        currentExpression += op;
    }
    updateDisplay();
}

function appendMath(type) {
    if (currentExpression === '0' || currentExpression === 'Error') {
        currentExpression = '';
    }
    if (currentExpression.length < MAX_LENGTH - 4) {
        if (type === 'sqrt') {
            currentExpression += 'Math.sqrt(';
        } else if (type === 'sqr') {
            currentExpression += '**2';
        }
    }
    updateDisplay();
}

function clearDisplay() {
    currentExpression = '0';
    updateDisplay();
}

function deleteChar() {
    if (currentExpression !== 'Error') {
        if (currentExpression.length > 1) {
            currentExpression = currentExpression.slice(0, -1);
        } else {
            currentExpression = '0';
        }
        updateDisplay();
    }
}

function calculate() {
    try {
        // Penerapan EP Invalid Class (Mencegah pembagian dengan nol)
        if (currentExpression.includes('/0')) {
            currentExpression = 'Error';
            updateDisplay();
            return;
        }

        let evalString = currentExpression
            .replace(/\^/g, '**') 
            .replace(/%/g, '/100'); 

        let result = eval(evalString);
        
        // Membatasi desimal hasil evaluasi agar tidak melebihi batas layar
        if (result.toString().length > MAX_LENGTH) {
            result = parseFloat(result).toPrecision(MAX_LENGTH - 4);
        }
        
        currentExpression = result.toString();
        updateDisplay();
    } catch (e) {
        // Penerapan EP (Handling invalid format syntax error)
        currentExpression = 'Error';
        updateDisplay();
    }
}