document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Removal
    window.addEventListener('load', () => {
        const preloader = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        setTimeout(() => {
            preloader.style.opacity = '0';
            app.classList.remove('hidden-init');
            setTimeout(() => preloader.remove(), 1000);
        }, 500);
    });

    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const heroSection = document.getElementById('hero');
    const mainContent = document.getElementById('main-content');
    const typedTextElement = document.getElementById('typed-text');
    const balloonContainer = document.getElementById('balloon-container');
    const polaroidPile = document.getElementById('polaroid-pile');

    const message = `I love you Nene, you're the best thing in my life, I can't imagine how other people that don't have twin sisters live, you're everything to me, I can tell you anything and everything, I trust your judgement, I seek your advice, you're the one person in my life that I want the very best and even more for.\n\nYou're always there for me, even when we're miles apart, you complete me, I was thinking about how I have no man to wish happy valentines day to, but then I realized that I have someone in my life who I love more than I've ever loved anyone else, if valentines is a day of love, then Valentines is definitely our day, because I LOVE YOU, in fact loving you is not a choice, it's like the oxygen I breathe, I remember how when we were younger I'd cry if something sad were happening to you.\n\nYou mean the world to me, thank You for all the love you've shown me, for how supportive you've been and for all the fun we've had.\n\nI can't wait for all the many more adventures that await us.`;

    // Generic Shuffle Function
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // 1. Sleek No Button Logic
    const moveNoButton = () => {
        const padding = 20;
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - (padding * 2)) + padding;
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - (padding * 2)) + padding;
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.zIndex = '50';
    };

    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // 2. Smooth Transition & Autoplay Logic
    yesBtn.addEventListener('click', () => {
        heroSection.classList.add('hidden');
        
        // Autoplay Music starting at 50 seconds (adjust this number if needed)
        const audio = document.getElementById('bgMusic');
        audio.currentTime = 50; 
        audio.play().then(() => {
            document.getElementById('playPauseBtn').innerText = 'PAUSE';
            isPlaying = true;
        }).catch(e => console.log("Autoplay blocked", e));

        setTimeout(() => {
            mainContent.classList.remove('hidden');
            document.body.style.overflow = 'auto'; 
            
            // Create the grid - IntersectionObserver inside will handle the playing
            createVideoGrid();

            startTyping();
            createPolaroids();
            createCelebration();
        }, 800);
    });

    // 3. Precise Typing Effect
    function startTyping() {
        let i = 0;
        typedTextElement.innerHTML = ''; 
        function type() {
            if (i < message.length) {
                typedTextElement.innerHTML += message.charAt(i) === '\n' ? '<br>' : message.charAt(i);
                i++;
                setTimeout(type, 30);
            }
        }
        type();
    }

    // 4. Video Grid Generator
