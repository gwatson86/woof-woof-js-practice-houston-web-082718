URL = 'http://localhost:3000/pups';
filterOn = false;

document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderDogBar()
})

document.addEventListener('click', function(event) {
    event.preventDefault();

    if (event.target.className === 'dog-span') {
        fetchAndRenderDogInfo(event.target.dataset.id);
    }
    if (event.target.id === 'good-dog-button') {
        toggleGoodOrBad(event.target.dataset.id);
    }
    if (event.target.id === 'good-dog-filter') {
        toggleFilter();
        toggleOnOrOff();
        fetchAndRenderDogBar();
    }
})

function fetchAndRenderDogBar() {
    fetch(URL)
    .then(response => response.json())
    .then(dogs => filterBadDogs(dogs))
}

function renderDogBar(dogs) {
    let dogBar = document.getElementById('dog-bar');
    dogBar.innerHTML = "";
    dogs.forEach(function(dog) {
        dogBar.innerHTML += `<span class="dog-span" data-id=${dog.id}>${dog.name}</span>`;
    })
}

function fetchAndRenderDogInfo(id) {
    fetch(`${URL}/${id}`)
    .then(response => response.json())
    .then(dog => renderDogInfo(dog))
}

function renderDogInfo(dog) {
    let dogDiv = document.getElementById('dog-info');
    let neutral = goodOrBad(dog);

    dogDiv.innerHTML = "";
    dogDiv.innerHTML =
    `<img src=${dog.image}></img>
    <h2>${dog.name}</h2>
    <button id='good-dog-button' data-id=${dog.id}>${neutral} Dog!</button>`;
}

function goodOrBad(dog) {
    return dog.isGoodDog ? "Good" : "Bad";
}

function toggleGoodOrBad(id) {
    let data = {};
    fetch(`${URL}/${id}`)
    .then(response => response.json())
    .then(dog => {
        if (dog.isGoodDog === true) {
            data = {
                isGoodDog: false
            }
        } else {
            data = {
                isGoodDog: true
            }
        }
        fetch(`${URL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
        .then(response => response.json())
        .then(dog => renderDogInfo(dog))
        .then(fetchAndRenderDogBar)
    })
}

function toggleOnOrOff() {
    let filterButton = document.getElementById('good-dog-filter');
    if (filterButton.innerText.includes("OFF")) {
        filterButton.innerText = "Filter good dogs: ON";
    } else {
        filterButton.innerText = "Filter good dogs: OFF";
    }
}

function filterBadDogs(dogs) {
    if (filterOn) {
        let goodDogs = [];
        dogs.forEach(dog => {
            if (dog.isGoodDog) {
                goodDogs.push(dog)
            }
        })
        renderDogBar(goodDogs);
    } else {
        renderDogBar(dogs);
    }
}

function toggleFilter() {
    if (filterOn) {
        filterOn = false;
    } else {
        filterOn = true;
    }
}