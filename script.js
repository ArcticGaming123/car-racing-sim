const startButton = document.getElementById("startRace");
const raceTrack = document.getElementById("raceTrack");
const winnerDisplay = document.getElementById("winnerDisplay");

startButton.addEventListener("click", startRace);

function startRace() {
    raceTrack.innerHTML = "";
    winnerDisplay.innerHTML = "";

    const input = document.getElementById("nameInput").value.trim();
    if (!input) {
        alert("Please enter at least one racer name!");
        return;
    }

    const names = input
        .split("\n")
        .map(name => name.trim())
        .filter(name => name !== "");

    const trackWidth = raceTrack.clientWidth - 120;
    const cars = [];
    const results = [];
    let finishedCars = 0;

    names.forEach((name) => {

        const lane = document.createElement("div");
        lane.classList.add("lane");

        const car = document.createElement("div");
        car.classList.add("car");

        const carBody = document.createElement("div");
        carBody.classList.add("car-body");
        carBody.style.backgroundColor = getRandomColor();

        const windshield = document.createElement("div");
        windshield.classList.add("windshield");

        const wheelFront = document.createElement("div");
        wheelFront.classList.add("wheel", "front");

        const wheelBack = document.createElement("div");
        wheelBack.classList.add("wheel", "back");

        const nameLabel = document.createElement("div");
        nameLabel.classList.add("car-name");
        nameLabel.innerText = name;

        carBody.appendChild(windshield);
        carBody.appendChild(wheelFront);
        carBody.appendChild(wheelBack);

        car.appendChild(nameLabel);
        car.appendChild(carBody);

        lane.appendChild(car);
        raceTrack.appendChild(lane);

        cars.push({
            element: car,
            name: name,
            position: 0,
            speed: Math.random() * 2 + 2,
            finished: false
        });
    });

    let raceInterval = setInterval(() => {

        cars.forEach(car => {

            if (car.finished) return;

            // Random speed change
            let randomChange = (Math.random() - 0.5) * 0.5;
            car.speed += randomChange;

            if (car.speed < 1) car.speed = 1;
            if (car.speed > 6) car.speed = 6;

            car.position += car.speed;
            car.element.style.left = car.position + "px";

            if (car.position >= trackWidth) {
                car.finished = true;
                finishedCars++;
                results.push(car.name);
            }

        });

        if (finishedCars === cars.length) {
            clearInterval(raceInterval);
            showResults(results);
        }

    }, 20);
}

function showResults(results) {

    raceTrack.innerHTML = "";

    const resultsScreen = document.createElement("div");
    resultsScreen.style.marginTop = "30px";
    resultsScreen.innerHTML = "<h2>🏁 Race Results</h2>";

    results.forEach((name, index) => {
        const place = document.createElement("div");
        place.style.fontSize = "20px";
        place.style.margin = "10px";
        place.innerText = `${index + 1}. ${name}`;
        resultsScreen.appendChild(place);
    });

    raceTrack.appendChild(resultsScreen);
}

function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
