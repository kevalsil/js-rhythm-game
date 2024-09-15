// 샘플 곡 데이터 (실제로는 서버에서 가져올 데이터)
const songs = [
    { id: 1, title: "예시1", artist: "--", difficulty: "MAXIMUM", bpm: 210, thumbnail: "https://example.com/-.jpg" },
    { id: 2, title: "예시2", artist: "--", difficulty: "HARD", bpm: 128, thumbnail: "https://example.com/--.jpg" },
    { id: 3, title: "예시3", artist: "--", difficulty: "NORMAL", bpm: 175, thumbnail: "https://example.com/---.jpg" },
    // 더 많은 곡 추가...
];

let selectedIndex = 0;

localStorage.removeItem('scoreSubmitted');

// localStorage에 저장된 닉네임 확인
let nickname = localStorage.getItem('player');

if (!nickname) {
    // 닉네임이 없으면 fetch로 가져와서 닉네임 생성 후 저장
    fetch('https://raw.githubusercontent.com/kevalsil/js-random-nickname-generator/main/randomNicknameGenerator.js')
        .then(response => response.text())
        .then(scriptContent => {
            eval(scriptContent);
            nickname = getRandomNickname();
            
            // 닉네임을 localStorage에 저장
            localStorage.setItem('player', nickname);
            console.log('새 닉네임 생성:', nickname);
        })
        .catch(error => console.error('닉네임 생성기 가져오기 오류:', error));
} else {
    console.log('기존 닉네임 유지:', nickname);
}

function renderSongs() {
    const songList = document.getElementById('songs');
    songList.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.classList.toggle('selected', index === selectedIndex);
        li.addEventListener('click', () => selectSong(index));
        songList.appendChild(li);
    });
    updateSongInfo();
}

function updateSongInfo() {
    const song = songs[selectedIndex];
    document.getElementById('song-thumbnail').src = song.thumbnail;
    document.getElementById('song-title').textContent = song.title;
    document.getElementById('song-artist').textContent = `Artist: ${song.artist}`;
    document.getElementById('song-difficulty').textContent = `Difficulty: ${song.difficulty}`;
    document.getElementById('song-bpm').textContent = `BPM: ${song.bpm}`;
}

function selectSong(index) {
    selectedIndex = index;
    renderSongs();
}

function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
        selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : songs.length - 1;
    } else if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex < songs.length - 1) ? selectedIndex + 1 : 0;
    } else if (e.key === 'Enter') {
        startGame();
    }
    renderSongs();
}

function startGame() {
    const selectedSong = songs[selectedIndex];
    alert(`이 모드로 시작하시겠습니까?: ${selectedSong.title}`);

    // 노래 정보(임시)
    localStorage.setItem('song', 'RNL15105'); //랜덤노트(RN) + 롱노트 있음(L) / 노트속도(150)/ 노트개수(100) / 체력난이도(1~9) (기본값: 5) /

    window.location.href = 'rhythm.html'
}

document.addEventListener('keydown', handleKeyDown);
document.getElementById('up-button').addEventListener('click', () => handleKeyDown({ key: 'ArrowUp' }));
document.getElementById('down-button').addEventListener('click', () => handleKeyDown({ key: 'ArrowDown' }));

// 초기 렌더링
renderSongs();