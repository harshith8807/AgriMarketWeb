// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Add this to the beginning of your app.js file

// Sample data for initial development
const sampleMarketPrices = [
    { crop: 'Rice', market: 'Delhi', price: 2150, date: '2025-03-10' },
    { crop: 'Wheat', market: 'Haryana', price: 1980, date: '2025-03-10' },
    { crop: 'Maize', market: 'Punjab', price: 1850, date: '2025-03-10' },
    { crop: 'Sugarcane', market: 'UP', price: 350, date: '2025-03-10' },
    { crop: 'Cotton', market: 'Gujarat', price: 5600, date: '2025-03-10' }
];

const sampleHistoricalPrices = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Rice',
            data: [1950, 2050, 2100, 2080, 2150, 2200],
            borderColor: '#2c6e49',
            backgroundColor: 'rgba(44, 110, 73, 0.1)'
        },
        {
            label: 'Wheat',
            data: [1850, 1900, 1950, 1980, 2000, 1980],
            borderColor: '#4d908e',
            backgroundColor: 'rgba(77, 144, 142, 0.1)'
        }
    ]
};

const sampleRecommendations = {
    'alluvial': {
        'kharif': [
            { 
                name: 'Rice', 
                yield: '20-25 quintals/acre', 
                water: 'High', 
                duration: '120-150 days',
                price: 2200,
                description: 'Rice is a staple food crop that grows well in water-logged areas with alluvial soil.'
            },
            { 
                name: 'Maize', 
                yield: '15-20 quintals/acre', 
                water: 'Medium', 
                duration: '90-100 days',
                price: 1850,
                description: 'Maize is a versatile crop with high yield potential in the kharif season.'
            },
            { 
                name: 'Cotton', 
                yield: '8-10 quintals/acre', 
                water: 'Medium', 
                duration: '150-180 days',
                price: 5600,
                description: 'Cotton grows well in alluvial soils and provides good returns in the kharif season.'
            }
        ],
        'rabi': [
            { 
                name: 'Wheat', 
                yield: '18-22 quintals/acre', 
                water: 'Medium', 
                duration: '120-150 days',
                price: 1980,
                description: 'Wheat is the main rabi crop and grows excellently in alluvial soils.'
            },
            { 
                name: 'Mustard', 
                yield: '8-10 quintals/acre', 
                water: 'Low', 
                duration: '110-130 days',
                price: 4500,
                description: 'Mustard requires less water and provides good returns in rabi season.'
            }
        ],
        'zaid': [
            { 
                name: 'Cucumber', 
                yield: '100-120 quintals/acre', 
                water: 'Medium-High', 
                duration: '60-70 days',
                price: 1200,
                description: 'Cucumber is a quick growing summer crop with good market demand.'
            },
            { 
                name: 'Watermelon', 
                yield: '250-300 quintals/acre', 
                water: 'Medium', 
                duration: '80-90 days',
                price: 1000,
                description: 'Watermelon is heat tolerant and has good market demand in summer.'
            }
        ]
    },
    // Add more soil types with their seasonal recommendations...
    'black': {
        'kharif': [
            { 
                name: 'Cotton', 
                yield: '10-12 quintals/acre', 
                water: 'Medium', 
                duration: '150-180 days',
                price: 5600,
                description: 'Cotton performs exceptionally well in black soils with good water retention.'
            }
        ],
        'rabi': [
            { 
                name: 'Chickpea', 
                yield: '8-10 quintals/acre', 
                water: 'Low', 
                duration: '100-120 days',
                price: 4800,
                description: 'Chickpea is well suited to black soils and requires minimal irrigation.'
            }
        ],
        'zaid': [
            { 
                name: 'Mung Bean', 
                yield: '4-6 quintals/acre', 
                water: 'Low', 
                duration: '60-65 days',
                price: 6500,
                description: 'Mung bean is a short duration crop suitable for summer season in black soils.'
            }
        ]
    }
    // Add more soil types...
};

