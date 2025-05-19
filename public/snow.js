const apiKey = "2f778590e1a19d5fe5535e5acf7973a4";
let snowChart = null;

async function loadResortData() {
    const regions = document.getElementById('region');
    const regionDivs = {};

    await fetch(`/FinalProject`)
        .then((response) => response.json())
        .then(data => {
            data.forEach(element => {
                const region = element.region;

                if (region === 'New Location') {
                    return;
                }

                if(!(region in regionDivs)) {
                    const regionDiv = document.createElement('div');
                    regionDiv.setAttribute('class', 'region-div');
                    const regionName = document.createElement('h3');

                    regionName.textContent = region;
                    regionDiv.append(regionName);

                    regionDivs[region] = regionDiv;
                    regions.append(regionDiv);
                }

                const resortName = document.createElement('p');
                resortName.textContent = element.resort;
                resortName.style.cursor = 'pointer';
                resortName.onclick = function () {
                    loadSnowReport(element.latitude, element.longitude);
                };

                regionDivs[region].append(resortName);
            });
        });
}

window.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('region')) {
        loadResortData();
    }
});

async function loadNewLocationData() {
    const regions = document.getElementById('new-location');
    const regionDivs = {};

    regions.innerHTML = '';

    await fetch(`/FinalProject`)
        .then((response) => response.json())
        .then(data => {
            data.forEach(element => {
                const region = element.region;

                if (region !== 'New Location') {
                    return;
                }

                if(!(region in regionDivs)) {
                    const regionDiv = document.createElement('div');
                    regionDiv.setAttribute('class', 'new-location-div');
                    const regionName = document.createElement('h3');

                    regionName.textContent = region;
                    regionDiv.append(regionName);

                    regionDivs[region] = regionDiv;
                    regions.append(regionDiv);
                }

                const resortName = document.createElement('p');
                resortName.textContent = element.resort;
                resortName.style.cursor = 'pointer';
                resortName.onclick = function () {
                    loadSnowReport(element.latitude, element.longitude);
                };

                regionDivs[region].append(resortName);
            });
        });
}

window.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('new-location')) {
        loadNewLocationData();
    }
});

async function createResort() {
    await fetch(`/FinalProject`, {
        method: 'POST',
        body: JSON.stringify({
            resort: `${document.getElementById('resort').value}`,
            region: 'New Location',
            latitude: `${document.getElementById('latitude').value}`,
            longitude: `${document.getElementById('longitude').value}`,
        }),
        headers: {
            'content-type': 'application/json',
        },
    }).then((response) => response.json());

    await loadNewLocationData();
}

function loadCity() {
    const city = document.getElementById('cityName').value.trim();
    const cityInfo = document.getElementById('cityInfo');
    const snowReport = document.getElementById('snowResults');
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    if(!city) {
        alert('Enter in a resort!');
        return;
    }

    cityInfo.innerHTML = '';
    snowReport.innerHTML = '';
    if(snowChart) {
        snowChart.destroy();
    }

    fetch(url)
        .then((response) => response.json())
        .then(data => {
            data.forEach(element => {
                const cityName = document.createElement('h3');
                cityName.textContent = `${element.name}, ${element.state}, Lat: ${element.lat}, Lon: ${element.lon}`;
                cityName.style.cursor = 'pointer';
                cityName.setAttribute('class', 'city-name')
                cityName.onclick = function () {
                    loadSnowReport(element.lat, element.lon, element.state);
                };
                cityInfo.append(cityName);
            });
        });
}

async function loadSnowReport(lat, lon, state) {
    const snowReport = document.getElementById('snowResults');
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const urlDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const {ctx} = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = options.color || '#99ffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    snowReport.innerHTML = '';
    if(snowChart) {
        snowChart.destroy();
    }

    try {
        const currentResponse = await fetch(urlCurrent);
        const currentData = await currentResponse.json();

        const weather = currentData.weather[0];
        const currentReport = document.createElement('div');
        currentReport.setAttribute('class', 'current-report');

        const cityInfo = document.createElement('h3');
        const weatherInfo = document.createElement('p');

        if(state) {
            cityInfo.textContent = `${currentData.name}, ${state}`;
        } else {
            cityInfo.textContent = `${currentData.name}`;
        }

        let snowInfo;
        let snowInfoAmount;
        if (weather.snow) {
            snowInfoAmount = weather.snow['1h'];
        } else {
            snowInfoAmount = 0;
        }

        if (weather.snow === undefined) {
            snowInfo = 'No Snow &#128557';
        } else {
            snowInfo = `${snowInfoAmount} &#129398`;
        }

        weatherInfo.innerHTML = `
        <strong> Current Weather: </strong>
        <br>
        <strong> Type: </strong> ${weather.main}, 
        <strong> Description: </strong> ${weather.description}, 
        <strong> Snow: </strong> ${snowInfo}`;
        
        currentReport.append(cityInfo);
        currentReport.append(weatherInfo);
        
        snowReport.innerHTML = '';
        snowReport.append(currentReport);

        const dayResponse = await fetch(urlDay);
        const dayData = await dayResponse.json();

        const dates = [];
        const snowAmounts = [];
        const rainAmounts = [];

        dayData.list.forEach(element => {
            let snowAmount;
            let rainAmount; 

            if (element.snow) {
                snowAmount = element.snow['3h'];
            } else {
                snowAmount = 0;
            }

            if (element.rain) {
                rainAmount = element.rain['3h'];
            } else {
                rainAmount = 0;
            }

            dates.push(element.dt_txt);
            snowAmounts.push(snowAmount);
            rainAmounts.push(rainAmount);
        });

        const ctx = document.getElementById('snowChart');
        snowChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Snowfall (mm) based on 5 day / 3 hour forecast',
                    data: snowAmounts,
                    backgroundColor: 'rgb(137, 207, 240)',
                    borderWidth: 1
                }, 
                {
                    label: 'Rain (mm) based on 5 day / 3 hour forecast',
                    data: rainAmounts,
                    backgroundColor: 'rgb(0, 0, 128)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    customCanvasBackgroundColor: {
                        color: 'white',
                    }
                }
            },
            plugins: [plugin]
        });

    } catch(error) {
        console.error(error);
        alert('Error: No weather data!' + error);
    }
}
