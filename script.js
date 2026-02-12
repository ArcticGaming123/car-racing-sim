const startButton = document.getElementById("startRace");
const raceTrack = document.getElementById("raceTrack");
const winnerDisplay = document.getElementById("winnerDisplay");
const modeSelect = document.getElementById("modeSelect");
const raceCountContainer = document.getElementById("raceCountContainer");

modeSelect.addEventListener("change", () => {
    raceCountContainer.style.display = modeSelect.value === "season" ? "block" : "none";
});

startButton.addEventListener("click", startRace);

let championshipData = null;

function startRace() {
    raceTrack.innerHTML = "";
    winnerDisplay.innerHTML = "";

    const input = document.getElementById("nameInput").value.trim();
    if (!input) {
        alert("Please enter at least one racer name!");
        return;
    }

    let names = input.split("\n").map(n => n.trim()).filter(n => n !== "");
    if (names.length > 10) { alert("Max 10 racers!"); return; }

    const mode = modeSelect.value;
    if (mode === "quick") startQuickRace(names);
    else {
        let raceCount = parseInt(document.getElementById("raceCount").value);
        if (isNaN(raceCount) || raceCount < 3 || raceCount > 10) {
            alert("Choose 3–10 races!");
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
        names,
        totalRaces,
        currentRace: 1,
        points: names.reduce((acc, name) => { acc[name] = 0; return acc; }, {})
    };
    runNextSeasonRace();
}

function runNextSeasonRace() {
    winnerDisplay.innerHTML = `🏁 Race ${championshipData.currentRace} of ${championshipData.totalRaces}`;
    race(championshipData.names, true);
}

// ---------------- Race Function ----------------
function race(names, isSeason) {
    raceTrack.innerHTML = "";

    // Add finish line
    const finish = document.createElement("div");
    finish.classList.add("finishLine");
    raceTrack.appendChild(finish);

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
            name,
            position: 0,
            speed: Math.random() * 2 + 2,
            finished: false
        });
    });

    let raceInterval = setInterval(() => {
        cars.forEach(car => {
            if (car.finished) return;

            // Speed variation
            car.speed += (Math.random() - 0.5) * 0.5;
            car.speed = Math.min(Math.max(car.speed, 1), 6);

            car.position += car.speed;
            car.element.style.left = car.position + "px";
            car.element.style.transform = `rotate(${car.speed * 2}deg)`; // slight tilt

            if (!car.finished && car.position >= trackWidth) {
                car.finished = true;
                finishedCars++;
                results.push(car.name);
            }
        });

        if (finishedCars === cars.length) {
            clearInterval(raceInterval);

            if (!isSeason) showResults(results);
            else {
                results.forEach((name, index) => {
                    const pts = index === 0 ? 10 : index === 1 ? 7 : index === 2 ? 5 : 3;
                    championshipData.points[name] += pts;
                });
                showRaceResults(results);
            }
        }
    }, 20);
}

// ---------------- Quick Race Results ----------------
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

    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart";
    restartBtn.onclick = () => location.reload();
    resultsScreen.appendChild(restartBtn);

    raceTrack.appendChild(resultsScreen);
}

// ---------------- Season Race Results ----------------
function showRaceResults(results) {
    raceTrack.innerHTML = "";
    const resultsScreen = document.createElement("div");
    resultsScreen.classList.add("resultsScreen");
    resultsScreen.innerHTML = `<h2>🏁 Race ${championshipData.currentRace} Results</h2>`;

    results.forEach((name, index) => {
        const pts = index === 0 ? 10 : index === 1 ? 7 : index === 2 ? 5 : 3;
        const place = document.createElement("div");
        place.innerText = `${index + 1}. ${name} (+${pts} pts)`;
        resultsScreen.appendChild(place);
    });

    // Leaderboard
    const leaderboard = document.createElement("div");
    leaderboard.innerHTML = "<h3>🏆 Leaderboard</h3>";
    const sorted = Object.entries(championshipData.points).sort((a,b) => b[1]-a[1]);
    sorted.forEach(([name, pts], idx) => {
        const entry = document.createElement("div");
        entry.innerText = `${idx + 1}. ${name} - ${pts} pts`;
        leaderboard.appendChild(entry);
    });
    resultsScreen.appendChild(leaderboard);
    raceTrack.appendChild(resultsScreen);

    setTimeout(() => {
        championshipData.currentRace++;
        if (championshipData.currentRace > championshipData.totalRaces) showChampion();
        else runNextSeasonRace();
    }, 3000);
}

// ---------------- Champion Screen with Confetti ----------------
function showChampion() {
    raceTrack.innerHTML = "";

    const resultsScreen = document.createElement("div");
    resultsScreen.classList.add("resultsScreen");
    resultsScreen.innerHTML = "<h2>🏆 Championship Complete!</h2>";

    const sorted = Object.entries(championshipData.points).sort((a,b) => b[1]-a[1]);
    sorted.forEach(([name, pts], idx) => {
        const entry = document.createElement("div");
        entry.innerText = `${idx + 1}. ${name} - ${pts} pts`;
        if (idx === 0) entry.style.fontWeight = "bold";
        resultsScreen.appendChild(entry);
    });

    // Add restart button
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Restart Championship";
    restartBtn.onclick = () => location.reload();
    resultsScreen.appendChild(restartBtn);

    raceTrack.appendChild(resultsScreen);

    // Confetti effect
    launchConfetti();

    championshipData = null;
}

// ---------------- Confetti ----------------
function launchConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti");
    document.body.appendChild(confettiContainer);

    for(let i=0;i<150;i++){
        const conf = document.createElement("div");
        conf.style.position = "absolute";
        conf.style.width = "10px";
        conf.style.height = "10px";
        conf.style.backgroundColor = getRandomColor();
        conf.style.left = Math.random()*window.innerWidth+"px";
        conf.style.top = "-10px";
        conf.style.opacity = 0.8;
        conf.style.transform = `rotate(${Math.random()*360}deg)`;
        conf.style.borderRadius = "50%";
        conf.style.animation = `fall ${2 + Math.random()*2}s linear forwards`;
        conf.style.animationDelay = `${Math.random()*1}s`;
        conf.style.zIndex = 9999;

        conf.style.position = "absolute";
        conf.style.pointerEvents = "none";
        conf.style.animationName = "fall";
        conf.style.animationDuration = `${2+Math.random()*2}s`;

        confettiContainer.appendChild(conf);
    }

    setTimeout(()=>{document.body.removeChild(confettiContainer)},5000);
}

function getRandomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

/* Confetti animation keyframes */
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
    0% {transform: translateY(0) rotate(0deg);}
    100% {transform: translateY(600px) rotate(360deg);}
}`;
document.head.appendChild(style);
