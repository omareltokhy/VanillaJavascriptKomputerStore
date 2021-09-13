//Setting up variables and fetching elements from html
const balance = document.getElementById("balance");
const outstandingLoan = document.getElementById("outstandingLoan");
const getALoan = document.getElementById("getALoan");
const pay = document.getElementById("pay");
const bank = document.getElementById("bank");
const work = document.getElementById("work");
const repayLoan = document.getElementById("repayLoan");
const laptopsSelection = document.getElementById("laptopSelection");
const laptopFeatures = document.getElementById("laptopFeatures");
const laptopImage = document.getElementById("laptopImage");
const laptopName = document.getElementById("laptopName");
const laptopDescription = document.getElementById("laptopDescription");
const laptopPrice = document.getElementById("laptopPrice");
const buyALaptop = document.getElementById("buyALaptop");

let laptops = [];
let totalPay = 0;
let totalBalance = 0;
let totalOutsandingLoan = 0;
let totalLoans = 0;
let totalLoanAmount = 0;
let totalLoansBeforeBuy = 0;

//Fetching data from API and populating laptop section of main page with it's data
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToSelection(laptops));

const addLaptopsToSelection = (laptops) => {
    laptops.forEach(x => addLaptopToSelection(x))
    laptopPrice.innerText = laptops[0].price;
    laptopDescription.innerText = laptops[0].description;
    laptopName.innerText = laptops[0].title;
    laptopImage.src = "https://noroff-komputer-store-api.herokuapp.com/"+laptops[0].image;
    laptopFeatures.innerText = laptops[0].specs;
}

const addLaptopToSelection = (laptop) => {
    const laptopSelection = document.createElement("option");
    laptopSelection.value = laptop.id;
    laptopSelection.appendChild(document.createTextNode(laptop.title));
    laptopsSelection.appendChild(laptopSelection);
}

const handleLaptopsSelectionChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    laptopPrice.innerText = selectedLaptop.price;
    laptopDescription.innerText = selectedLaptop.description;
    laptopName.innerText = selectedLaptop.title;
    laptopImage.src = "https://noroff-komputer-store-api.herokuapp.com/"+selectedLaptop.image;
    laptopFeatures.innerText = selectedLaptop.specs;
}

laptopsSelection.addEventListener("change", handleLaptopsSelectionChange);

//Funtionality to work button, earns 100 per click
const earnByWork = () => {
    totalPay += 100;
    pay.innerText = totalPay;
}

work.addEventListener("click", earnByWork);

//Functionality to bank button, adds money to balance or partially to outstanding loan
const bankEarnings = () => {
    if(totalLoanAmount === 0){
        totalBalance += totalPay;
        totalPay = 0;
        pay.innerText = totalPay;
        balance.innerText = totalBalance;
    }else if(totalLoanAmount > 0){
        totalBalance += (totalPay*0.9)
        totalLoanAmount += (totalPay*0.1)
        totalPay = 0;
        pay.innerText = totalPay;
        balance.innerText = totalBalance;
        outstandingLoan.innerText = `Loans: ${totalLoanAmount}€`
    }
}

bank.addEventListener("click", bankEarnings);

//Function to make repay loan button to appear
const repayButtonAppear = () => {
    repayLoan.className = "bankIt"
}

//Functionality to get a loan button. Can have only 1 loan before buy, 1 loan at a time, and max. 2x balance worth of loan
const getABankLoan = () => {
    const loan = prompt("Enter the amount of money you wish to loan:");
    if(totalLoans > 0 ){
        alert("Not able to give the loan before you repay previous loan..") 
    }else if(totalLoansBeforeBuy > 0 ){
        alert("Not able to give the loan before you buy a new laptop..")
    }else if(parseInt(loan) > (totalBalance*2)){
        alert("Not able to give a loan of that amount.")
    }else if(totalLoans < 1 && parseInt(loan) <= (totalBalance*2)){
        alert(`You have been given a ${loan}€ loan `)
        totalBalance += parseInt(loan)
        totalLoanAmount += parseInt(loan)
        totalLoans++
        totalLoansBeforeBuy++
        balance.innerText = totalBalance
        outstandingLoan.innerText = `Loans: ${totalLoanAmount}€`
        repayButtonAppear();
    }
}

getALoan.addEventListener("click", getABankLoan);

//Repay loan button takes money from pay and pays outstanding loan
const repayOutstandingLoan = () => {
    if(totalPay >= totalLoanAmount){
        totalPay -= totalLoanAmount
        totalLoanAmount = 0
        totalLoans -= 1
        pay.innerText = totalPay
        outstandingLoan.innerText = `Loans: ${totalLoanAmount}€`
    }else if(totalPay < totalLoanAmount){
        totalLoanAmount -= totalPay
        totalPay = 0
        totalLoans -= 1
        pay.innerText = totalPay
        outstandingLoan.innerText = `Loans: ${totalLoanAmount}€`
    }
}

repayLoan.addEventListener("click", repayOutstandingLoan);

//Buys a laptop and alerts user if succesful or not
const buyALaptopNow = () => {
    const selectedLaptop = laptops[laptopsSelection.selectedIndex]
    if(totalBalance < parseInt(selectedLaptop.price)){
        alert("You don't have enough money to buy this laptop")
    }else{
        alert(`You are a new happy owner of ${selectedLaptop.title}`)
        totalBalance -= parseInt(selectedLaptop.price)
        totalLoansBeforeBuy -= 1
        balance.innerText = totalBalance
    }
}

buyALaptop.addEventListener("click", buyALaptopNow);