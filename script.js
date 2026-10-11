let mode = '';
let players = [];
let males = [];
let females = [];
let currentRotation = 0;
let canOpenBox = true;
let playerQueue = [];
let maleQueue = [];
let femaleQueue = [];
let challengeQueue = [];
let selectedChallenge = null;
let selectedPlayerNames = [];
const excludedPlayers = new Map();

// --- DUAL CHALLENGE LISTS ---
const singleChallenges = [
    { text: "Sing a song", shots: 1 }, { text: "Do 10 push-ups", shots: 1 }, { text: "Tell a secret", shots: 1 },
    { text: "Dance for 30 seconds", shots: 1 }, { text: "Imitate someone in the group", shots: 1 },
    { text: "Say a tongue twister", shots: 1 }, { text: "Do a funny pose", shots: 1 }, { text: "Draw something blindfolded", shots: 2 },
    { text: "Hop on one foot", shots: 1 }, { text: "Spin 3 times", shots: 1 }, { text: "Make a funny face", shots: 1 },
    { text: "Recite an alphabet backward", shots: 2 }, { text: "Act like an animal", shots: 1 }, { text: "Whistle a tune", shots: 1 },
    { text: "Clap 10 times", shots: 1 }, { text: "Do 5 squats", shots: 1 }, { text: "Pretend to be a robot", shots: 1 },
    { text: "Say a joke", shots: 1 }, { text: "Do a silly walk", shots: 1 }, { text: "Make an animal sound", shots: 1 },
    { text: "Balance a book on your head", shots: 1 }, { text: "Name five fruits", shots: 1 }, { text: "Speak in a whisper for one minute", shots: 1 },
    { text: "Do a dramatic reading", shots: 1 }, { text: "Make up a short poem", shots: 1 }, { text: "March in place for 20 seconds", shots: 1 },
    { text: "Name three movie titles", shots: 1 }, { text: "Draw a star in the air", shots: 1 }, { text: "Pretend to be a news reporter", shots: 1 },
    { text: "Tell a harmless embarrassing story", shots: 1 }, { text: "Do your best superhero pose", shots: 1 }, { text: "Name four animals that swim", shots: 1 },
    { text: "Hold a statue pose for 30 seconds", shots: 1 }, { text: "Spell your name backward", shots: 2 }, { text: "Make a sound effect for a car", shots: 1 },
    { text: "Give the group a compliment", shots: 1 }, { text: "Pretend to host a cooking show", shots: 1 }, { text: "Do five slow knee lifts", shots: 1 },
    { text: "Name three songs by one artist", shots: 1 }, { text: "Create a new handshake", shots: 1 }, { text: "Act out a sport without speaking", shots: 1 },
    { text: "Say the alphabet with a funny voice", shots: 1 }, { text: "Describe an object without naming it", shots: 1 }, { text: "Do a slow-motion celebration", shots: 1 },
    { text: "Name five colors", shots: 1 }, { text: "Pretend to answer an imaginary phone", shots: 1 }, { text: "Make up a team motto", shots: 1 },
    { text: "Do ten shoulder rolls", shots: 1 }, { text: "Tell the group your favorite snack", shots: 1 },
    { text: "Make up a silly slogan", shots: 1 }
];

