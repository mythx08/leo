// --- Page Transitions ---
function showPageTransition() {
  let overlay = document.querySelector('.page-transition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'linear-gradient(120deg, #ffe5ec 0%, #e0bbff 100%)';
    overlay.style.zIndex = 1000;
    overlay.style.opacity = 0;
    overlay.style.transition = 'opacity 0.5s';
    document.body.appendChild(overlay);
  }
  overlay.style.opacity = 1;
  setTimeout(() => { overlay.style.opacity = 0; }, 500);
}
// Animate on navigation
[...document.querySelectorAll('a, .start-btn, .next-btn, .back-btn')].forEach(el => {
  if (el.href && el.target !== '_blank') {
    el.addEventListener('click', e => {
      if (el.classList.contains('start-btn') || el.classList.contains('next-btn') || el.classList.contains('back-btn')) {
        showPageTransition();
      }
    });
  }
});
// --- Floating Sparkles ---
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = Math.random() * 100 + 'vw';
  sparkle.style.top = (80 + Math.random() * 20) + 'vh';
  sparkle.style.animationDuration = (5 + Math.random() * 4) + 's';
  document.querySelector('.bg-decor')?.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 9000);
}
if (!document.querySelector('.bg-decor')) {
  const decor = document.createElement('div');
  decor.className = 'bg-decor';
  document.body.appendChild(decor);
}
setInterval(createSparkle, 900);
// --- Floating Music Player ---
function setupMusicPlayer() {
  if (!music) return;
  let player = document.querySelector('.music-player');
  if (!player) {
    player = document.createElement('div');
    player.className = 'music-player';
    player.innerHTML = `
      <button id="music-play">&#9654;</button>
      <div class="progress"><div class="progress-bar"></div></div>
      <span id="music-time">0:00</span>
    `;
    document.body.appendChild(player);
  }
  const playBtn = player.querySelector('#music-play');
  const progress = player.querySelector('.progress');
  const bar = player.querySelector('.progress-bar');
  const time = player.querySelector('#music-time');
  function updateProgress() {
    if (!music.duration) return;
    bar.style.width = ((music.currentTime / music.duration) * 100) + '%';
    const min = Math.floor(music.currentTime / 60);
    const sec = Math.floor(music.currentTime % 60).toString().padStart(2, '0');
    time.textContent = `${min}:${sec}`;
  }
  music.addEventListener('timeupdate', updateProgress);
  playBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      playBtn.innerHTML = '&#10073;&#10073;';
      playBtn.classList.add('active');
    } else {
      music.pause();
      playBtn.innerHTML = '&#9654;';
      playBtn.classList.remove('active');
    }
  });
  music.addEventListener('play', () => {
    playBtn.innerHTML = '&#10073;&#10073;';
    playBtn.classList.add('active');
  });
  music.addEventListener('pause', () => {
    playBtn.innerHTML = '&#9654;';
    playBtn.classList.remove('active');
  });
  progress.addEventListener('click', e => {
    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    music.currentTime = percent * music.duration;
  });
  updateProgress();
}
window.addEventListener('DOMContentLoaded', setupMusicPlayer);
// --- Animate Main Content Entrance ---
window.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.landing-content, .letter-container, .about-container, .wishes-container');
  if (main) {
    main.style.opacity = 0;
    main.style.transform = 'translateY(40px) scale(0.98)';
    setTimeout(() => {
      main.style.transition = 'opacity 0.8s cubic-bezier(.6,.2,.2,1.1), transform 0.8s cubic-bezier(.6,.2,.2,1.1)';
      main.style.opacity = 1;
      main.style.transform = 'translateY(0) scale(1)';
    }, 120);
  }
});
// --- Keep previous features (hearts, petals, stars, confetti, music toggle, download, etc) ---
// Animated hearts (Landing)
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (2 + Math.random() * 3) + 's';
  document.querySelector('.hearts')?.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}
