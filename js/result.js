const domElements = {
    // Top Section
    songTitle: document.querySelector('.top-bar .song-info h1'),
    songDifficulty: document.querySelector('.top-bar .song-info span'),

    // Center Section
    grade: document.querySelector('.center-section .grade'),
    grade_id: document.getElementById('grade'),
    score: document.querySelector('.center-section .score'),
    rate: document.querySelector('.center-section .rate'),

    // Left Section
    maxCombo: document.querySelector('.left-panel ul li:nth-child(1) span'),
    totalCombo: document.querySelector('.left-panel ul li:nth-child(2) span'),
    perfects: document.querySelector('.left-panel ul li:nth-child(3) span'),
    successes: document.querySelector('.left-panel ul li:nth-child(4) span'),
    bads: document.querySelector('.left-panel ul li:nth-child(5) span'),
    fails: document.querySelector('.left-panel ul li:nth-child(6) span'),

    // Right Section
    globalRank: document.querySelector('.right-panel .ranking-details p:nth-child(1) span'),
    scoreRank: document.querySelector('.right-panel .ranking-details p:nth-child(2) span'),

    // Action Buttons
    mainMenuBtn: document.querySelector('.action-buttons .main-menu-btn'),
    replayBtn: document.querySelector('.action-buttons .replay-btn')
};

// localStorage에서 값 읽어오기
const score = localStorage.getItem('score');
const rate = localStorage.getItem('rate');
const maxCombo = localStorage.getItem('maxCombo');
const totalCombo = localStorage.getItem('totalCombo');
const perfectCount = localStorage.getItem('perfectCount');
const goodCount = localStorage.getItem('goodCount');
const badCount = localStorage.getItem('badCount');
const missCount = localStorage.getItem('missCount');

// DOM 요소에 값 설정하기
updateRatingDisplay(rate);
domElements.score.textContent = `${score}점`;
domElements.rate.textContent = `${rate}%`;
domElements.maxCombo.textContent = maxCombo;
domElements.totalCombo.textContent = totalCombo;
domElements.perfects.textContent = perfectCount;
domElements.successes.textContent = goodCount;
domElements.bads.textContent = badCount;
domElements.fails.textContent = missCount;

function getRating(rate) {
    const numericRate = parseFloat(rate);

    if (isNaN(numericRate)) {
        return { label: "Invalid", gradient: "linear-gradient(45deg, #000, #000)" }; // Black for invalid
    }

    if (numericRate === 100) {
        return { label: "SSS", gradient: "linear-gradient(45deg, #8A2BE2, #FF69B4, #00FFFF)" }; // Purple base gradient
    } else if (numericRate >= 95) {
        return { label: "SS", gradient: "linear-gradient(45deg, #FFD700, #FF6347, #FF4500)" }; // Gold gradient
    } else if (numericRate >= 90) {
        return { label: "S", gradient: "linear-gradient(45deg, #FFD700, #FFFFFF)" }; // Gold to white gradient
    } else if (numericRate >= 80) {
        return { label: "A", gradient: "linear-gradient(45deg, #FF4500, #FF6347)" }; // Red to orange gradient
    } else if (numericRate >= 70) {
        return { label: "B", gradient: "#1967D2" }; // Solid blue
    } else if (numericRate >= 50) {
        return { label: "C", gradient: "#008000" }; // Solid green
    } else if (numericRate >= 30) {
        return { label: "D", gradient: "#808080" }; // Solid gray
    } else {
        return { label: "E", gradient: "#8B4513" }; // Solid brown
    }
}

function updateRatingDisplay(rate) {
    const gradeElement = document.getElementById('grade');
    const { label, gradient } = getRating(rate);

    gradeElement.textContent = label;
    gradeElement.style.background = gradient;
    gradeElement.style.backgroundClip = 'text';
    gradeElement.style.backgroundSize = '200% 100%'; // Make gradient move
}

//fetchRankings();

// 값 삭제
localStorage.removeItem('score');
localStorage.removeItem('rate');
localStorage.removeItem('maxCombo');
localStorage.removeItem('totalCombo');
localStorage.removeItem('perfectCount');
localStorage.removeItem('goodCount');
localStorage.removeItem('badCount');
localStorage.removeItem('missCount');

domElements.mainMenuBtn.addEventListener('click', () => {
    window.location.href = 'main.html'; // Navigate to the main menu page
});

domElements.replayBtn.addEventListener('click', () => {
    window.location.href = 'rhythm.html'; // Navigate to the replay page
});