// Match Mode contains 25 adult challenges and 25 romantic/playful challenges.
// The queue distributes all 50 exactly once before any challenge repeats.
const adultChallenges = [
    { text: "Kiss your partner's neck", shots: 2 }, { text: "Give a passionate kiss", shots: 2 },
    { text: "Remove one item of clothing", shots: 3 }, { text: "Whisper something naughty", shots: 2 },
    { text: "Nibble your partner's earlobe", shots: 2 }, { text: "Trace a finger along their back", shots: 2 },
    { text: "Give a sensual 1-minute massage", shots: 2 }, { text: "Share a private fantasy", shots: 2 },
    { text: "Spend 5 minutes in private together", shots: 3 }, { text: "Send each other a spicy text", shots: 2 },
    { text: "Re-enact your first kiss", shots: 2 }, { text: "Give a slow, passionate kiss", shots: 2 },
    { text: "Let your partner choose one item to remove", shots: 3 }, { text: "Give a playful bite on the shoulder", shots: 2 },
    { text: "Whisper a seductive compliment", shots: 2 }, { text: "Hold a close embrace for 2 minutes", shots: 1 },
    { text: "Give a gentle kiss on the inner wrist", shots: 2 }, { text: "Describe your most exciting date idea", shots: 2 },
    { text: "Let your partner guide a blindfolded touch", shots: 3 }, { text: "Slow dance while staying very close", shots: 1 },
    { text: "Give three kisses wherever your partner chooses", shots: 2 }, { text: "Share your favorite romantic fantasy", shots: 2 },
    { text: "Give a shoulder and neck massage", shots: 2 }, { text: "Kiss your partner's forehead, then their lips", shots: 2 },
    { text: "Choose a consensual intimate pose for a photo", shots: 2 },
    { text: "Give a 1-minute massage", shots: 1 }, { text: "Hold hands for one minute", shots: 1 },
    { text: "Share a favorite date idea", shots: 1 }, { text: "Slow dance together", shots: 1 },
    { text: "Tell your partner what you admire", shots: 1 }, { text: "Give a gentle forehead kiss", shots: 1 },
    { text: "Share a favorite romantic memory", shots: 1 }, { text: "Let your partner choose a song", shots: 1 },
    { text: "Give a sincere compliment", shots: 1 }, { text: "Say three things you like about your partner", shots: 1 },
    { text: "Make eye contact for 30 seconds", shots: 1 }, { text: "Plan an imaginary weekend getaway", shots: 1 },
    { text: "Recreate a favorite photo pose", shots: 1 }, { text: "Share a harmless secret", shots: 1 },
    { text: "Describe your perfect evening", shots: 1 }, { text: "Choose a nickname for your partner", shots: 1 },
    { text: "Tell a funny dating story", shots: 1 }, { text: "Share a song that reminds you of them", shots: 1 },
    { text: "Let your partner ask one question", shots: 1 }, { text: "Describe your ideal romantic dinner", shots: 1 },
    { text: "Give a gentle cheek kiss", shots: 1 }, { text: "Share a dream for the future", shots: 1 },
    { text: "Do a synchronized dance", shots: 1 }, { text: "Give a warm hug", shots: 1 },
    { text: "Choose a non-alcohol reward", shots: 1 }
];

function shuffledCopy(list) {
    return [...list].sort(() => Math.random() - 0.5);
}

