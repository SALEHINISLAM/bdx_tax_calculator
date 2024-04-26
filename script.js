    // Handle changes in the Small & Cottage Industries dropdown to toggle visibility of the production income input
    document.getElementById('smallIndustries').addEventListener('change', function() {
        const productionIncomeGroup = document.getElementById('productionIncomeGroup');
        if (this.value === 'yes') {
            productionIncomeGroup.style.display = 'block'; // Show the inputs if 'Yes' is selected
        } else {
            productionIncomeGroup.style.display = 'none'; // Hide the inputs otherwise
        }
    });
document.getElementById('taxForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Gather input values from the form
    const monthlySalary = parseInt(document.getElementById('monthlySalary').value) || 0;
    const gender = parseInt(document.getElementById('gender').value);
    const area = parseInt(document.getElementById('area').value);
    const smallIndustries = document.getElementById('smallIndustries').value;
    const productionIncome = parseInt(document.getElementById('productionIncome').value) || 0;
    const productionIncrease=parseInt(document.getElementById('productionIncrease').value) || 0;
    const tobaccoIncome = parseInt(document.getElementById('tobaccoIncome').value) || 0;
    const trustIncome = parseInt(document.getElementById('trustIncome').value) || 0;
    const cooperativeIncome = parseInt(document.getElementById('cooperativeIncome').value) || 0;
    const educationalIncome = parseInt(document.getElementById('educationalIncome').value) || 0;
    const vehicleInfo = document.getElementById('vehicleInfo').value;
    const farmIncome = parseInt(document.getElementById('farmIncome').value) || 0;

    let tax = calculateTax({
        monthlySalary,
        gender,
        area,
        smallIndustries,
        productionIncome,
        productionIncrease,
        tobaccoIncome,
        trustIncome,
        cooperativeIncome,
        educationalIncome,
        vehicleInfo,
        farmIncome
    });
    document.getElementById('result').innerHTML = `Your estimated tax is: ${tax.toFixed(2)} BDT`;
    document.getElementById('taxResult').innerHTML = `Your estimated tax is: ${tax.toFixed(2)} BDT`;
    showlossModal();
});

function calculateTax({
    monthlySalary,
    gender,
    area,
    smallIndustries,
    productionIncome,
    tobaccoIncome,
    trustIncome,
    cooperativeIncome,
    educationalIncome,
    vehicleInfo,
    farmIncome
})
{
    let net = 12 * monthlySalary;
    let tax = 0;

    // Apply basic tax calculation based on net income
    if (net <= 350000) tax = 0;
    else if (net <= 450000) tax = net * 0.05;
    else if (net <= 750000) tax = net * 0.1;
    else if (net <= 1150000) tax = net * 0.15;
    else if (net <= 1650000) tax = net * 0.2;
    else tax = net * 0.25;

    // Adjust tax based on gender and other specific exemptions
    if ((gender === 2 || gender === 5) && net <= 400000) tax = 0;
    else if (gender === 3 && net <= 475000) tax = 0;
    else if (gender === 4 && net <= 500000) tax = 0;

    // Additional tax adjustments based on the area
    switch (area) {
        case 1: tax += 5000; break;
        case 2: tax += 4000; break;
        case 3: tax += 3000; break;
        case 4: tax *= 1.3; break;  // Assuming 30% additional tax for non-residents
    }

    // Small & Cottage Industries logic need develop
    if (smallIndustries ==='yes' ) {
        if (productionIncrease>=15 && productionIncrease<=25) {
            tax+=productionIncome*0.05;
        } 
        else if(productionIncrease>25){
            tax+=productionIncome*0.1;
        }    
    }

    // Additional incomes
    tax += tobaccoIncome * 0.45;
    tax += trustIncome * 0.275;
    tax += cooperativeIncome * 0.15;
    tax += educationalIncome * 0.15;

    // Calculate tax based on vehicle information
    const vehicles = vehicleInfo.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    vehicles.forEach(cc => {
        if(cc===0) tax=tax ; 
        else if (cc <= 1500) tax += 25000;
        else if (cc <= 2000) tax += 50000;
        else if (cc <= 2500) tax += 75000;
        else if (cc <= 3000) tax += 150000;
        else if (cc <= 3500) tax += 200000;
        else tax += 350000;
    });

    // Poultry farm or hatchery income
    if (farmIncome > 1000000) {
        let excess = farmIncome - 1000000;
        tax += excess * 0.05;
        if (excess > 1000000) {
            excess -= 1000000;
            tax += excess * 0.05;
            if (excess > 1000000) {
                excess -= 1000000;
                tax += excess * 0.05;
            }
        }
        if (farmIncome > 2000000) {
            let excess = farmIncome - 2000000;
            tax += excess * 0.05;
            if (excess > 1000000) {
                excess -= 1000000;
                tax += excess * 0.05;
            }
        }
    }

    return tax;
}
function showlossModal() {
    document.getElementById('lossModal').style.display='block';
}
function closelossModal() {
    document.getElementById('lossModal').style.display='none';
}
window.onclick=function (event) {
    let modal=document.getElementById('lossModal');
    if (event.target==modal) {
        closelossModal();
    }
}