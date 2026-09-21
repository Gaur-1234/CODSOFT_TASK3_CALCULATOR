/* =====================================================
   CALCX — JAVASCRIPT
   CODSOFT TASK 3
===================================================== */


/* ================= VARIABLES ================= */

const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const buttons =
    document.querySelector(".buttons");

const historyList =
    document.getElementById("historyList");

const clearAllHistory =
    document.getElementById("clearAllHistory");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const themeBtn =
    document.getElementById("themeBtn");


let currentValue = "0";

let previousValue = "";

let operation = null;

let shouldResetDisplay = false;

let history = [];


/* ================= DISPLAY ================= */

function updateDisplay() {

    currentDisplay.textContent =
        formatNumber(currentValue);

    previousDisplay.textContent =
        previousValue || "0";
}


/* ================= FORMAT NUMBER ================= */

function formatNumber(value) {

    if (value === "Error") {
        return value;
    }

    if (value === "") {
        return "0";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }

    if (
        Math.abs(number) >= 1e12 ||
        (
            Math.abs(number) > 0 &&
            Math.abs(number) < 0.000001
        )
    ) {
        return number.toExponential(6);
    }

    if (Number.isInteger(number)) {

        return number.toLocaleString(
            "en-US"
        );

    }

    return number.toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 10
        }
    );
}


/* ================= INPUT NUMBER ================= */

function inputNumber(number) {

    if (currentValue === "Error") {

        currentValue = "0";

        previousValue = "";

        operation = null;
    }


    if (shouldResetDisplay) {

        currentValue = "0";

        shouldResetDisplay = false;
    }


    if (number === ".") {

        if (currentValue.includes(".")) {
            return;
        }

        currentValue += ".";

    } else {

        if (currentValue === "0") {

            currentValue = number;

        } else {

            currentValue += number;
        }
    }

    updateDisplay();
}


/* ================= SELECT OPERATION ================= */

function chooseOperation(nextOperation) {

    if (currentValue === "Error") {
        return;
    }


    if (
        operation !== null &&
        !shouldResetDisplay
    ) {

        calculate();
    }


    previousValue = currentValue;

    operation = nextOperation;

    shouldResetDisplay = true;

    updateDisplay();
}


/* ================= CALCULATE ================= */

function calculate() {

    if (
        operation === null ||
        previousValue === ""
    ) {
        return;
    }


    const firstNumber =
        Number(previousValue);

    const secondNumber =
        Number(currentValue);


    let result;


    switch (operation) {

        case "+":
            result =
                firstNumber + secondNumber;
            break;


        case "-":
            result =
                firstNumber - secondNumber;
            break;


        case "*":
            result =
                firstNumber * secondNumber;
            break;


        case "/":

            if (secondNumber === 0) {

                currentValue = "Error";

                previousValue = "Cannot divide by zero";

                operation = null;

                shouldResetDisplay = true;

                updateDisplay();

                return;
            }

            result =
                firstNumber / secondNumber;

            break;


        default:
            return;
    }


    result =
        Number(
            result.toFixed(10)
        );


    const expression =
        `${formatNumber(String(firstNumber))}
        ${getOperationSymbol(operation)}
        ${formatNumber(String(secondNumber))}`;


    addToHistory(
        expression,
        formatNumber(String(result))
    );


    currentValue =
        String(result);

    previousValue = "";

    operation = null;

    shouldResetDisplay = true;

    updateDisplay();
}


/* ================= OPERATION SYMBOL ================= */

function getOperationSymbol(operator) {

    const symbols = {

        "+": "+",

        "-": "−",

        "*": "×",

        "/": "÷"
    };


    return symbols[operator] || operator;
}


/* ================= CLEAR ================= */

function clearCalculator() {

    currentValue = "0";

    previousValue = "";

    operation = null;

    shouldResetDisplay = false;

    updateDisplay();
}


/* ================= DELETE ================= */