function nextFromQueue(source, queue) {
    if (queue.length === 0) queue.push(...shuffledCopy(source));
    return queue.shift();
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Mode Selection
function setMode(selectedMode) {
    mode = selectedMode;
    
    // Apply the background class to the body
    document.body.classList.remove('single-mode', 'match-mode');
    document.body.classList.add(mode === 'single' ? 'single-mode' : 'match-mode');

    showPage('playerPage');
    let title = mode === 'single' ? 'Enter Player Names (2-19 players)' : 'Enter Male & Female Names';
    document.getElementById('playerPageTitle').innerText = title;
    
    let container = document.getElementById('playerInputs');
    container.innerHTML = '';

    if (mode === 'single') {
        for (let i = 0; i < 3; i++) addPlayerInput();
        container.innerHTML += `<div style="width:100%"><button onclick="addPlayerInput()">+ Add Player</button></div>`;
    } else {
        container.innerHTML += `<div style="width:100%"><h3>Males:</h3><div id="maleInputs"></div><button onclick="addMaleInput()">+ Male</button></div>`;
        container.innerHTML += `<div style="width:100%"><h3>Females:</h3><div id="femaleInputs"></div><button onclick="addFemaleInput()">+ Female</button></div>`;
        for (let i = 0; i < 2; i++) { addMaleInput(); addFemaleInput(); }
    }
}

// Input Helpers
function addPlayerInput() { createInput('playerInput', 'playerInputs', 'Player'); }
function addMaleInput() { createInput('maleInput', 'maleInputs', 'Male'); }
function addFemaleInput() { createInput('femaleInput', 'femaleInputs', 'Female'); }

function createInput(cls, containerId, placeholder) {
    let container = document.getElementById(containerId);
    let count = document.querySelectorAll('.' + cls).length;
    if (count < 19) {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `${placeholder} ${count + 1}`;
        input.className = cls;
        container.appendChild(input);
    }
}

// Start Game
function startGame() {
    players = Array.from(document.querySelectorAll('.playerInput')).map(i => i.value.trim()).filter(v => v !== '');
    males = Array.from(document.querySelectorAll('.maleInput')).map(i => i.value.trim()).filter(v => v !== '');
    females = Array.from(document.querySelectorAll('.femaleInput')).map(i => i.value.trim()).filter(v => v !== '');

    if (mode === 'single' && players.length < 2) return alert("Need at least 2 players");
    if (mode === 'match' && (males.length < 1 || females.length < 1)) return alert("Need at least one of each");

    playerQueue = [];
    maleQueue = [];
    femaleQueue = [];
    challengeQueue = [];
    selectedPlayerNames = [];
    excludedPlayers.clear();
    showPage('spinnerPage');
}

// Spin the Bottle
function spin() {
    const bottle = document.getElementById('bottle');
    const selectedText = document.getElementById('selectedPlayer');
    const openBoxBtn = document.getElementById('openBoxBtn');
    
    openBoxBtn.style.display = 'none';
    selectedText.innerText = "Spinning...";

    const addedRotation = Math.floor(Math.random() * 3600) + 720;
    currentRotation += addedRotation;
    bottle.style.transform = `rotate(${currentRotation}deg)`;

    const spinSound = document.getElementById('spinSound');
    if(spinSound) {
        spinSound.currentTime = 0;
        spinSound.play();
    }

    setTimeout(() => {
        let result = "";
        if (mode === 'single') {
            const player = nextEligiblePlayer(players, playerQueue);
            selectedPlayerNames = [player];
            result = `⭐ ${player} ⭐`;
        } else {
            const m = nextEligiblePlayer(males, maleQueue);
            const f = nextEligiblePlayer(females, femaleQueue);
            selectedPlayerNames = [m, f];
            result = `💙 ${m} & 💖 ${f}`;
        }
        selectedText.innerText = result;
        advanceExclusions();
        openBoxBtn.style.display = 'inline-block';
    }, 3000);
}

function advanceExclusions() {
    excludedPlayers.forEach((rounds, name) => {
        if (rounds <= 1) excludedPlayers.delete(name);
        else excludedPlayers.set(name, rounds - 1);
    });
}

function nextEligiblePlayer(source, queue) {
    const available = source.filter(name => !excludedPlayers.has(name));
    if (available.length === 0) {
        return nextFromQueue(source, queue);
    }

    while (queue.length > 0 && excludedPlayers.has(queue[0])) queue.shift();
    if (queue.length === 0) queue.push(...shuffledCopy(available));
    return queue.shift();
}

// Challenge Grid
function setupChallenges() {
    showPage('challengePage');
    canOpenBox = true;
    const container = document.getElementById('boxContainer');
    const continueBtn = document.getElementById('continueBtn');
    const penaltyText = document.getElementById('penaltyText');
    const skipChallengeBtn = document.getElementById('skipChallengeBtn');
    
    container.innerHTML = '';
    continueBtn.style.display = 'none';
    penaltyText.innerText = '';
    skipChallengeBtn.style.display = 'none';
    skipChallengeBtn.disabled = false;
    closePenaltyModal();

    // --- PICK THE CORRECT LIST BASED ON MODE ---
    const activeList = (mode === 'single') ? singleChallenges : adultChallenges;

    for (let i = 0; i < 50; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.innerText = '?';
        
        box.onclick = function() {
            if (canOpenBox) {
                this.classList.add('opened');
                
                // Select random challenge from the active list
                selectedChallenge = nextFromQueue(activeList, challengeQueue);
                this.innerText = selectedChallenge.text;
                skipChallengeBtn.style.display = 'inline-block';
                
                canOpenBox = false; 
                continueBtn.style.display = 'block'; 
                document.querySelectorAll('.box').forEach(b => {
                    if(!b.classList.contains('opened')) b.classList.add('disabled');
                });
                const boxSound = document.getElementById('boxSound');
                if(boxSound) {
                    boxSound.currentTime = 0;
                    boxSound.play();
                }
            }
        };
        container.appendChild(box);
    }
}

function showPenaltyModal() {
    if (!selectedChallenge) return;

    const shots = selectedChallenge.shots;
    const playerSelect = document.getElementById('banPlayerSelect');
    playerSelect.innerHTML = '';
    selectedPlayerNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.innerText = name;
        playerSelect.appendChild(option);
    });
    updatePenaltyMessage(shots, playerSelect.value);
    playerSelect.onchange = () => updatePenaltyMessage(shots, playerSelect.value);
    document.getElementById('penaltyModal').classList.add('visible');
    document.getElementById('penaltyModal').setAttribute('aria-hidden', 'false');
}