const sampleWeather = {
    current: {
        temp: 28,
        description: 'sunny',
        humidity: 65,
        windSpeed: 12
    },
    forecast: [
        { day: 'Tomorrow', temp: { min: 25, max: 31 }, icon: '01d', description: 'clear sky' },
        { day: 'Thu', temp: { min: 24, max: 30 }, icon: '02d', description: 'few clouds' },
        { day: 'Fri', temp: { min: 26, max: 33 }, icon: '10d', description: 'light rain' }
    ],
    alerts: [
        { type: 'Heat Warning', description: 'High temperatures expected over the next 3 days. Ensure adequate irrigation for crops.' }
    ]
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Load Market Prices
    loadMarketPrices();
    
    // Load Price Chart
    loadPriceChart();
    
    // Set up Crop Recommendation Form
    setupCropRecommendationForm();
    
    // Load Weather Data
    loadWeatherData();

    // Set up price search
    setupPriceSearch();

    // Set up print functionality
    setupPrintButton();

    // Set up price comparison
    setupPriceComparison();

    // Add profit calculator setup
    setupProfitCalculator();

    // Load market insights
    loadMarketInsights();

    // Setup mobile menu
    setupMobileMenu();

    // Check online status
    checkOnlineStatus();
});

// Mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// Add this function to app.js
function showLoading(elementId, message = 'Loading...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }
}

// Check online/offline status
function checkOnlineStatus() {
    const offlineBanner = document.getElementById('offline-banner');
    
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineBanner.style.display = 'none';
        } else {
            offlineBanner.style.display = 'block';
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
}

