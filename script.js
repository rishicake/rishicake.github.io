/* ============================================================
   BIRTHDAY WEBSITE – INTERACTIVE SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Stars Background ----
    const starsContainer = document.getElementById('starsContainer');
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = (Math.random() * 2.5 + 1) + 'px';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        star.style.animationDelay = (Math.random() * 3) + 's';
        starsContainer.appendChild(star);
    }

    // ---- Floating Hearts ----
    const heartsContainer = document.getElementById('floatingHearts');
    const heartEmojis = ['💚', '💕', '💗', '💖', '💛', '🤍', '💜', '✨'];
    function spawnHeart() {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
        heart.style.animationDuration = (Math.random() * 8 + 10) + 's';
        heart.style.animationDelay = (Math.random() * 2) + 's';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 18000);
    }
    // Spawn hearts at intervals
    for (let i = 0; i < 8; i++) setTimeout(() => spawnHeart(), i * 600);
    setInterval(spawnHeart, 2500);


    // ---- Confetti on Hero Section ----
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    let confettiAnimId;

    function resizeCanvas() {
        const hero = document.getElementById('hero');
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ConfettiPiece {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 6 + 3;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.rotation = Math.random() * 360;
            this.rotSpeed = Math.random() * 4 - 2;
            this.opacity = Math.random() * 0.6 + 0.3;
            const colors = ['#ff7eb3', '#ffd700', '#5ae4a7', '#b388ff', '#64b5f6', '#ff6b9d', '#ffa07a'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Create confetti pieces
    for (let i = 0; i < 60; i++) {
        confettiPieces.push(new ConfettiPiece());
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(piece => {
            piece.update();
            piece.draw();
        });
        confettiAnimId = requestAnimationFrame(animateConfetti);
    }
    animateConfetti();


    // ---- Scroll Reveal (Intersection Observer) ----
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to the element and its children that need revealing
                entry.target.classList.add('visible');
                const revealChildren = entry.target.querySelectorAll(
                    '.letter-card, .letter-ornament, .section-title, .cake-subtitle, .cake-wrapper, .poem-intro, .poem-card, .finale-content'
                );
                revealChildren.forEach(child => child.classList.add('visible'));
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.letter-section, .cake-section, .poem-section, .finale-section').forEach(section => {
        revealObserver.observe(section);
    });
    // Also observe individual elements that might be direct children
    document.querySelectorAll('.letter-card, .letter-ornament, .section-title, .cake-subtitle, .cake-wrapper, .poem-intro, .poem-card, .finale-content').forEach(el => {
        revealObserver.observe(el);
    });


    // ---- Birthday Cake: Blow out candles ----
    const cake = document.getElementById('birthdayCake');
    const blowHint = document.getElementById('blowHint');
    let candlesBlown = false;

    cake.addEventListener('click', () => {
        if (candlesBlown) {
            // Re-light candles
            cake.classList.remove('blown-out');
            blowHint.textContent = 'tap the cake when you\'re ready';
            candlesBlown = false;
        } else {
            cake.classList.add('blown-out');
            blowHint.textContent = 'happy birthday — click to re-light';
            candlesBlown = true;

            // Burst of confetti on blow out
            burstConfetti();
        }
    });

    function burstConfetti() {
        const burstCount = 80;
        const colors = ['#ff7eb3', '#ffd700', '#5ae4a7', '#b388ff', '#64b5f6', '#ff6b9d'];
        const burstContainer = document.createElement('div');
        burstContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(burstContainer);

        for (let i = 0; i < burstCount; i++) {
            const piece = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;
            const angle = (Math.random() * 360 * Math.PI) / 180;
            const velocity = Math.random() * 400 + 200;
            const endX = startX + Math.cos(angle) * velocity;
            const endY = startY + Math.sin(angle) * velocity - Math.random() * 200;

            piece.style.cssText = `
                position: absolute;
                left: ${startX}px;
                top: ${startY}px;
                width: ${size}px;
                height: ${size * 0.6}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                transform: rotate(${Math.random() * 360}deg);
                transition: all ${Math.random() * 1 + 1}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 1;
            `;
            burstContainer.appendChild(piece);

            // Trigger the animation in next frame
            requestAnimationFrame(() => {
                piece.style.left = endX + 'px';
                piece.style.top = endY + 'px';
                piece.style.opacity = '0';
                piece.style.transform = `rotate(${Math.random() * 720}deg)`;
            });
        }

        setTimeout(() => burstContainer.remove(), 3000);
    }


    // ---- Smooth Scroll for CTA ----
    document.getElementById('scrollCta').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
    });


    // ---- Music Toggle (Audio) ----
    const musicToggle = document.getElementById('musicToggle');
    const audio = new Audio('2025/song/song.wav');
    audio.loop = true;
    audio.volume = 0.5;
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicToggle.classList.remove('playing');
        } else {
            audio.play();
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });


    // ---- Page Visibility: pause animations when hidden ----
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(confettiAnimId);
        } else {
            animateConfetti();
        }
    });

});
