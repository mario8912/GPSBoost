let addresses = []; // Array para almacenar las direcciones
let autocomplete;

// Inicializa el autocompletado
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("addressInput"),
        { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
            addAddress(place.formatted_address);
        }
    });

    // Autocompletar para la oficina de correos
    const officeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById("officeInput"),
        { types: ["geocode"] }
    );

    officeAutocomplete.addListener("place_changed", () => {
        const place = officeAutocomplete.getPlace();
        if (place && place.formatted_address) {
            document.getElementById('officeInput').value = place.formatted_address;
        }
    });
}

// Función para añadir direcciones
function addAddress(address) {
    if (addresses.includes(address)) {
        alert("Esta dirección ya ha sido añadida.");
        return;
    }
    addresses.push(address);
    updateAddressList();
}

// Actualiza la lista de direcciones
function updateAddressList() {
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = ""; // Limpiar sugerencias

    addresses.forEach(address => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.innerText = address;
        div.onclick = () => {
            addAddress(address);
            suggestionsDiv.style.display = "none"; // Ocultar sugerencias después de hacer clic
        };
        suggestionsDiv.appendChild(div);
    });

    if (addresses.length > 0) {
        suggestionsDiv.style.display = "block"; // Mostrar sugerencias si hay direcciones
    } else {
        suggestionsDiv.style.display = "none"; // Ocultar si no hay direcciones
    }

    document.getElementById('addressInput').value = ''; // Limpiar el input de dirección
}

// Función para calcular y mostrar la ruta
function calculateAndDisplayRoute() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const waypoints = addresses.map(address => ({
        location: address,
        stopover: true
    }));

    const origin = document.getElementById('officeInput').value; // Punto de partida
    const destination = origin; // Destino es el mismo que el origen

    directionsService.route(
        {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("No se pudo calcular la ruta: " + status);
            }
        }
    );
}

// Función para finalizar y abrir la ruta en Google Maps
function finalizeRoute() {
    const optimizedRoute = addresses; // Suponiendo que aquí tendrás la ruta optimizada

    // Crear el enlace a Google Maps
    const origin = document.getElementById('officeInput').value;
    const destination = origin;
    const waypoints = optimizedRoute.join("|");

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}`;

    // Abrir el enlace en una nueva pestaña
    window.open(googleMapsUrl, '_blank');

    // Mostrar la ruta optimizada en la página
    const resultDiv = document.getElementById("result");
    
    resultDiv.innerHTML = "<h2><span class='optimized-route'>Ruta Optimizada:</span></h2><ul></ul>";

    const list = resultDiv.querySelector("ul");

    optimizedRoute.forEach(address => {
        list.innerHTML += `<li>${address}</li>`;
    });

    // Calcular y mostrar la ruta en el mapa
    calculateAndDisplayRoute();
}

// Llamar a la función al cargar la página
window.onload = () => {
    initAutocomplete();
};
