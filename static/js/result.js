const domElements = {
    // Top Section
    songTitle: document.querySelector('.top-bar .song-info h1'),
    songDifficulty: document.querySelector('.top-bar .song-info span'),

    // Center Section
    grade: document.querySelector('.center-section .grade'),
    score: document.querySelector('.center-section .score'),
    accuracy: document.querySelector('.center-section .accuracy'),

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

domElements.mainMenuBtn.addEventListener('click', () => {
    window.location.href = '../templates/main.html'; // Navigate to the main menu page
});

domElements.replayBtn.addEventListener('click', () => {
    window.location.href = '../templates/rhythm.html'; // Navigate to the replay page
});