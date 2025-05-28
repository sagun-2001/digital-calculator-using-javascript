// let string="";
// let buttons=document.querySelectorAll('.button');

// // Function to check if a character is an operator
// function isOperator(char) {
//     return ['+', '-', '*', '/', '%'].includes(char);
// }

// Array.from(buttons).forEach((button)=>{
//     button.addEventListener('click',(e)=>{
//         if(e.target.innerHTML== '='){
//             string=eval(string);
//             document.querySelector('input').value=string;
//         }
//         else if(e.target.innerHTML == "C"){
//             string="";
//             document.querySelector('input').value=string;
//         }
//         else if(e.target.innerHTML =="M+"){
//             string=string.slice(0,-1);
//             document.querySelector('input').value= string;

//         }
//         else{

//             if(isOperator(e.target.innerHTML) && isOperator(string.slice(-1))){
//                 return;
//             }
            
//             string=string+e.target.innerHTML;
//             document.querySelector('input').value = string;

//         } 

//     })
// })


let string = "";
let buttons = document.querySelectorAll('.button');
let inputField = document.getElementById('display');
let intermediateDisplay = document.getElementById('intermediate');
let calculated = false;

function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

// Function to handle percentage logic
function handlePercentage(value) {
    // If there is a percentage symbol, handle it as a special case
    if (value.includes('%')) {
        let parts = value.split('%');  // Split by percentage
        if (parts.length === 2) {
            return (parseFloat(parts[0]) / 100) * parseFloat(parts[1]);  // Handle percentage like "88%10"
        }
        return parseFloat(parts[0]) / 100;  // Handle "88%" as 88 divided by 100
    }
    return value;
}

function handleInput(value) {
    if (value === '=') {
        try {
            string = handlePercentage(string).toString();
            string = eval(string).toString() || "";
        } catch (error) {
            string = "Error";  
        }
        inputField.value = string;  
        intermediateDisplay.textContent = "";  
        calculated = true;
    } else if (value === 'C') {
        string = "";  
        inputField.value = string;
        intermediateDisplay.textContent = "";  
        calculated = false;
    } else if (value === 'M+') {
        string = string.slice(0, -1);  
        inputField.value = string;
    } else {
        if (calculated && !isOperator(value)) {
            string = value;  
            calculated = false;
        } else {
            if (calculated && isOperator(value)) {
                calculated = false;
            }

            if (isOperator(value) && isOperator(string.slice(-1))) {
                string = string.slice(0, -1) + value;
            } else {
                string += value;  
            }
        }
        inputField.value = string;

        if (value === '%') {
            const [firstOperand] = string.split('%');
            const percentageResult = (parseFloat(firstOperand) / 100).toString();  
            intermediateDisplay.textContent = percentageResult;
        } else if (string.includes('%')) {
            const [firstOperand, secondOperand] = string.split('%');
            const baseValue = (parseFloat(firstOperand) / 100).toString();
            if (secondOperand) {
                intermediateDisplay.textContent = (parseFloat(baseValue) * parseFloat(secondOperand)).toString();
            }
        } else {
            intermediateDisplay.textContent = "";  
        }
    }
}

// Add click event listener for each button
Array.from(buttons).forEach((button) => {
    button.addEventListener('click', (e) => {
        handleInput(e.target.innerHTML);
    });
});

// Add keyboard event listener for keyboard input
document.addEventListener('keydown', (e) => {
    let key = e.key;

    if (!isNaN(key) || isOperator(key) || key === '.' || key === 'Enter' || key === 'Backspace') {
        e.preventDefault();

        if (key === 'Enter') {
            handleInput('=');
        } else if (key === 'Backspace') {
            handleInput('M+'); 
        } else {
            handleInput(key);
        }
    }
});
