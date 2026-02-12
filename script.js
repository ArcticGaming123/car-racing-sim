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

    const names = input.split("\n").map(name => name.trim()).filter(name => name !== "");

    const trackWidth = raceTrack.clientWidth - 80;
    const cars = [];

    names.forEach((name, index) => {
        const lane = document.createElement("div");
        lane.classList.add("lane");

        const car = document.createElement("div");
        car.classList.add("car");
        car.innerText = name;
        car.style.backgroundColor = getRandomColor();

        lane.appendChild(car);
        raceTrack.appendChild(lane);

        cars.push({
            element: car,
            name: name,
            position: 0,
            speed: Math.random() * 3 + 2
        });
    });

    let raceInterval = setInterval(() => {
        cars.forEach(car => {
            car.position += car.speed;
            car.element.style.left = car.position + "px";

            if (car.position >= trackWidth) {
                clearInterval(raceInterval);
                winnerDisplay.innerHTML = `🏆 Winner: ${car.name}!`;
            }
        });
    }, 20);
}

function getRandomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}
