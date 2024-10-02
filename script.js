let correosOfficeSpan = document.getElementById("correosOfficeSpan")
let addresses = []; // Array para almacenar las direcciones
let autocomplete;

const correosOfficeAdressInput = document.getElementById("officeInput");
correosOfficeAdressInput.value = "Carrer Pere el Ceremonios, 4, 12560 Benicàssim, Castelló"
// Evento blur para manejar cuando la oficina de correos pierde el foco
correosOfficeAdressInput.addEventListener('blur', handleBlur);

function handleBlur() {
    let correosOfficeAdressInputValue = correosOfficeAdressInput.value;

    if (correosOfficeAdressInputValue != "") {
        // Inserta el título "Oficina de Correos" y el valor ingresado si no existe ya
            correosOfficeSpan.innerText = correosOfficeAdressInputValue
    }
}

// Inicializa el autocompletado para el input de direcciones y el input de oficina de correos
function initAutocomplete() {
    // Autocompletar para el input de direcciones
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
            handleBlur(); // Llama a la función handleBlur después de seleccionar la dirección
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

    addresses.forEach((address, index) => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        
        // Crear el texto de la dirección
        div.innerText = address;

        // Crear el botón de eliminar
        const removeButton = document.createElement("button");
        removeButton.innerHTML = '<img src="ico/remove.png" alt="Eliminar" style="width: 12px; height: 12px;"/> '; // Icono de cruz
        removeButton.onclick = () => {
            removeAddress(index); // Llama a la función para eliminar la dirección
        };

        removeButton.style.background = 'transparent'; // Fondo transparente
        removeButton.style.border = 'none'; // Sin borde
        removeButton.style.cursor = 'pointer'; // Cambia el cursor al pasar el ratón
        removeButton.style.marginLeft = '6px'; // Cambia el cursor al pasar el ratón

        // Añadir el texto y el botón al div
        div.appendChild(removeButton);
        suggestionsDiv.appendChild(div);
    });

    if (addresses.length > 0) {
        suggestionsDiv.style.display = "block"; // Mostrar sugerencias si hay direcciones
    } else {
        suggestionsDiv.style.display = "none"; // Ocultar si no hay direcciones
    }

    document.getElementById('addressInput').value = '';
}

// Función para eliminar una dirección
function removeAddress(index) {
    addresses.splice(index, 1); // Elimina la dirección del array
    updateAddressList(); // Actualiza la lista de direcciones
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
    resultDiv.style.display = "block"
    resultDiv.innerHTML = "<h3><span class='optimized-route'>Ruta Optimizada:</span></h3><ul></ul>";

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
