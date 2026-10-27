document.addEventListener('DOMContentLoaded', () => {
    initProfileUI();
    initClickToEnter();
    initAudioController();
    initMouseEffects();
    initParticleCanvas();
    initLanyardRealtime();
    initLocalClock();
    initGreeting();
    initThemeToggle();
});

function initProfileUI() {
    document.title = `Hi, I'm ${CONFIG.profile.name}` || "Alex";

    const nameEl = document.getElementById('user-display-name');
    const handleEl = document.getElementById('user-handle');
    const taglineEl = document.getElementById('user-tagline');
    const bioEl = document.getElementById('user-bio');
    const avatarEl = document.getElementById('profile-avatar');
    const bannerEl = document.getElementById('card-banner');
    const locationEl = document.getElementById('user-location');

    if (nameEl && CONFIG.profile.name && (CONFIG.profile.name !== "Tên Của Bạn" || !nameEl.textContent.trim())) {
        nameEl.textContent = CONFIG.profile.name;
    }
    if (handleEl && CONFIG.profile.username && (CONFIG.profile.username !== "username.demo" || !handleEl.textContent.trim())) {
        handleEl.textContent = `@${CONFIG.profile.username}`;
    }
    if (taglineEl && CONFIG.profile.title) taglineEl.textContent = CONFIG.profile.title;
    if (bioEl && CONFIG.profile.bio && (CONFIG.profile.bio !== "Viết vài câu giới thiệu về bạn ở đây." || !bioEl.textContent.trim())) {
        bioEl.textContent = CONFIG.profile.bio;
    }
    if (locationEl && CONFIG.profile.location) locationEl.textContent = CONFIG.profile.location;
    if (avatarEl && CONFIG.profile.avatar) avatarEl.src = CONFIG.profile.avatar;
    if (bannerEl && CONFIG.profile.banner) bannerEl.style.backgroundImage = `url('${CONFIG.profile.banner}')`;

    const enterAvatarEl = document.querySelector('.enter-avatar-img, .cute-avatar-img, .evo-avatar-img');
    const enterNameEl = document.querySelector('.enter-name, .cute-name, .evo-name');
    const enterSubtextEl = document.querySelector('.enter-subtext, .cute-subtext');
    if (enterAvatarEl && CONFIG.profile.avatar) enterAvatarEl.src = CONFIG.profile.avatar;
    if (enterNameEl && CONFIG.profile.name) enterNameEl.textContent = CONFIG.profile.name;
    if (enterSubtextEl && CONFIG.profile.title) enterSubtextEl.textContent = `${CONFIG.profile.title} • Alex`;

    const badgesContainer = document.getElementById('badges-container');
    if (badgesContainer && CONFIG.profile.badges) {
        badgesContainer.innerHTML = '';
        CONFIG.profile.badges.forEach(badge => {
            const pill = document.createElement('div');
            pill.className = 'badge-pill';
            const colorStyle = badge.color ? `style="color: ${badge.color}; filter: drop-shadow(0 0 6px ${badge.color}66);"` : '';
            pill.innerHTML = `<i class="${badge.icon}" ${colorStyle}></i> <span>${badge.label}</span>`;
            badgesContainer.appendChild(pill);
        });
    }

    const serversGrid = document.getElementById('servers-grid');
    if (serversGrid && CONFIG.servers) {
        serversGrid.innerHTML = '';
        CONFIG.servers.forEach((srv, idx) => {
            const card = document.createElement('div');
            card.className = 'server-card';
            card.id = `server-card-${idx}`;
            card.innerHTML = `
                <img src="${srv.banner}" alt="${srv.name} Banner" class="server-banner-img" id="server-banner-${idx}">
                <div class="server-body">
                    <div class="server-icon-wrap">
                        <img src="${srv.icon}" alt="${srv.name} Icon" class="server-icon" id="server-icon-${idx}">
                    </div>
                    <div class="server-content">
                        <div class="server-top-line">
                            <span class="server-name" id="server-name-${idx}">${srv.name}</span>
                            <span class="server-tag">${srv.tag}</span>
                        </div>
                        <div class="server-stats" id="server-stats-${idx}" style="display:flex;align-items:center;gap:7px;font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:1px;">
                            <span style="display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid fa-circle" style="color:var(--status-online);font-size:0.45rem;"></i> ${srv.online || 'Active Hub'}</span>
                            <span>•</span>
                            <span>${srv.members || 'Community'}</span>
                        </div>
                        <span class="server-role">${srv.role}</span>
                        <p class="server-desc">${srv.description}</p>
                    </div>
                    <a href="${srv.inviteUrl}" target="_blank" rel="noopener noreferrer" class="server-join-btn">
                        <i class="fa-brands fa-discord"></i> Join
                    </a>
                </div>
            `;
            serversGrid.appendChild(card);

            const bannerEl = card.querySelector('.server-banner-img');
            const iconEl = card.querySelector('.server-icon');
            if (bannerEl && srv.cdnBanner) {
                bannerEl.onerror = () => {
                    if (bannerEl.src !== srv.cdnBanner) bannerEl.src = srv.cdnBanner;
                };
            }
            if (iconEl && srv.cdnIcon) {
                iconEl.onerror = () => {
                    if (iconEl.src !== srv.cdnIcon) iconEl.src = srv.cdnIcon;
                };
            }

            fetchDiscordInviteData(srv.inviteUrl, idx);
        });
    }

    const socialsList = document.getElementById('socials-list');
    if (socialsList && CONFIG.socials) {
        socialsList.innerHTML = '';
        CONFIG.socials.forEach(soc => {
            const a = document.createElement('a');
            a.className = 'social-pill';
            a.href = soc.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.innerHTML = `<i class="${soc.icon}"></i> <span>${soc.name}</span>`;

            if (soc.copy) {
                a.addEventListener('click', (e) => {
                    navigator.clipboard.writeText(soc.copy);
                    showToast(`Đã sao chép ${soc.name}: ${soc.copy}`);
                });
            }

            socialsList.appendChild(a);
        });
    }

    const arsenalGrid = document.getElementById('arsenal-grid');
    if (arsenalGrid && Array.isArray(CONFIG.techStack) && CONFIG.techStack.length > 0) {
        arsenalGrid.innerHTML = '';
        CONFIG.techStack.forEach(item => {
            const pill = document.createElement('div');
            pill.className = 'arsenal-pill';
            pill.innerHTML = `
                <div class="arsenal-icon-wrap">
                    <i class="${item.icon}"></i>
                </div>
                <div class="arsenal-info">
                    <span class="arsenal-name">${item.name}</span>
                    <span class="arsenal-sub">${item.domain}</span>
                </div>
            `;
            arsenalGrid.appendChild(pill);
        });
    }

    const copyTagBtn = document.getElementById('copy-tag-btn');
    if (copyTagBtn) {
        copyTagBtn.addEventListener('click', () => {
            const textToCopy = CONFIG.discordId || CONFIG.profile.username;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Đã sao chép Discord ID: ${textToCopy}`);
                playBeepSound(600, 0.08);
            });
        });
    }

    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const link = window.location.href;
            navigator.clipboard.writeText(link).then(() => {
                showToast('Đã sao chép liên kết trang');
                playBeepSound(680, 0.08);
            });
        });
    }
}

async function fetchDiscordInviteData(inviteUrl, idx) {
    try {
        const code = inviteUrl.split('/').pop().trim();
        if (!code) return;
        const res = await fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.guild) return;

        const guild = data.guild;
        const iconEl = document.getElementById(`server-icon-${idx}`);
        const bannerEl = document.getElementById(`server-banner-${idx}`);
        const statsEl = document.getElementById(`server-stats-${idx}`);
        const nameEl = document.getElementById(`server-name-${idx}`);

        if (nameEl && guild.name) {
            nameEl.textContent = guild.name;
        }

        if (iconEl && guild.icon) {
            const isGif = guild.icon.startsWith('a_');
            const ext = isGif ? 'gif' : 'png';
            iconEl.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=256`;
        }

        if (bannerEl) {
            if (guild.banner) {
                const isGif = guild.banner.startsWith('a_');
                const ext = isGif ? 'gif' : 'png';
                bannerEl.src = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${ext}?size=1024`;
            } else if (guild.splash) {
                bannerEl.src = `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=1024`;
            }
        }

        if (statsEl && data.approximate_member_count) {
            const onlineCount = data.approximate_presence_count || 0;
            const memberCount = data.approximate_member_count;
            statsEl.innerHTML = `
                <span style="display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid fa-circle" style="color:var(--status-online);font-size:0.45rem;"></i> ${onlineCount.toLocaleString()} Online</span>
                <span>•</span>
                <span>${memberCount.toLocaleString()} Members</span>
            `;
        }
    } catch (e) {
    }
}

function initTypewriter() {
    const textEl = document.getElementById('typewriter-quote');
    if (!textEl || !CONFIG.profile.quotes || CONFIG.profile.quotes.length === 0) return;

    let quoteIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const quotes = CONFIG.profile.quotes;

    function typeLoop() {
        const currentQuote = quotes[quoteIndex];

        if (isDeleting) {
            charIndex--;
            textEl.textContent = currentQuote.substring(0, charIndex);
        } else {
            charIndex++;
            textEl.textContent = currentQuote.substring(0, charIndex);
        }

        let typeSpeed = isDeleting ? 30 : 65;

        if (!isDeleting && charIndex === currentQuote.length) {
            typeSpeed = 2600;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            quoteIndex = (quoteIndex + 1) % quotes.length;
            typeSpeed = 500;
        }

        setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
}

function initClickToEnter() {
    const overlay = document.getElementById('enter-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', () => {
        overlay.classList.add('entered');

        playBeepSound(600, 0.06);

        if (CONFIG.music && CONFIG.music.autoplayOnEnter) {
            const audio = document.getElementById('bg-audio');
            if (audio) {
                audio.play().then(() => {
                    updateAudioWidgetState(true);
                    if (playlist.length > 0 && playlist[currentTrackIndex]) {
                        showToast(`Đang phát: ${playlist[currentTrackIndex].title}`, 'fa-solid fa-music');
                    }
                }).catch(e => console.log('Audio autoplay prevented:', e));
            }
        }
    });
}

let currentTrackIndex = 0;
let playlist = [];

function initAudioController() {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('audio-play-btn');
    const prevBtn = document.getElementById('audio-prev-btn');
    const nextBtn = document.getElementById('audio-next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const trackTitle = document.getElementById('audio-track-title');
    const artistName = document.getElementById('audio-artist-name');
    const livePill = document.getElementById('audio-live-pill');

    if (!audio || !CONFIG.music) return;

    if (Array.isArray(CONFIG.music.playlist) && CONFIG.music.playlist.length > 0) {
        playlist = [...CONFIG.music.playlist];
    } else if (CONFIG.music.url) {
        playlist = [{
            title: CONFIG.music.title || 'Genius',
            artist: CONFIG.music.artist || 'LSD',
            url: CONFIG.music.url
        }];
    }

    audio.volume = typeof CONFIG.music.volume === 'number' ? CONFIG.music.volume : 0.45;
    if (volumeSlider) volumeSlider.value = audio.volume;

    window.loadTrack = function (index, autoPlay = false) {
        if (playlist.length === 0) return;
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;
        currentTrackIndex = index;

        const track = playlist[currentTrackIndex];
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (e) { }

        audio.src = track.url;
        audio.load();

        if (trackTitle) {
            trackTitle.textContent = track.title;
            trackTitle.title = `${track.title} - ${track.artist}`;
        }
        if (artistName) {
            const countTag = playlist.length > 1 ? `${currentTrackIndex + 1}/${playlist.length} • ` : '';
            artistName.textContent = `${countTag}${track.artist}`;
        }
        if (livePill) {
            const isLiveStream = track.url.includes('stream') || track.url.includes('radio') || track.title.includes('24/7');
            if (isLiveStream) {
                livePill.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> LIVE RADIO';
            } else if (track.youtubeId || (CONFIG.music && CONFIG.music.youtubePlaylistUrl)) {
                livePill.innerHTML = '<i class="fa-brands fa-youtube" style="color:#ff3333;"></i> YT MIX';
            } else {
                livePill.innerHTML = '<i class="fa-solid fa-compact-disc"></i> HQ AUDIO';
            }
            livePill.style.cursor = 'pointer';
            livePill.title = 'Playlist: Tìm Em - Hngle ft. Bảo Anh (Nhấp để mở YouTube)';
            livePill.onclick = () => {
                if (CONFIG.music && CONFIG.music.youtubePlaylistUrl) {
                    window.open(CONFIG.music.youtubePlaylistUrl, '_blank');
                }
            };
        }

        if (autoPlay) {
            audio.play().then(() => {
                updateAudioWidgetState(true);
                showToast(`Đang phát: ${track.title} • ${track.artist}`, 'fa-solid fa-music');
            }).catch(err => {
                console.log('Audio playback prevented:', err);
                updateAudioWidgetState(false);
            });
        }
    };

    window.playNextTrack = function () {
        playBeepSound(560, 0.05);
        if (playlist.length === 0) return;
        const nextIdx = (currentTrackIndex + 1) % playlist.length;
        window.loadTrack(nextIdx, true);
    };

    window.playPrevTrack = function () {
        playBeepSound(480, 0.05);
        if (playlist.length === 0) return;
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            audio.play().catch(() => { });
            return;
        }
        const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        window.loadTrack(prevIdx, true);
    };

    window.loadTrack(0, false);

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playBeepSound(520, 0.05);
            if (audio.paused) {
                audio.play().then(() => {
                    updateAudioWidgetState(true);
                }).catch(e => console.log('Audio play error:', e));
            } else {
                audio.pause();
                updateAudioWidgetState(false);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            window.playNextTrack();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            window.playPrevTrack();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = parseFloat(e.target.value);
        });
    }

    audio.addEventListener('play', () => updateAudioWidgetState(true));
    audio.addEventListener('pause', () => updateAudioWidgetState(false));
    audio.addEventListener('ended', () => {
        window.playNextTrack();
    });

    audio.addEventListener('error', () => {
        console.warn('Audio stream error, automatically advancing to next song...');
        setTimeout(() => {
            window.playNextTrack();
        }, 700);
    });

    window.bioPlayer = {
        next: window.playNextTrack,
        prev: window.playPrevTrack,
        load: window.loadTrack,
        playlist: playlist
    };
}

function updateAudioWidgetState(isPlaying) {
    const playIcon = document.getElementById('play-icon');
    const disc = document.getElementById('audio-disc');
    const eq = document.getElementById('equalizer');

    if (isPlaying) {
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        if (disc) disc.classList.add('playing');
        if (eq) eq.classList.add('active');
    } else {
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (disc) disc.classList.remove('playing');
        if (eq) eq.classList.remove('active');
    }
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let isMouseMoving = false;
let mouseMoveTimeout = null;

function initMouseEffects() {
    const spotlight = document.getElementById('mouse-spotlight');
    const tiltContainer = document.getElementById('tilt-container');
    const bioCard = document.getElementById('bio-card');
    const cursorDot = document.getElementById('cursor-dot');
    const cyberCursor = document.getElementById('cyber-cursor');

    const enableCursor = CONFIG.effects && CONFIG.effects.enableCustomCursor !== false;
    if (!enableCursor) {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cyberCursor) cyberCursor.style.display = 'none';
    }

    let reticleX = mouseX;
    let reticleY = mouseY;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isHoveringInteractive = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => { isMouseMoving = false; }, 100);

        if (enableCursor && cursorDot) {
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }

        if (CONFIG.effects && CONFIG.effects.enableSpotlight && spotlight) {
            spotlight.style.setProperty('--mouse-x', `${mouseX}px`);
            spotlight.style.setProperty('--mouse-y', `${mouseY}px`);
        }

        if (CONFIG.effects && CONFIG.effects.enableTilt && tiltContainer && window.innerWidth > 900) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const maxTilt = 2.8;

            const deltaX = (mouseX - centerX) / centerX;
            const deltaY = (mouseY - centerY) / centerY;

            targetTiltX = -deltaY * maxTilt;
            targetTiltY = deltaX * maxTilt;

            if (bioCard) {
                const rect = bioCard.getBoundingClientRect();
                const glareX = mouseX - rect.left;
                const glareY = mouseY - rect.top;
                bioCard.style.setProperty('--glare-x', `${glareX}px`);
                bioCard.style.setProperty('--glare-y', `${glareY}px`);
            }
        }
    });

    if (enableCursor) {
        const interactiveSelector = 'a, button, [role="button"], input, .ctrl-btn, .social-pill, .badge-pill, .server-card, .arsenal-pill, .enter-overlay, .theme-toggle-btn, .copy-tag-btn, .copy-link-btn';
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest(interactiveSelector)) {
                isHoveringInteractive = true;
                document.body.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest(interactiveSelector)) {
                isHoveringInteractive = false;
                document.body.classList.remove('cursor-hover');
            }
        });

        document.addEventListener('mouseleave', () => {
            document.body.classList.add('cursor-hidden');
            targetTiltX = 0;
            targetTiltY = 0;
        });
        document.addEventListener('mouseenter', () => {
            document.body.classList.remove('cursor-hidden');
        });
    } else {
        document.addEventListener('mouseleave', () => {
            targetTiltX = 0;
            targetTiltY = 0;
        });
    }

    function renderCursorAndTilt() {
        if (enableCursor && cyberCursor) {
            reticleX += (mouseX - reticleX) * 0.18;
            reticleY += (mouseY - reticleY) * 0.18;
            const scale = isHoveringInteractive ? 1.15 : 1;
            cyberCursor.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0) translate(-50%, -50%) scale(${scale})`;
        }

        if (CONFIG.effects && CONFIG.effects.enableTilt && tiltContainer) {
            if (window.innerWidth > 900) {
                currentTiltX += (targetTiltX - currentTiltX) * 0.08;
                currentTiltY += (targetTiltY - currentTiltY) * 0.08;
                tiltContainer.style.transform = `rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
            } else if (tiltContainer.style.transform) {
                tiltContainer.style.transform = '';
            }
        }

        requestAnimationFrame(renderCursorAndTilt);
    }
    requestAnimationFrame(renderCursorAndTilt);
}

function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !CONFIG.effects || !CONFIG.effects.enableParticles) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 24000), 45);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.3 + 0.5,
            speedX: (Math.random() - 0.5) * 0.18,
            speedY: (Math.random() - 0.5) * 0.18,
            alpha: Math.random() * 0.45 + 0.15,
            alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
        });
    }

    const shootingStars = [];
    let nextShootingStarTime = Date.now() + 2000;

    function spawnShootingStar() {
        if (!CONFIG.effects || CONFIG.effects.enableShootingStars === false) return;
        const angleDeg = Math.random() * 20 + 32;
        const angle = (angleDeg * Math.PI) / 180;
        const speed = Math.random() * 10 + 16;
        const startX = Math.random() * (width * 0.85);
        const startY = -40;
        const trailLength = Math.random() * 140 + 160;

        shootingStars.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: trailLength,
            width: 1.5,
            alpha: 0.85,
            decay: 0.016
        });

        nextShootingStarTime = Date.now() + (Math.random() * 8000 + 6000);
    }

    const cometRibbon = [];
    const stardustSparks = [];
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;

    window.addEventListener('mousemove', (e) => {
        if (!CONFIG.effects || CONFIG.effects.enableCustomCursor === false) return;
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        const dist = Math.hypot(dx, dy);

        if (dist > 6) {
            cometRibbon.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });

            const count = Math.min(Math.floor(dist / 14) + 1, 3);
            for (let i = 0; i < count; i++) {
                const spreadX = (Math.random() - 0.5) * 12;
                const spreadY = (Math.random() - 0.5) * 12;
                const isCyan = Math.random() > 0.35;
                stardustSparks.push({
                    x: e.clientX + spreadX,
                    y: e.clientY + spreadY,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2,
                    size: Math.random() * 2.2 + 1,
                    alpha: 0.95,
                    decay: Math.random() * 0.035 + 0.025,
                    color: isCyan ? '0, 210, 255' : '255, 255, 255'
                });
            }

            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        }
    });

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        const now = Date.now();

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha += p.alphaSpeed;

            if (p.alpha > 0.65 || p.alpha < 0.15) {
                p.alphaSpeed = -p.alphaSpeed;
            }

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        }

        if (CONFIG.effects && CONFIG.effects.enableShootingStars !== false) {
            if (now >= nextShootingStarTime) {
                spawnShootingStar();
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const star = shootingStars[i];
                star.x += star.vx;
                star.y += star.vy;
                star.alpha -= star.decay;

                if (star.alpha <= 0 || star.x > width + 200 || star.y > height + 200) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                const angle = Math.atan2(star.vy, star.vx);
                const tailX = star.x - Math.cos(angle) * star.length;
                const tailY = star.y - Math.sin(angle) * star.length;

                ctx.save();
                const tailGrad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
                tailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                tailGrad.addColorStop(0.7, `rgba(0, 210, 255, ${star.alpha * 0.45})`);
                tailGrad.addColorStop(1, `rgba(255, 255, 255, ${star.alpha})`);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(star.x, star.y);
                ctx.strokeStyle = tailGrad;
                ctx.lineWidth = star.width;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.restore();
            }
        }

        if (CONFIG.effects && CONFIG.effects.enableCustomCursor !== false) {
            while (cometRibbon.length > 0 && now - cometRibbon[0].time > 320) {
                cometRibbon.shift();
            }

            if (cometRibbon.length > 2) {
                ctx.save();
                for (let i = 1; i < cometRibbon.length; i++) {
                    const p1 = cometRibbon[i - 1];
                    const p2 = cometRibbon[i];
                    const age = now - p2.time;
                    const life = 1 - (age / 320);
                    if (life <= 0) continue;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 210, 255, ${(life * 0.38).toFixed(3)})`;
                    ctx.lineWidth = life * 3.5;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
                ctx.restore();
            }

            for (let i = stardustSparks.length - 1; i >= 0; i--) {
                const s = stardustSparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.alpha -= s.decay;

                if (s.alpha <= 0) {
                    stardustSparks.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.color}, ${s.alpha.toFixed(2)})`;
                ctx.shadowColor = `rgba(${s.color}, 0.8)`;
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.restore();
            }
        }

        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

let spotifyProgressInterval = null;

function initLanyardRealtime() {
    if (!CONFIG.discordId) {
        setMockDiscordState();
        return;
    }

    connectLanyardWebSocket();
}

function connectLanyardWebSocket() {
    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval = null;

    ws.onopen = () => {
        ws.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: CONFIG.discordId
            }
        }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            const { op, t, d } = data;

            if (op === 1) {
                const interval = d.heartbeat_interval;
                heartbeatInterval = setInterval(() => {
                    ws.send(JSON.stringify({ op: 3 }));
                }, interval);
            }

            if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                updateDiscordPresenceUI(d);
            }
        } catch (e) {
            console.error('Lanyard WS parse error:', e);
        }
    };

    ws.onerror = () => {
        fetchLanyardREST();
    };

    ws.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        setTimeout(fetchLanyardREST, 5000);
    };
}

async function fetchLanyardREST() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`);
        if (res.status === 404) {
            setMockDiscordState(true);
            setTimeout(fetchLanyardREST, 4000);
            return;
        }
        const json = await res.json();
        if (json && json.success && json.data) {
            updateDiscordPresenceUI(json.data);
        } else {
            setMockDiscordState(true);
            setTimeout(fetchLanyardREST, 4000);
        }
    } catch (e) {
        setMockDiscordState(false);
        setTimeout(fetchLanyardREST, 5000);
    }
}

function updateDiscordPresenceUI(data) {
    if (!data || !data.discord_status) {
        setMockDiscordState(true);
        return;
    }

    const { discord_user, discord_status, activities, listening_to_spotify, spotify } = data;

    const liveAvatarUrl = (discord_user && discord_user.avatar)
        ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
        : null;

    if (liveAvatarUrl) {
        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl) avatarEl.src = liveAvatarUrl;
        const enterAvatarEl = document.querySelector('.cute-avatar-img, .enter-avatar-img');
        if (enterAvatarEl) enterAvatarEl.src = liveAvatarUrl;
    }

    const decorationAsset = discord_user && discord_user.avatar_decoration_data
        ? discord_user.avatar_decoration_data.asset
        : null;
    document.querySelectorAll('.avatar-decoration').forEach(el => {
        if (decorationAsset) {
            const url = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png`;
            if (el.getAttribute('src') !== url) el.src = url;
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });

    const statusDot = document.querySelector('.status-dot');
    const headerStatusText = document.getElementById('header-status-text');

    if (statusDot) {
        statusDot.className = `status-dot ${discord_status}`;
    }

    if (headerStatusText) {
        headerStatusText.textContent = `DISCORD • ${discord_status.toUpperCase()}`;
    }

    const customStatus = activities ? activities.find(a => a.type === 4) : null;
    const customStatusEmoji = document.getElementById('custom-status-emoji');
    const customStatusText = document.getElementById('custom-status-text');

    if (customStatus) {
        let emoji = '💬';
        if (customStatus.emoji) {
            if (customStatus.emoji.id) {
                emoji = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" style="width:20px;height:20px;vertical-align:middle;">`;
            } else if (customStatus.emoji.name) {
                emoji = customStatus.emoji.name;
            }
        }
        if (customStatusEmoji) customStatusEmoji.innerHTML = emoji;
        if (customStatusText) customStatusText.textContent = customStatus.state || 'Online on Discord';
    } else {
        if (customStatusEmoji) customStatusEmoji.textContent = '⚡';
        if (customStatusText) customStatusText.textContent = `Status: ${discord_status.toUpperCase()} • Available`;
    }

    const spotifyCard = document.getElementById('spotify-card');
    const spotifyArt = document.getElementById('spotify-album-art');
    const spotifyTrack = document.getElementById('spotify-track');
    const spotifyArtist = document.getElementById('spotify-artist');
    const spotifyTimeCurrent = document.getElementById('spotify-time-current');
    const spotifyTimeTotal = document.getElementById('spotify-time-total');
    const spotifyProgressFill = document.getElementById('spotify-progress-fill');

    if (spotifyProgressInterval) clearInterval(spotifyProgressInterval);

    if (listening_to_spotify && spotify) {
        if (spotifyCard) spotifyCard.style.display = 'flex';
        if (spotifyArt) spotifyArt.src = spotify.album_art_url;
        if (spotifyTrack) spotifyTrack.textContent = spotify.song;
        if (spotifyArtist) spotifyArtist.textContent = `by ${spotify.artist}`;

        const duration = spotify.timestamps.end - spotify.timestamps.start;
        if (spotifyTimeTotal) spotifyTimeTotal.textContent = formatMs(duration);

        function updateProgress() {
            const elapsed = Date.now() - spotify.timestamps.start;
            const clamped = Math.max(0, Math.min(elapsed, duration));
            const pct = (clamped / duration) * 100;

            if (spotifyTimeCurrent) spotifyTimeCurrent.textContent = formatMs(clamped);
            if (spotifyProgressFill) spotifyProgressFill.style.width = `${pct}%`;

            if (elapsed >= duration) {
                clearInterval(spotifyProgressInterval);
            }
        }

        updateProgress();
        spotifyProgressInterval = setInterval(updateProgress, 1000);
    } else {
        if (spotifyCard) spotifyCard.style.display = 'none';
    }

    const gameActivity = activities ? activities.find(a => a.type !== 4) : null;
    const gameCard = document.getElementById('game-card');
    const gameArt = document.getElementById('game-art');
    const gameName = document.getElementById('game-name');
    const gameState = document.getElementById('game-state');
    const gameDetails = document.getElementById('game-details-text');
    const gameBadge = document.getElementById('game-badge');

    if (gameActivity) {
        if (gameCard) gameCard.style.display = 'flex';
        if (gameName) gameName.textContent = gameActivity.name;
        if (gameState) gameState.textContent = gameActivity.state || 'Active now';
        if (gameDetails) gameDetails.textContent = gameActivity.details || '';

        if (gameArt) {
            if (gameActivity.assets && gameActivity.assets.large_image) {
                let imgUrl = gameActivity.assets.large_image;
                if (imgUrl.startsWith('mp:external/')) {
                    imgUrl = 'https://media.discordapp.net/' + imgUrl.replace('mp:', '');
                } else if (gameActivity.application_id) {
                    imgUrl = `https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${imgUrl}.png`;
                }
                gameArt.src = imgUrl;
                gameArt.style.display = 'block';
            } else {
                gameArt.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop';
            }
        }

        if (gameBadge) {
            let label = 'PLAYING GAME';
            let icon = 'fa-gamepad';
            if (gameActivity.name.toLowerCase().includes('visual studio code') || gameActivity.name.toLowerCase().includes('code')) {
                label = 'DEVELOPING';
                icon = 'fa-code';
            } else if (gameActivity.type === 2) {
                label = 'LISTENING';
                icon = 'fa-headphones';
            } else if (gameActivity.type === 3) {
                label = 'STREAMING / WATCHING';
                icon = 'fa-video';
            }
            gameBadge.innerHTML = `<i class="fa-solid ${icon}"></i> ${label}`;
        }
    } else {
        if (gameCard) gameCard.style.display = 'none';
    }
}

function setMockDiscordState(is404 = false) {
    const statusDot = document.querySelector('.status-dot');
    const headerStatusText = document.getElementById('header-status-text');
    const customStatusEmoji = document.getElementById('custom-status-emoji');
    const customStatusText = document.getElementById('custom-status-text');

    if (statusDot) statusDot.className = 'status-dot offline';
    if (headerStatusText) headerStatusText.textContent = 'DISCORD • STANDBY';

    if (customStatusEmoji) customStatusEmoji.innerHTML = '⚡';
    if (customStatusText) {
        if (is404) {
            customStatusText.innerHTML = `Chưa kích hoạt Lanyard • <a href="https://discord.gg/lanyard" target="_blank" rel="noopener noreferrer" class="lanyard-hint-link">Tham gia server discord.gg/lanyard để kích hoạt</a>`;
        } else {
            customStatusText.textContent = 'Đang kết nối Discord Lanyard...';
        }
    }
}

function formatMs(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function initLocalClock() {
    const clockEl = document.getElementById('local-time');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        clockEl.textContent = `${timeStr} (GMT+7)`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

function initGreeting() {
    const greetingEl = document.getElementById('greeting-text');
    if (!greetingEl) return;

    function computeGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return `Chào buổi sáng ☀️`;
        if (hour >= 11 && hour < 13) return `Chào buổi trưa 🌤️`;
        if (hour >= 13 && hour < 18) return `Chào buổi chiều 🌇`;
        if (hour >= 18 && hour < 22) return `Chào buổi tối 🌙`;
        return `Khuya rồi, ngủ ngon nhé 💤`;
    }

    const quoteList = [computeGreeting()];
    if (CONFIG.profile && Array.isArray(CONFIG.profile.quotes) && CONFIG.profile.quotes.length > 0) {
        quoteList.push(...CONFIG.profile.quotes);
    }

    let currentIndex = 0;

    function typeText(text, done) {
        const arr = Array.from(text);
        let i = 0;
        greetingEl.textContent = '';
        function step() {
            if (i < arr.length) {
                greetingEl.textContent += arr[i];
                i++;
                setTimeout(step, 45);
            } else if (done) {
                done();
            }
        }
        step();
    }

    function deleteText(done) {
        function step() {
            const arr = Array.from(greetingEl.textContent);
            if (arr.length > 0) {
                arr.pop();
                greetingEl.textContent = arr.join('');
                setTimeout(step, 20);
            } else {
                done();
            }
        }
        step();
    }

    function loop() {
        const currentItem = quoteList[currentIndex];
        typeText(currentItem, () => {
            setTimeout(() => {
                deleteText(() => {
                    currentIndex = (currentIndex + 1) % quoteList.length;
                    if (currentIndex === 0) quoteList[0] = computeGreeting();
                    setTimeout(loop, 350);
                });
            }, 2800);
        });
    }

    loop();
}

function showToast(message, icon = 'fa-solid fa-circle-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

function playBeepSound(freq = 520, duration = 0.08) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
    }
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('alex_bio_theme') || (CONFIG.effects && CONFIG.effects.defaultTheme) || 'light';
    applyTheme(savedTheme, false);

    function applyTheme(theme, showFeedback = true) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            if (themeLabel) themeLabel.textContent = 'LIGHT';
            if (showFeedback) showToast('Đã chuyển sang Light Theme', 'fa-solid fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            if (themeLabel) themeLabel.textContent = 'DARK';
            if (showFeedback) showToast('Đã chuyển sang Dark Theme', 'fa-solid fa-moon');
        }
        localStorage.setItem('alex_bio_theme', theme);
    }

    toggleBtn.addEventListener('click', () => {
        playBeepSound(640, 0.06);
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme, true);
    });
}