function updatePenaltyMessage(shots, playerName) {
    document.getElementById('penaltyMessage').innerText =
        `This challenge has a ${shots}-shot penalty. If ${playerName} for example refuses, the computer will randomly choose one consequence.`;
}

function closePenaltyModal() {
    const modal = document.getElementById('penaltyModal');
    if (!modal) return;
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
}

function takePenalty() {
    if (!selectedChallenge) return;

    const shots = selectedChallenge.shots;
    document.getElementById('penaltyText').innerText =
        `Penalty accepted: ${shots} shot${shots === 1 ? '' : 's'}.`;
    document.getElementById('skipChallengeBtn').disabled = true;
    document.getElementById('continueBtn').style.display = 'block';
    closePenaltyModal();
}

function randomizeRefusal() {
    const playerName = document.getElementById('banPlayerSelect').value;
    if (!playerName) return;

    const consequence = Math.random() < 0.5 ? 'item' : 'sitOut';
    const message = consequence === 'item'
        ? `${playerName} must voluntarily give up one personal item permanently. The item is not returned.`
        : `${playerName} will sit out for the next 15 rounds.`;

    if (!confirm(`${message}\n\nConfirm that ${playerName} agrees to this consequence?`)) return;

    if (consequence === 'sitOut') excludedPlayers.set(playerName, 15);
    document.getElementById('penaltyText').innerText = message;
    document.getElementById('skipChallengeBtn').disabled = true;
    document.getElementById('continueBtn').style.display = 'block';
    closePenaltyModal();
}

function nextRound() {
    document.getElementById('selectedPlayer').innerText = '';
    document.getElementById('openBoxBtn').style.display = 'none';
    selectedChallenge = null;
    selectedPlayerNames = [];
    closePenaltyModal();
    showPage('spinnerPage');
}

function resetToHome() {
    if (confirm("Are you sure you want to reset? This will delete all names.")) {
        players = []; males = []; females = [];
        playerQueue = []; maleQueue = []; femaleQueue = []; challengeQueue = [];
        selectedChallenge = null;
        selectedPlayerNames = [];
        excludedPlayers.clear();
        closePenaltyModal();
        currentRotation = 0;
        document.getElementById('bottle').style.transform = `rotate(0deg)`;
        document.getElementById('selectedPlayer').innerText = "";
        document.getElementById('openBoxBtn').style.display = 'none';
        document.body.classList.remove('single-mode', 'match-mode');
        showPage('startPage');
    }
}