async function loadMarketPrices() {
    const tableBody = document.querySelector('#prices-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="4">Loading price data...</td></tr>';
    
    try {
        const response = await fetch('./market-data.json'); // Use relative path
        if (!response.ok) {
            throw new Error('Failed to fetch market data');
        }
        
        const data = await response.json();
        const marketPrices = data.current;
        
        displayMarketPrices(tableBody, marketPrices);
    } catch (error) {
        console.error('Error loading market prices:', error);
        // Fallback to sample data
        displayMarketPrices(tableBody, sampleMarketPrices);
    }
}

// Helper function to display market prices
function displayMarketPrices(tableBody, prices) {
    tableBody.innerHTML = '';
    prices.forEach(price => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${price.crop}</td>
            <td>${price.market}</td>
            <td>₹${price.price.toFixed(2)}</td>
            <td>${formatDate(price.date)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to load market insights
function loadMarketInsights() {
    const topCropsList = document.getElementById('top-crops-list');
    const priceChangesList = document.getElementById('price-changes-list');
    
    if (!topCropsList || !priceChangesList) return;
    
    fetch('market-data.json')
        .then(response => response.json())
        .then(data => {
            // Top crops by price
            const sortedCrops = [...data.current].sort((a, b) => b.price - a.price);
            
            let topCropsHtml = '<ul class="insight-list">';
            sortedCrops.forEach((crop, index) => {
                topCropsHtml += `
                    <li>
                        <span class="rank">${index + 1}</span>
                        <span class="crop-name">${crop.crop}</span>
                        <span class="crop-price">₹${crop.price.toLocaleString()}</span>
                    </li>
                `;
            });
            topCropsHtml += '</ul>';
            
            topCropsList.innerHTML = topCropsHtml;
            
            // Price changes
            let priceChangesHtml = '<ul class="insight-list">';
            
            // Rice price change
            const riceData = data.historical.rice;
            const ricePriceChange = calculatePriceChange(riceData);
            
            // Wheat price change
            const wheatData = data.historical.wheat;
            const wheatPriceChange = calculatePriceChange(wheatData);
            
            priceChangesHtml += `
                <li>
                    <span class="crop-name">Rice</span>
                    <span class="price-change ${ricePriceChange > 0 ? 'positive' : ricePriceChange < 0 ? 'negative' : ''}">
                        ${ricePriceChange > 0 ? '+' : ''}${ricePriceChange.toFixed(2)}%
                    </span>
                </li>
                <li>
                    <span class="crop-name">Wheat</span>
                    <span class="price-change ${wheatPriceChange > 0 ? 'positive' : wheatPriceChange < 0 ? 'negative' : ''}">
                        ${wheatPriceChange > 0 ? '+' : ''}${wheatPriceChange.toFixed(2)}%
                    </span>
                </li>
            `;
            
            priceChangesHtml += '</ul>';
            
            priceChangesList.innerHTML = priceChangesHtml;
        })
        .catch(error => {
            console.error('Error loading market insights:', error);
            topCropsList.innerHTML = '<p>Failed to load insights.</p>';
            priceChangesList.innerHTML = '<p>Failed to load insights.</p>';
        });
}

// Helper function to calculate price change
function calculatePriceChange(data) {
    if (data.length < 2) return 0;
    
    const currentPrice = data[data.length - 1].price;
    const previousPrice = data[data.length - 2].price;
    
    return ((currentPrice - previousPrice) / previousPrice) * 100;
}

// Add this after loadMarketPrices function
function setupPriceSearch() {
    const searchInput = document.getElementById('price-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#prices-table tbody tr');
        
        rows.forEach(row => {
            const crop = row.cells[0].textContent.toLowerCase();
            const market = row.cells[1].textContent.toLowerCase();
            
            if (crop.includes(searchTerm) || market.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Add this function to populate the comparison dropdown
function setupPriceComparison() {
    const comparisonSelect = document.getElementById('comparison-crop');
    if (!comparisonSelect) {
        console.error("Error: Comparison dropdown not found in the DOM!");
        return;
    }

    fetch('market-data.json')
        .then(response => response.json())
        .then(data => {
            console.log("Market data loaded successfully:", data);
            const crops = [...new Set(data.current.map(item => item.crop))];

            crops.forEach(crop => {
                const option = document.createElement('option');
                option.value = crop.toLowerCase();
                option.textContent = crop;
                comparisonSelect.appendChild(option);
            });

            // Detect multiple selections
            comparisonSelect.addEventListener('change', function() {
                const selectedCrops = Array.from(comparisonSelect.selectedOptions).map(opt => opt.value);
                console.log("Selected Crops:", selectedCrops); // Debugging log
                if (selectedCrops.length > 0) {
                    loadComparisonChart(selectedCrops);
                }
            });
        })
        .catch(error => console.error('Error loading crop data:', error));
}


// Function to load the comparison chart
function loadComparisonChart(selectedCrops) {
    console.log("Generating chart for crops:", selectedCrops); // Debugging log
    const ctx = document.getElementById('comparison-chart').getContext('2d');

    fetch('market-data.json')
        .then(response => response.json())
        .then(data => {
            const datasets = selectedCrops.map(crop => {
                const cropData = data.current.filter(item => item.crop.toLowerCase() === crop.toLowerCase());
                console.log(`Data for ${crop}:`, cropData); // Debugging log

                return {
                    label: crop,
                    data: cropData.map(item => item.price),
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
                    borderWidth: 1
                };
            });

            const labels = [...new Set(data.current.map(item => item.market))];

            if (window.comparisonChart) {
                console.log("Destroying old chart...");
                window.comparisonChart.destroy();
            }

            console.log("Creating new chart...");
            window.comparisonChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'top' }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: { display: true, text: 'Price (₹/Quintal)' }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading comparison data:', error));
}


async function loadPriceChart() {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    try {
        const response = await fetch('market-data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch market data');
        }
        
        const data = await response.json();
        const historicalData = data.historical;
        
        // Transform data for Chart.js
        const labels = historicalData.rice.map(item => {
            return new Date(item.date).toLocaleDateString('en-US', { month: 'short' });
        });
        
        const datasets = [
            {
                label: 'Rice',
                data: historicalData.rice.map(item => item.price),
                borderColor: '#2c6e49',
                backgroundColor: 'rgba(44, 110, 73, 0.1)'
            },
            {
                label: 'Wheat',
                data: historicalData.wheat.map(item => item.price),
                borderColor: '#4d908e',
                backgroundColor: 'rgba(77, 144, 142, 0.1)'
            }
        ];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price (₹/Quintal)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading price chart:', error);
        document.querySelector('.chart-container').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                Could not load chart data. 
                <button onclick="loadPriceChart()">Retry</button>
            </div>
        `;
    }
}

// Function to set up profit calculator
function setupProfitCalculator() {
    const calculatorForm = document.getElementById('profit-calculator-form');
    const cropSelect = document.getElementById('calculator-crop');
    
    if (!calculatorForm || !cropSelect) return;
    
    // Load crops from the market data
    fetch('market-data.json')
        .then(response => response.json())
        .then(data => {
            // Get unique crops
            const crops = [...new Set(data.current.map(item => item.crop))];
            
            // Populate dropdown
            crops.forEach(crop => {
                const option = document.createElement('option');
                option.value = crop;
                option.textContent = crop;
                cropSelect.appendChild(option);
            });
            
            // Add event listener for crop selection
            cropSelect.addEventListener('change', function() {
                if (this.value) {
                    // Set default yield based on crop
                    const selectedCrop = this.value;
                    const defaultYields = {
                        'Rice': 20,
                        'Wheat': 18,
                        'Maize': 25,
                        'Sugarcane': 400,
                        'Cotton': 8
                    };
                    
                    const yieldInput = document.getElementById('calculator-yield');
                    if (yieldInput && defaultYields[selectedCrop]) {
                        yieldInput.value = defaultYields[selectedCrop];
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading crop data for calculator:', error);
            cropSelect.innerHTML = '<option value="">Failed to load crops</option>';
        });
    
    // Add event listener for form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const crop = document.getElementById('calculator-crop').value;
        const area = parseFloat(document.getElementById('calculator-area').value);
        const expectedYield = parseFloat(document.getElementById('calculator-yield').value);
        const productionCost = parseFloat(document.getElementById('calculator-cost').value);
        
        if (!crop || isNaN(area) || isNaN(expectedYield) || isNaN(productionCost)) {
            alert('Please fill all fields with valid values');
            return;
        }
        
        // Calculate profit
        calculateProfit(crop, area, expectedYield, productionCost);
    });
}

// Function to calculate profit
function calculateProfit(crop, area, expectedYield, productionCost) {
    const resultContainer = document.getElementById('profit-result');
    resultContainer.innerHTML = '<p>Calculating...</p>';
    
    fetch('market-data.json')
        .then(response => response.json())
        .then(data => {
            // Find the crop price
            const cropData = data.current.find(item => item.crop === crop);
            
            if (!cropData) {
                resultContainer.innerHTML = '<p>Price data not available for the selected crop.</p>';
                return;
            }
            
            const price = cropData.price;
            
            // Calculate total yield and revenue
            const totalYield = area * expectedYield;
            const totalRevenue = totalYield * price;
            const totalCost = area * productionCost;
            const profit = totalRevenue - totalCost;
            const profitPerAcre = profit / area;
            
            // Display results
            resultContainer.innerHTML = `
                <h3>Profit Calculation for ${crop}</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="result-label">Total Yield:</div>
                        <div class="result-value">${totalYield.toFixed(2)} quintals</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Current Market Price:</div>
                        <div class="result-value">₹${price.toFixed(2)}/quintal</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Total Revenue:</div>
                        <div class="result-value">₹${totalRevenue.toLocaleString()}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Total Production Cost:</div>
                        <div class="result-value">₹${totalCost.toLocaleString()}</div>
                    </div>
                    <div class="result-item highlight">
                        <div class="result-label">Estimated Profit:</div>
                        <div class="result-value">₹${profit.toLocaleString()}</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Profit per Acre:</div>
                        <div class="result-value">₹${profitPerAcre.toLocaleString()}</div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error calculating profit:', error);
            resultContainer.innerHTML = '<p>Failed to calculate profit. Please try again later.</p>';
        });
}

// Crop Recommendation Functions
function setupCropRecommendationForm() {
    const form = document.getElementById('recommendation-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const soilType = document.getElementById('soil-type').value;
        const season = document.getElementById('season').value;
        
        if (soilType && season) {
            displayCropRecommendations(soilType, season);
        } else {
            alert('Please select both soil type and season');
        }
    });
}

// Enable print button when recommendations are displayed
function displayCropRecommendations(soilType, season) {
    const container = document.getElementById('recommendations-container');
    const printButton = document.getElementById('print-recommendations');
    container.innerHTML = '';
    
    // Check if we have recommendations for this soil/season combination
    if (sampleRecommendations[soilType] && sampleRecommendations[soilType][season]) {
        const recommendations = sampleRecommendations[soilType][season];
        
        recommendations.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            
            card.innerHTML = `
                <h3>${crop.name}</h3>
                <div class="content">
                    <p><strong>Expected yield:</strong> ${crop.yield}</p>
                    <p><strong>Water requirement:</strong> ${crop.water}</p>
                    <p><strong>Growth period:</strong> ${crop.duration}</p>
                    <p><strong>Current market price:</strong> ₹${crop.price}/quintal</p>
                    <p><small>${crop.description}</small></p>
                </div>
            `;
            
            container.appendChild(card);
        });
        
        // Enable print button
        printButton.disabled = false;
    } else {
        container.innerHTML = '<p>No recommendations available for this soil and season combination. Please try a different selection.</p>';
        // Disable print button
        printButton.disabled = true;
    }
}

// Add print functionality
function setupPrintButton() {
    const printButton = document.getElementById('print-recommendations');
    if (!printButton) return;
    
    printButton.addEventListener('click', function() {
        const soilType = document.getElementById('soil-type').value;
        const season = document.getElementById('season').value;
        
        // Create a new window with just the recommendations
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Crop Recommendations</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #2c6e49; }
                    .card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; }
                    .card h3 { color: #2c6e49; margin-top: 0; }
                </style>
            </head>
            <body>
                <h1>Crop Recommendations</h1>
                <p><strong>Soil Type:</strong> ${soilType.charAt(0).toUpperCase() + soilType.slice(1)}</p>
                <p><strong>Season:</strong> ${season.charAt(0).toUpperCase() + season.slice(1)}</p>
                <div id="recommendations">
        `);
        
        // Add recommendations
        const recommendations = sampleRecommendations[soilType][season];
        recommendations.forEach(crop => {
            printWindow.document.write(`
                <div class="card">
                    <h3>${crop.name}</h3>
                    <p><strong>Expected yield:</strong> ${crop.yield}</p>
                    <p><strong>Water requirement:</strong> ${crop.water}</p>
                    <p><strong>Growth period:</strong> ${crop.duration}</p>
                    <p><strong>Current market price:</strong> ₹${crop.price}/quintal</p>
                    <p>${crop.description}</p>
                </div>
            `);
        });
        
        printWindow.document.write(`
                </div>
                <p><small>Generated on ${new Date().toLocaleDateString()} by Agricultural Market Dashboard</small></p>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Print after a small delay to ensure styles are loaded
        setTimeout(() => {
            printWindow.print();
        }, 500);
    });
}

// Add this function before loadWeatherData
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }),
                error => {
                    console.warn('Error getting location:', error.message);
                    // Default to Bangalore coordinates
                    resolve({ lat: 12.9716, lon: 77.5946 });
                }
            );
        } else {
            console.warn('Geolocation not supported by browser');
            // Default to Bangalore coordinates
            resolve({ lat: 12.9716, lon: 77.5946 });
        }
    });
}

