let addresses = [];

function addAddress() {
    const address = document.getElementById("addressInput").value;
    if (address !== "") {
        addresses.push(address);
        updateAddressList();
        document.getElementById("addressInput").value = "";
    }
}

function updateAddressList() {
    const list = document.getElementById("addressList");
    list.innerHTML = "";
    addresses.forEach((address, index) => {
        list.innerHTML += `<li>${address} <button class="delete" onclick="deleteAddress(${index})">Eliminar</button></li>`;
    });
}

function deleteAddress(index) {
    addresses.splice(index, 1);
    updateAddressList();
}

function finalizeRoute() {
    console.log("Direcciones:", addresses);
    // Aquí enviarías las direcciones a la API para optimizar la ruta
}
