
var addProductButton = document.getElementById('add-product');
var updateInventoryButton = document.getElementById('update-inventory');
var cancelAddButton = document.getElementById('cancel-add');
var confirmAddButton = document.getElementById('confirm-add');
var cancelUpdateButton = document.getElementById('cancel-update');
var confirmUpdateButton = document.getElementById('confirm-update');

var overlay = document.getElementById('overlay');
var addProductAlert = document.getElementById('add-product-alert');
var updateInventoryAlert = document.getElementById('update-inventory-alert');

var productNameInput = document.getElementById('product-name');
var productQuantityInput = document.getElementById('product-quantity');

var updateProductNameInput = document.getElementById('update-product-name');
var updateProductQuantityInput = document.getElementById('update-product-quantity');
var updateRecipientInput = document.getElementById('update-recipient');


var barChart = null;


function getProductData() {
    var productElements = document.querySelectorAll(".productes");
    var products = [];
    productElements.forEach(function (product) {
        var productName = product.innerHTML;
        var productQuantity = parseInt(product.parentElement.nextElementSibling.innerHTML);
        products.push({ name: productName, quantity: productQuantity });
    });
    return products;
}

// Function to update the bar chart
function updateBarChart() {
    var products = getProductData();
    var categories = products.map(function (product) { return product.name; });
    var data = products.map(function (product) { return product.quantity; });

    var barChartOptions = {
        series: [{
            data: data
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false },
        },
        colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f', '#4f35a1'],
        plotOptions: {
            bar: {
                distributed: true,
                borderRadius: 4,
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: { categories: categories },
        yaxis: { title: { text: 'Count' } },
    };

    // Destroy existing chart instance if any
    if (barChart) {
        barChart.destroy();
    }

    // Create and render a new chart instance
    barChart = new ApexCharts(document.querySelector('#bar-chart'), barChartOptions);
    barChart.render();
}

// Initial chart rendering
updateBarChart();

// Event listener for adding a new product
addProductButton.addEventListener('click', function() {
    overlay.style.display = 'block';
    addProductAlert.style.display = 'block';
});

// Event listener for updating the inventory
updateInventoryButton.addEventListener('click', function() {
    overlay.style.display = 'block';
    updateInventoryAlert.style.display = 'block';
});

// Event listener for confirming the addition of a new product
confirmAddButton.addEventListener('click', async function() {
    var productName = productNameInput.value;
    var productQuantity = productQuantityInput.value;

    if (productName && productQuantity) {
        let productFound = false;
        var productElements = document.querySelectorAll(".productes");
        productElements.forEach(function (product) {
            if (product.innerHTML === productName) {
                product.parentElement.nextElementSibling.innerHTML = productQuantity;
                productFound = true;

                // Update data in JSONBin
                fetch('https://api.jsonbin.io/v3/b', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-MASTER-KEY': '$2a$10$tMwsOTX9cUREGRA5OJ5yb.99kc5rPLj4872OQJXvRcWyZGzT3wtma'
                    },
                    body: JSON.stringify({
                        productName: productName,
                        quantity: productQuantity
                    })
                })
                .then(response => response.json())
                .then(data => console.log('New Bin Created:', data))
                .catch(error => console.error('Error:', error));
            }
        });

        if (!productFound) {
            console.log('Product not found in the list.');
        }
        updateBarChart();
        overlay.style.display = 'none';
        addProductAlert.style.display = 'none';
    } else {
        alert('Please fill out both fields.');
    }
});

// Event listener for canceling the addition of a new product
cancelAddButton.addEventListener('click', function() {
    overlay.style.display = 'none';
    addProductAlert.style.display = 'none';
});

// Event listener for canceling the update inventory action
cancelUpdateButton.addEventListener('click', function() {
    overlay.style.display = 'none';
    updateInventoryAlert.style.display = 'none';
});

// Function to add a row to the inventory table
function addInventoryRow(productName, recipient, quantity) {
    var tableBody = document.getElementById('inventory-table-body');
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${productName}</td>
        <td>${recipient}</td>
        <td>${quantity}</td>
    `;
    tableBody.appendChild(newRow);
}

// Event listener for confirming the update of the inventory
confirmUpdateButton.addEventListener('click', function() {
    var updateProductName = updateProductNameInput.value;
    var updateProductQuantity = updateProductQuantityInput.value;
    var updateRecipient = updateRecipientInput.value;

    if (updateProductName && updateProductQuantity && updateRecipient) {
        var productElements = document.querySelectorAll(".productes");
        productElements.forEach(function (product) {
            if (product.innerHTML === updateProductName) {
                var targetQuantity = parseInt(product.parentElement.nextElementSibling.innerHTML);
                var updatedQuantity = targetQuantity - parseInt(updateProductQuantity);
                product.parentElement.nextElementSibling.innerHTML = updatedQuantity;
            }
        });

        // Add the updated data to the table
        addInventoryRow(updateProductName, updateRecipient, updateProductQuantity);

        updateBarChart();
        overlay.style.display = 'none';
        updateInventoryAlert.style.display = 'none';
    } else {
        alert('Please fill out all fields.');
    }
});
