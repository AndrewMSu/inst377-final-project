function loadMap() {
    var map = L.map('map').setView([38, -100], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const APIkey = "2f778590e1a19d5fe5535e5acf7973a4";
    const snow = L.OWM.snow({appId: APIkey});
    snow.addTo(map);

}
window.onload = loadMap;