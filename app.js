const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const url2 = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
const key = '&key=AIzaSyDHcVGI8CyLBANatV-Y3ESj2Zk8i3Ac6lQ';

const getLatLng = (address) => {
    fetch(url + address + key)
    .then((resp) => resp.json())
  .then((data) => {
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;

    document.getElementById('latitude').innerHTML = `Latitude: ${lat}`;
    document.getElementById('longitude').innerHTML = `Longitude: ${lng}`;

    getCity(`${lat}, ${lng}`);
  });
}

const getCity = (latlng) => {
    console.log(latlng);
    fetch(url2 + latlng + key) //+ '&result_type=locality'
    .then((resp) => resp.json())
    .then((data) => {

        console.log(data);

        let city = undefined;
        let country = undefined

        data.results.forEach((result) => {
            if (!city && result.types[0] === 'locality') {
                result.address_components.forEach((component) => {
                    if (component.types[0] === 'locality') {
                        city = component.long_name;
                    }
                })
            }

            if (!country && result.types[0] === 'country') {
                country = result.formatted_address;
            }
        })

        // const city = data.results[0].address_components[2].long_name;
        // const country = data.results[0].address_components[5].long_name;

        document.getElementById('city').innerHTML = `City: ${city}`;
        document.getElementById('country').innerHTML = `Country: ${country}`;
    });
}

//getLatLng();

document.getElementById('text-search').onclick = () => {
    let address = document.getElementById('search-input').value;
    address = address.split(' ').join('+');
    if (address.length > 0) {
        getLatLng(address)
    } else {
        alert('Please enter an address');
    }
};

document.getElementById('current-search').onclick = () => {
    if (!navigator.geolocation) {
        document.getElementById('latitude').innerHTML = "<p>Geolocation is not supported by your browser</p>";
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);

            document.getElementById('latitude').innerHTML = `Latitude: ${lat}`;
            document.getElementById('longitude').innerHTML = `Longitude: ${lng}`;

            getCity(`${lat}, ${lng}`);
        });
    }
};