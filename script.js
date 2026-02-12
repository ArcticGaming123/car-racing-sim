const startButton = document.getElementById("startRace");
const raceTrack = document.getElementById("raceTrack");
const winnerDisplay = document.getElementById("winnerDisplay");
const modeSelect = document.getElementById("modeSelect");
const raceCountContainer = document.getElementById("raceCountContainer");

modeSelect.addEventListener("change", () => {
    if (modeSelect.value === "season") {
        raceCountContainer.style.display = "block";
    } else {
        raceCountContainer.style.display = "none";
    }
});

startButton.addEventListener("click", startRace);

let championshipData = null; // Persistent for Competitive Season

function startRace() {
    raceTrack.innerHTML = "";
    winnerDisplay.innerHTML = "";

    const input = document.getElementById("nameInput").value.trim();
    if (!input) {
        alert("Please enter at least one racer name!");
        return;
    }

    let names = input.split("\n").map(n => n.trim()).filter(n => n !== "");
    if (names.length > 10) {
        alert("Maximum 10 racers allowed!");
        return;
    }

    const mode = modeSelect.value;

    if (mode === "quick") {
        startQuickRace(names);
    } else if (mode === "season") {
        let raceCount = parseInt(document.getElementById("raceCount").value);
        if (isNaN(raceCount) || raceCount < 3 || raceCount > 10) {
            alert("Please choose 3–10 races!");
            return;
        }
        startCompetitiveSeason(names, raceCount);
    }
}

// ---------------- Quick Race ----------------
function startQuickRace(names) {
    race(names, false);
}

// ---------------- Competitive Season ----------------
function startCompetitiveSeason(names, totalRaces) {
    championshipData = {
        names: names,
        totalRaces: totalRaces,
        currentRace: 1,
        points: names.reduce((acc, name) => { acc[name] = 0; return acc; }, {})
    };
    runNextSeasonRace();
}

function runNextSeasonRace() {
    winnerDisplay.innerHTML = `🏁 Race ${championshipData.currentRace} of ${championshipData.totalRaces}`;
    race(championshipData.names, true);
}

function race(names, isSeason) {
    raceTrack.innerHTML = "";

    const trackWidth = raceTrack.clientWidth - 120;
    const cars = [];
    const results = [];
    let finishedCars = 0;

    names.forEach(name => {
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

            let randomChange = (Math.random() - 0.5) * 0.5;
            car.speed += randomChange;
            if (car.speed < 1) car.speed = 1;
            if (car.speed > 6) car.speed = 6;

            car.position += car.speed;
            car.element.style.left = car.position + "px";

            if (!car.finished && car.position >= trackWidth) {
                car.finished = true;
                finishedCars++;
                results.push(car.name);
            }
        });

        if (finishedCars === cars.length) {
            clearInterval(raceInterval);

            if (!isSeason) {
                showResults(results);
            } else {
                // Assign points
                results.forEach((name, index) => {
                    let pts = 0;
                    if (index === 0) pts = 10;
                    else if (index === 1) pts = 7;
                    else if (index === 2) pts = 5;
                    else pts = 3;
                    championshipData.points[name] += pts;
                });

                // Show race results briefly
                showRaceResults(results);
            }
        }
    }, 20);
}

// ---------------- Show Quick Race Results ----------------
function showResults(results) {
    raceTrack.innerHTML = "";
    const resultsScreen = document.createElement("div");
    resultsScreen.classList.add("resultsScreen");
    resultsScreen.innerHTML = "<h2>🏁 Race Results</h2>";

    results.forEach((name, index) => {
        const place = document.createElement("div");
        place.innerText = `${index + 1}. ${name}`;
        resultsScreen.appendChild(place);
    });

    raceTrack.appendChild(resultsScreen);
}

// ---------------- Show Race Results During Season ----------------
function showRaceResults(results) {
    raceTrack.innerHTML = "";
    const resultsScreen = document.createElement("div");
    resultsScreen.classList.add("resultsScreen");
    resultsScreen.innerHTML = `<h2>🏁 Race ${championshipData.currentRace} Results</h2>`;

    results.forEach((name, index) => {
        const place = document.createElement("div");
        place.innerText = `${index + 1}. ${name} (+${index <= 2 ? [10,7,5][index]:3} pts)`;
        resultsScreen.appendChild(place);
    });

    // Leaderboard
    const leaderboard = document.createElement("div");
    leaderboard.innerHTML = "<h3>🏆 Leaderboard</h3>";
    const sorted = Object.entries(championshipData.points).sort((a,b) => b[1]-a[1]);
    sorted.forEach(([name, pts], idx) => {
        const entry = document.createElement("div");
        entry.innerText = `${idx+1}. ${name} - ${pts} pts`;
        leaderboard.appendChild(entry);
    });

    resultsScreen.appendChild(leaderboard);
    raceTrack.appendChild(resultsScreen);

    // Wait 3 seconds then move to next race / final screen
    setTimeout(() => {
        championshipData.currentRace++;
        if (championshipData.currentRace > championshipData.totalRaces) {
            showChampion();
        } else {
            runNextSeasonRace();
        }
    }, 3000);
}

// ---------------- Show Champion ----------------
function showChampion() {
    raceTrack.innerHTML = "";
    const resultsScreen = document.createElement("div");
    resultsScreen.classList.add("resultsScreen");
    resultsScreen.innerHTML = "<h2>🏆 Championship Complete!</h2>";

    const sorted = Object.entries(championshipData.points).sort((a,b) => b[1]-a[1]);
    sorted.forEach(([name, pts], idx) => {
        const entry = document.createElement("div");
        entry.innerText = `${idx+1}. ${name} - ${pts} pts`;
        if (idx === 0) entry.style.fontWeight = "bold";
        resultsScreen.appendChild(entry);
    });

    raceTrack.appendChild(resultsScreen);
    championshipData = null; // Reset
}

function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