// 4. Video Grid Generator (Enhanced with Smart Swap)
function createVideoGrid() {
    const grid = document.getElementById('video-grid');
    const baseVideos = [
        'videos/IMG_3125.MP4', 'videos/IMG_3126.MP4', 'videos/IMG_3127.MP4',
        'videos/IMG_3128.MP4', 'videos/IMG_3129.MP4', 'videos/IMG_3130.MP4',
        'videos/IMG_3131.MP4', 'videos/IMG_3132.MP4', 'videos/IMG_3133.MP4',
        'videos/IMG_3134.MP4', 'videos/IMG_3136.MP4', 'videos/IMG_3137.MP4',
        'videos/IMG_3138.MP4'
    ];

    // Maintain variety
    const activeSources = new Array(15).fill(null);

    function getNextVideo(currentIndex) {
        let next;
        const usedRecently = activeSources.filter(s => s !== null);
        
        // Try to find a video not currently in use
        const available = baseVideos.filter(v => !usedRecently.includes(v));
        
        if (available.length > 0) {
            next = available[Math.floor(Math.random() * available.length)];
        } else {
            // If all are used, just don't pick the same one as this tile just had
            const pool = baseVideos.filter(v => v !== activeSources[currentIndex]);
            next = pool[Math.floor(Math.random() * pool.length)];
        }
        return next;
    }

    const swapVideo = (videoElement, index) => {
        videoElement.classList.add('video-fading');
        
        setTimeout(() => {
            const nextSrc = getNextVideo(index);
            activeSources[index] = nextSrc;
            
            videoElement.src = nextSrc;
            videoElement.load();
            videoElement.play().catch(e => console.log("Swap play prevented", e));
            
            // Fade back in after meta data loads slightly or just instantly
            setTimeout(() => {
                videoElement.classList.remove('video-fading');
            }, 100);
        }, 1000); // Wait for fade out
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (entry.isIntersecting) {
                video.play().catch(e => console.log("Video play delayed", e));
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.1 });

    // Initial Grid Creation
    const shuffledStart = shuffle([...baseVideos]);

    for (let i = 0; i < 15; i++) {
        const videoUrl = shuffledStart[i % shuffledStart.length];
        activeSources[i] = videoUrl;

        const cell = document.createElement('div');
        cell.className = 'video-cell';
        
        cell.innerHTML = `
            <video muted playsinline preload="auto">
                <source src="${videoUrl}" type="video/mp4">
            </video>
        `;

        const video = cell.querySelector('video');
        
        // When video ends, swap it for a new one
        video.onended = () => swapVideo(video, i);

        grid.appendChild(cell);
        observer.observe(cell);
    }
}

    // 4. Polaroid Pile System
    function createPolaroids() {
        const pileContainer = document.getElementById('polaroid-pile');
        pileContainer.innerHTML = ''; // Clear existing
        
        // Add Hint
        const hint = document.createElement('div');
        hint.className = 'pile-hint';
        hint.innerText = 'Tap a photo to flip it... 📸';
        pileContainer.before(hint);

        const captions = [
            "You are the best sister ever!", "I love you so so much ❤️", "My half, my twin, my soul!", 
            "My favorite person in the world", "Twin magic since day one ✨", "Always together, never apart", 
            "The best thing in my life is you", "You complete me 👯‍♀️",
         "Partner in crime forever", "Gorgeous Nene ✨",
            "Sweetest sister ever", "An unbreakable bond", "Pure joy in every memory", 
            "Soul sisters for life", "The better half 😉", "Love you for infinity", 
            "My comfort place", "The absolute best twin"
        ];

        const samples = [
            'images/photo_2026-02-13_11-45-54.jpg',
            'images/photo_2026-02-13_11-46-16.jpg',
            'images/photo_2026-02-13_11-46-20.jpg',
            'images/photo_2026-02-13_11-46-24.jpg',
            'images/photo_2026-02-13_11-46-28.jpg',
            'images/photo_2026-02-13_11-46-33.jpg',
            'images/photo_2026-02-13_11-46-46.jpg', // Moved up
            'images/photo_2026-02-13_11-46-37.jpg',
            'images/photo_2026-02-13_11-46-41.jpg',
            'images/photo_2026-02-13_11-46-50.jpg',
            'images/photo_2026-02-13_11-46-55.jpg'
        ];

        // Tracking for variety
        let recentIndices = []; 
    // 4. Polaroid Pile System
        
        shuffle(captions);

        for (let i = 0; i < 20; i++) {
            const pol = document.createElement('div');
            pol.className = 'polaroid';
            
            // Random messy scatter
            const rot = (Math.random() * 60) - 30; 
            const x = (Math.random() * 240) - 120;  
            const y = (Math.random() * 400) - 200;  
            
            pol.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`;
            pol.style.zIndex = i + 10;

            pol.innerHTML = `
                <div class="polaroid-front">
                    <!-- Blank Back Side -->
                </div>
                <div class="polaroid-back">
                    <div class="polaroid-image-container">
                        <img src="" alt="Memory">
                    </div>
                    <div class="polaroid-caption"></div>
                </div>
            `;

            pol.onclick = (e) => {
                e.stopPropagation();
                if (pol.classList.contains('flipped')) {
                    // Close it
                    pol.classList.remove('flipped');
                    pol.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`;
                } else {
                    // Unflip everyone first
                    document.querySelectorAll('.polaroid.flipped').forEach(p => {
                        p.classList.remove('flipped');
                        const px = p.getAttribute('data-x');
                        const py = p.getAttribute('data-y');
                        const pr = p.getAttribute('data-r');
                        p.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${pr}deg)`;
                    });

                    // Pick a NEW image index that wasn't in the last 3
                    let nextIdx;
                    do {
                        nextIdx = Math.floor(Math.random() * samples.length);
                    } while (recentIndices.includes(nextIdx) && samples.length > 3);

                    // Update tracker
                    recentIndices.push(nextIdx);
                    if (recentIndices.length > 3) recentIndices.shift();

                    // Set the content dynamically before flipping
                    const imgElement = pol.querySelector('img');
                    const capElement = pol.querySelector('.polaroid-caption');
                    
                    imgElement.src = samples[nextIdx];
                    capElement.innerText = captions[Math.floor(Math.random() * captions.length)];

                    // Flip this one
                    pol.classList.add('flipped');
                    pol.style.transform = `translate(-50%, -50%) rotateY(180deg) scale(1.5)`;
                }
            };

            pol.setAttribute('data-x', x);
            pol.setAttribute('data-y', y);
            pol.setAttribute('data-r', rot);

            polaroidPile.appendChild(pol);
        }
    }

    // 5. Celebration Effect
    // 5. High-Quality Canvas Confetti Engine
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.color = [`#ff4d6d`, `#ffb7c5`, `#d4af37`, `#ffffff`, `#ff85a1`][Math.floor(Math.random() * 5)];
            this.speed = Math.random() * 3 + 2;
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.2 - 0.1;
        }
        update() {
            this.y += this.speed;
            this.x += Math.sin(this.angle) * 2;
            this.angle += this.rotationSpeed;
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
            ctx.restore();
        }
    }

    let animationId;
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animateConfetti);
    }

    function createCelebration() {
        document.getElementById('celebration').classList.remove('hidden');
        if (confettiPieces.length === 0) {
            for (let i = 0; i < 500; i++) { // Massive density boost
                confettiPieces.push(new Confetti());
            }
            animateConfetti();
        }
        
        // Stop after 5 seconds as requested
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confettiPieces = [];
            document.getElementById('celebration').classList.add('hidden');
        }, 5000);
    }

    // 7. Audio Player Logic
    const playPauseBtn = document.getElementById('playPauseBtn');
    const audio = document.getElementById('bgMusic');
    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.innerText = 'PLAY';
        } else {
            audio.play();
            playPauseBtn.innerText = 'PAUSE';
        }
        isPlaying = !isPlaying;
    });

    // Reset flipped polaroids when clicking elsewhere
    document.addEventListener('click', () => {
        document.querySelectorAll('.polaroid.flipped').forEach(p => {
            p.classList.remove('flipped');
            const px = p.getAttribute('data-x');
            const py = p.getAttribute('data-y');
            const pr = p.getAttribute('data-r');
            p.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${pr}deg)`;
        });
    });

    // 6. Scroll Effects: Falling Videos & Confetti Finale
    const videoGrid = document.getElementById('video-grid');
    const hollywoodSection = document.getElementById('hollywood-container');

    window.addEventListener('scroll', () => {
        // Confetti Finale at bottom
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
            triggerFinalConfetti();
        }
    });

    let confettiTriggered = false;
    function triggerFinalConfetti() {
        if (confettiTriggered) return;
        confettiTriggered = true;
        
        createCelebration(); // Initial burst
        const interval = setInterval(createCelebration, 500); 
        
        setTimeout(() => {
            clearInterval(interval);
            confettiTriggered = false; // Allow re-trigger if they scroll up and back
        }, 5000);
    }

    // 7. Hollywood Mosaic / Nebula Generator
    function initHollywood() {
        const letters = document.querySelectorAll('.letter');
        const images = shuffle([
            'images/photo_2026-02-13_11-45-54.jpg',
            'images/photo_2026-02-13_11-46-16.jpg',
            'images/photo_2026-02-13_11-46-20.jpg',
            'images/photo_2026-02-13_11-46-24.jpg',
            'images/photo_2026-02-13_11-46-28.jpg',
            'images/photo_2026-02-13_11-46-33.jpg',
            'images/photo_2026-02-13_11-46-37.jpg',
            'images/photo_2026-02-13_11-46-41.jpg',
            'images/photo_2026-02-13_11-46-46.jpg',
            'images/photo_2026-02-13_11-46-50.jpg',
            'images/photo_2026-02-13_11-46-55.jpg'
        ]);


        letters.forEach((letter, idx) => {
            letter.style.backgroundImage = `url(${images[idx % images.length]})`;
            letter.style.opacity = '0';
            letter.style.transform = `translateY(40px) scale(0.8)`;
            
            // Grand Staggered Entrance
            setTimeout(() => {
                letter.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                letter.style.opacity = '1';
                letter.style.transform = `translateY(0) scale(1)`;
            }, idx * 120);
        });

        const sig = document.querySelector('.final-signature');
        if (sig) {
            sig.style.opacity = '0';
            sig.style.transition = 'opacity 2s ease';
            setTimeout(() => sig.style.opacity = '1', 2500);
        }
    }

    // Initialize Hollywood mosaic once content shows
    yesBtn.addEventListener('click', () => {
        setTimeout(initHollywood, 1000);
    });
});