function deleteNumber() {

    if (shouldResetDisplay) {
        return;
    }


    if (
        currentValue.length === 1 ||
        currentValue === "Error"
    ) {

        currentValue = "0";

    } else {

        currentValue =
            currentValue.slice(
                0,
                -1
            );
    }


    updateDisplay();
}


/* ================= SIGN ================= */

function toggleSign() {

    if (
        currentValue === "0" ||
        currentValue === "Error"
    ) {
        return;
    }


    currentValue =
        String(
            Number(currentValue) * -1
        );


    updateDisplay();
}


/* ================= PERCENTAGE ================= */

function percentage() {

    if (currentValue === "Error") {
        return;
    }


    currentValue =
        String(
            Number(currentValue) / 100
        );


    updateDisplay();
}


/* ================= HISTORY ================= */

function addToHistory(
    expression,
    result
) {

    history.unshift({

        expression: expression.trim(),

        result: result,

        time: new Date()
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
    });


    if (history.length > 10) {

        history.pop();
    }


    saveHistory();

    renderHistory();
}


/* ================= RENDER HISTORY ================= */

function renderHistory() {

    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                Your calculations will appear here.
            </div>
        `;

        return;
    }


    historyList.innerHTML = "";


    history.forEach(item => {

        const historyItem =
            document.createElement("div");


        historyItem.className =
            "history-item";


        historyItem.innerHTML = `

            <div>

                <div class="history-expression">
                    ${item.expression}
                </div>

                <div class="history-time">
                    ${item.time}
                </div>

            </div>

            <div class="history-result">
                ${item.result}
            </div>

        `;


        historyList.appendChild(
            historyItem
        );
    });
}


/* ================= SAVE HISTORY ================= */

function saveHistory() {

    localStorage.setItem(
        "calcXHistory",
        JSON.stringify(history)
    );
}


/* ================= LOAD HISTORY ================= */

function loadHistory() {

    const savedHistory =
        localStorage.getItem(
            "calcXHistory"
        );


    if (savedHistory) {

        history =
            JSON.parse(savedHistory);

        renderHistory();
    }
}


/* ================= CLEAR HISTORY ================= */

function clearHistory() {

    history = [];

    localStorage.removeItem(
        "calcXHistory"
    );

    renderHistory();
}


/* ================= BUTTON EVENTS ================= */

buttons.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const number =
            button.dataset.number;


        const selectedOperation =
            button.dataset.operation;


        const action =
            button.dataset.action;


        if (number !== undefined) {

            inputNumber(number);

            return;
        }


        if (
            selectedOperation !== undefined
        ) {

            chooseOperation(
                selectedOperation
            );

            return;
        }


        switch (action) {

            case "clear":

                clearCalculator();

                break;


            case "delete":

                deleteNumber();

                break;


            case "sign":

                toggleSign();

                break;


            case "percentage":

                percentage();

                break;


            case "calculate":

                calculate();

                break;
        }

    }
);


/* ================= KEYBOARD SUPPORT ================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        if (
            (key >= "0" && key <= "9") ||
            key === "."
        ) {

            inputNumber(key);

            return;
        }


        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperation(key);

            return;
        }


        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

            return;
        }


        if (key === "Backspace") {

            deleteNumber();

            return;
        }


        if (key === "Escape") {

            clearCalculator();

            return;
        }


        if (key === "%") {

            percentage();

            return;
        }
    }
);


/* ================= CLEAR HISTORY BUTTONS ================= */

clearAllHistory.addEventListener(
    "click",
    clearHistory
);


clearHistoryBtn.addEventListener(
    "click",
    clearHistory
);


/* ================= START BUTTON ================= */

function scrollToCalculator() {

    document
        .getElementById("calculator")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


/* ================= THEME BUTTON ================= */

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "light-mode"
        );

    }
);


/* ================= INITIALIZE ================= */

loadHistory();

updateDisplay();