if (document.querySelector('.hearts')) {
  setInterval(createHeart, 600);
}
// Music toggle (all pages)
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicPlaying = false;
function playMusic() {
  if (!musicPlaying) {
    music.play();
    musicPlaying = true;
    musicToggle.classList.add('active');
  } else {
    music.pause();
    musicPlaying = false;
    musicToggle.classList.remove('active');
  }
}
musicToggle && musicToggle.addEventListener('click', playMusic);
window.addEventListener('click', function autoPlayOnce() {
  if (!musicPlaying) playMusic();
  window.removeEventListener('click', autoPlayOnce);
}, { once: true });
// Music resume across pages using localStorage
window.addEventListener('DOMContentLoaded', () => {
  if (!music) return;
  // Restore music state
  const saved = localStorage.getItem('bg-music-state');
  if (saved) {
    try {
      const { time, playing } = JSON.parse(saved);
      music.currentTime = time || 0;
      if (playing) {
        // Wait for user interaction to play (browser policy)
        const tryPlay = () => {
          music.play();
          window.removeEventListener('click', tryPlay);
        };
        window.addEventListener('click', tryPlay);
      }
    } catch {}
  }
  // Save music state on navigation/unload
  function saveMusicState() {
    localStorage.setItem('bg-music-state', JSON.stringify({
      time: music.currentTime,
      playing: !music.paused
    }));
  }
  window.addEventListener('beforeunload', saveMusicState);
  // Also save on navigation via links
  document.querySelectorAll('a, .start-btn, .next-btn, .back-btn').forEach(el => {
    el.addEventListener('click', saveMusicState);
  });
});
// Heart styles (inject for demo)
const style = document.createElement('style');
style.innerHTML = `
.floating-heart {
  position: fixed;
  bottom: -40px;
  font-size: 2rem;
  color: #ff69b4;
  opacity: 0.7;
  animation: floatHeart linear forwards;
}
@keyframes floatHeart {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  80% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(1.3); opacity: 0; }
}
.floating-heart::before {
  content: '❤';
}
`;
document.head.appendChild(style);
// Falling petals (Love Letter)
function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'falling-petal';
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.animationDuration = (3 + Math.random() * 3) + 's';
  petal.style.fontSize = (18 + Math.random() * 12) + 'px';
  document.querySelector('.petals')?.appendChild(petal);
  setTimeout(() => petal.remove(), 7000);
}
if (document.body.classList.contains('love-letter')) {
  setInterval(createPetal, 500);
  const petalStyle = document.createElement('style');
  petalStyle.innerHTML = `
  .falling-petal {
    position: fixed;
    top: -40px;
    color: #ffb6c1;
    opacity: 0.7;
    animation: fallPetal linear forwards;
    z-index: 1;
  }
  @keyframes fallPetal {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    80% { opacity: 1; }
    100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
  }
  .falling-petal::before { content: '\u1F338'; }
  `;
  document.head.appendChild(petalStyle);
}
// Dreamy stars (About Her)
function createStar() {
  const star = document.createElement('div');
  star.className = 'dreamy-star';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.top = Math.random() * 100 + 'vh';
  star.style.opacity = 0.5 + Math.random() * 0.5;
  star.style.width = star.style.height = (2 + Math.random() * 3) + 'px';
  document.querySelector('.stars')?.appendChild(star);
  setTimeout(() => star.remove(), 8000);
}
if (document.body.classList.contains('about-her')) {
  setInterval(createStar, 120);
  const starStyle = document.createElement('style');
  starStyle.innerHTML = `
  .dreamy-star {
    position: fixed;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px #fff, 0 0 16px #ace0f9;
    z-index: 1;
    animation: twinkle 2s infinite alternate;
  }
  @keyframes twinkle {
    from { filter: brightness(1); }
    to { filter: brightness(1.5); }
  }
  `;
  document.head.appendChild(starStyle);
}
// Confetti (Wishes)
function createConfetti() {
  const conf = document.createElement('div');
  conf.className = 'confetti-piece';
  conf.style.left = Math.random() * 100 + 'vw';
  conf.style.background = `hsl(${Math.random()*360},90%,70%)`;
  conf.style.animationDuration = (2 + Math.random() * 2) + 's';
  conf.style.width = conf.style.height = (6 + Math.random() * 6) + 'px';
  document.querySelector('.confetti')?.appendChild(conf);
  setTimeout(() => conf.remove(), 4000);
}
if (document.body.classList.contains('wishes')) {
  setInterval(createConfetti, 120);
  const confettiStyle = document.createElement('style');
  confettiStyle.innerHTML = `
  .confetti-piece {
    position: fixed;
    top: -20px;
    border-radius: 50%;
    opacity: 0.8;
    animation: confettiFall linear forwards;
    z-index: 1;
  }
  @keyframes confettiFall {
    0% { transform: translateY(0) scale(1); opacity: 0.8; }
    80% { opacity: 1; }
    100% { transform: translateY(100vh) scale(1.2); opacity: 0; }
  }
  `;
  document.head.appendChild(confettiStyle);
  // Download Love Letter
  document.getElementById('download-letter')?.addEventListener('click', function() {
    const letter = `From the moment I met you, life changed in the most beautiful way. You are strong, brilliant, and your laugh is the melody I want forever...\n[More heartfelt words here. Replace with your own letter!]`;
    const blob = new Blob([letter], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'love-letter.txt';
    a.click();
  });
  // Replay music
  document.getElementById('replay-music')?.addEventListener('click', function() {
    music.currentTime = 0;
    if (!musicPlaying) playMusic();
    else music.play();
  });
}
// Play Song button logic (index page)
window.addEventListener('DOMContentLoaded', () => {
  const playSongBtn = document.getElementById('play-song-btn');
  if (playSongBtn && music) {
    function updateBtn() {
      playSongBtn.textContent = music.paused ? 'Play Song' : 'Pause Song';
    }
    playSongBtn.addEventListener('click', () => {
      if (music.paused) {
        music.play();
      } else {
        music.pause();
      }
      updateBtn();
    });
    music.addEventListener('play', updateBtn);
    music.addEventListener('pause', updateBtn);
    updateBtn();
  }
}); 