// Then modify loadWeatherData to this
async function loadWeatherData() {
    const currentWeather = document.getElementById('current-weather');
    const weatherForecast = document.getElementById('weather-forecast');
    
    if (!currentWeather || !weatherForecast) return;

    // Set loading state
    currentWeather.innerHTML = '<p>Loading weather data...</p>';
    weatherForecast.innerHTML = '';
    
    try {
        // Get user location
        const location = await getUserLocation();
        const apiKey = '4e3dc91be1a4e75ccf8851a5b8532b00'; // Your API key
        
        // First, get the current weather using the free tier endpoint
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`);
        
        if (!currentResponse.ok) {
            throw new Error('Weather API request failed: ' + currentResponse.statusText);
        }
        
        const currentData = await currentResponse.json();
        
        // Then get 5-day forecast data using the free tier endpoint
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`);
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast API request failed: ' + forecastResponse.statusText);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Display location
        const locationName = currentData.name + ', ' + currentData.sys.country;
        const locationDiv = document.createElement('div');
        locationDiv.className = 'location-display';
        locationDiv.innerHTML = `<h3>Weather for ${locationName}</h3>`;
        currentWeather.innerHTML = '';
        currentWeather.appendChild(locationDiv);
        
        // Display current weather
        const weatherDiv = document.createElement('div');
        weatherDiv.className = 'current-weather-display';
        
        weatherDiv.innerHTML = `
            <div>
                <div class="weather-temp">${Math.round(currentData.main.temp)}°C</div>
                <div class="weather-desc">${currentData.weather[0].description}</div>
                <div class="weather-details">
                    Humidity: ${currentData.main.humidity}% • Wind: ${Math.round(currentData.wind.speed * 3.6)} km/h
                </div>
            </div>
            <div>
                <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="Weather icon" width="64" height="64">
            </div>
        `;
        
        currentWeather.appendChild(weatherDiv);
        
        // Add farming advisory based on weather
        const advisoryDiv = document.createElement('div');
        advisoryDiv.style.marginTop = '1rem';
        advisoryDiv.style.padding = '0.75rem';
        advisoryDiv.style.backgroundColor = '#f0f8ff';
        advisoryDiv.style.borderRadius = '4px';
        
        let advisoryText = '';
        if (currentData.main.temp > 35) {
            advisoryText = "High temperatures expected. Ensure adequate irrigation for crops.";
        } else if (currentData.main.temp < 10) {
            advisoryText = "Cold conditions expected. Protect sensitive crops from frost.";
        } else if (currentData.rain && currentData.rain['1h'] > 0) {
            advisoryText = "Rain expected. Consider postponing spraying operations.";
        } else {
            advisoryText = "Favorable conditions for general farming activities.";
        }
        
        advisoryDiv.innerHTML = `
            <h4>Farming Advisory:</h4>
            <p>${advisoryText}</p>
        `;
        
        currentWeather.appendChild(advisoryDiv);
        
        // Display forecast
        weatherForecast.innerHTML = '';
        
        // Process the 5-day forecast data
        // Group by day (the API returns data in 3-hour intervals)
        const dailyData = {};
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en-US');
            
            if (!dailyData[day]) {
                dailyData[day] = {
                    temps: [],
                    icons: [],
                    descriptions: [],
                    date: date
                };
            }
            
            dailyData[day].temps.push(item.main.temp);
            dailyData[day].icons.push(item.weather[0].icon);
            dailyData[day].descriptions.push(item.weather[0].description);
        });
        
        // Take the first 4 days from the forecast
        Object.values(dailyData).slice(0, 4).forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            
            const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Calculate min and max temps
            const maxTemp = Math.round(Math.max(...day.temps));
            const minTemp = Math.round(Math.min(...day.temps));
            
            // Get the most common icon and description
            const modeIcon = findMostFrequent(day.icons);
            const modeDesc = findMostFrequent(day.descriptions);
            
            forecastCard.innerHTML = `
                <div>${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${modeIcon}.png" alt="${modeDesc}">
                <div>${maxTemp}° / ${minTemp}°</div>
                <div><small>${modeDesc}</small></div>
            `;
            
            weatherForecast.appendChild(forecastCard);
        });
        
    } catch (apiError) {
        console.error('Weather API error:', apiError);
        currentWeather.innerHTML = '<p>Unable to load weather data. Please try again later.</p>';
    }
}

// Helper function to find the most frequent value in an array
function findMostFrequent(arr) {
    const counts = {};
    let maxCount = 0;
    let maxItem = null;
    
    for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > maxCount) {
            maxCount = counts[item];
            maxItem = item;
        }
    }
    
    return maxItem;
}

// Helper Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}