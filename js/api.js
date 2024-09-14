require('dotenv').config();
const apiBaseUrl = process.env.API_BASE_URL;

function sendScoreToServer(song, player, score, rate) {
    fetch(`${apiBaseUrl}/submit-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            song: song,
            player: player,
            score: score,
            rate: rate
        })
    })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchRankings() {
    fetch(`${apiBaseUrl}/rankings`)
        .then(response => response.json())
        .then(data => {
            let rankingHtml = '';
            data.forEach((rank, index) => {
                rankingHtml += `<li>${index + 1}. ${rank.player} - ${rank.score}점, rate: ${rank.rate}%</li>`;
            });
            document.getElementById('ranking-list').innerHTML = rankingHtml;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}