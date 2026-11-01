/* =============================================================================
   CHAMFER TECH DESKTOP UI CONTROLLER
   Standard: Modern Tech Minimal, 120ms Micro-Interactions, 1-Click Pipeline
   Integrations: Discord Lanyard WebSocket, Spotify Live Sync, HQ Audio Player
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initProfileUI();
    initClickToEnter();
    initTitlebarControls();
    initAudioController();
    initLanyardRealtime();
    initLocalClock();
    initGreeting();
    initThemeToggle();
});

/* -----------------------------------------------------------------------------
   PROFILE UI INITIALIZATION
   ----------------------------------------------------------------------------- */
function initProfileUI() {
    if (typeof CONFIG === 'undefined') return;

    document.title = `${CONFIG.profile.name || 'alex'} // chamfer-tech dashboard`;

    const nameEl = document.getElementById('user-display-name');
    const handleEl = document.getElementById('user-handle');
    const taglineEl = document.getElementById('user-tagline');
    const bioEl = document.getElementById('user-bio');
    const avatarEl = document.getElementById('profile-avatar');
    const bannerEl = document.getElementById('card-banner');
    const locationEl = document.getElementById('user-location');

    if (nameEl && CONFIG.profile.name) nameEl.textContent = CONFIG.profile.name;
    if (handleEl && CONFIG.profile.username) handleEl.textContent = `@${CONFIG.profile.username}`;
    if (taglineEl && CONFIG.profile.title) taglineEl.textContent = CONFIG.profile.title;
    if (bioEl && CONFIG.profile.bio) bioEl.textContent = CONFIG.profile.bio;
    if (locationEl && CONFIG.profile.location) locationEl.textContent = CONFIG.profile.location;
    if (avatarEl && CONFIG.profile.avatar) avatarEl.src = CONFIG.profile.avatar;
    if (bannerEl && CONFIG.profile.banner) bannerEl.style.backgroundImage = `url('${CONFIG.profile.banner}')`;

    // Launcher identity
    const enterAvatarEl = document.querySelector('.enter-avatar-img');
    const enterNameEl = document.querySelector('.enter-name');
    const enterSubtextEl = document.querySelector('.enter-subtext');
    if (enterAvatarEl && CONFIG.profile.avatar) enterAvatarEl.src = CONFIG.profile.avatar;
    if (enterNameEl && CONFIG.profile.name) enterNameEl.textContent = CONFIG.profile.name;
    if (enterSubtextEl && CONFIG.profile.title) enterSubtextEl.textContent = CONFIG.profile.title;

    // Badges (Solid color icon, strictly no glow/drop-shadow)
    const badgesContainer = document.getElementById('badges-container');
    if (badgesContainer && Array.isArray(CONFIG.profile.badges)) {
        badgesContainer.innerHTML = '';
        CONFIG.profile.badges.forEach(badge => {
            const pill = document.createElement('div');
            pill.className = 'badge-pill';
            const colorAttr = badge.color ? `style="color: ${badge.color};"` : '';
            pill.innerHTML = `<i class="${badge.icon}" ${colorAttr}></i> <span>${badge.label.toLowerCase()}</span>`;
            badgesContainer.appendChild(pill);
        });
    }

    // Affiliated Discord Servers
    const serversGrid = document.getElementById('servers-grid');
    if (serversGrid && Array.isArray(CONFIG.servers)) {
        serversGrid.innerHTML = '';
        CONFIG.servers.forEach((srv, idx) => {
            const wrap = document.createElement('div');
            wrap.className = 'chamfer-server-wrap';
            wrap.id = `server-card-${idx}`;
            wrap.innerHTML = `
                <div class="server-card">
                    <div class="server-body">
                        <div class="server-icon-wrap">
                            <img src="${srv.icon}" alt="${srv.name} Icon" class="server-icon" id="server-icon-${idx}">
                        </div>
                        <div class="server-content">
                            <div class="server-top-line">
                                <span class="server-name" id="server-name-${idx}">${srv.name}</span>
                                <span class="server-tag">${(srv.tag || 'community').toLowerCase()}</span>
                            </div>
                            <div class="server-desc">${srv.description || srv.role}</div>
                        </div>
                    </div>
                    <a href="${srv.inviteUrl}" target="_blank" rel="noopener noreferrer" class="server-join-btn">
                        <i class="fa-brands fa-discord"></i> <span>join</span>
                    </a>
                </div>
            `;
            serversGrid.appendChild(wrap);

            const iconEl = wrap.querySelector('.server-icon');
            if (iconEl && srv.cdnIcon) {
                iconEl.onerror = () => {
                    if (iconEl.src !== srv.cdnIcon) iconEl.src = srv.cdnIcon;
                };
            }

            fetchDiscordInviteData(srv.inviteUrl, idx);
        });
    }

    // Direct Connections / Socials
    const socialsList = document.getElementById('socials-list');
    if (socialsList && Array.isArray(CONFIG.socials)) {
        socialsList.innerHTML = '';
        CONFIG.socials.forEach(soc => {
            const wrap = document.createElement('div');
            wrap.className = 'chamfer-social-wrap';
            wrap.innerHTML = `
                <a class="social-pill" href="${soc.url}" target="_blank" rel="noopener noreferrer">
                    <i class="${soc.icon}"></i> <span>${soc.name.toLowerCase()}</span>
                </a>
            `;

            if (soc.copy) {
                const linkEl = wrap.querySelector('a');
                linkEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(soc.copy);
                    showToast(`đã sao chép ${soc.name}: ${soc.copy}`);
                });
            }

            socialsList.appendChild(wrap);
        });
    }

    // Tech Stack / Vibes Grid
    const arsenalGrid = document.getElementById('arsenal-grid');
    if (arsenalGrid && Array.isArray(CONFIG.techStack) && CONFIG.techStack.length > 0) {
        arsenalGrid.innerHTML = '';
        CONFIG.techStack.forEach(item => {
            const wrap = document.createElement('div');
            wrap.className = 'chamfer-pill-wrap';
            wrap.innerHTML = `
                <div class="arsenal-pill">
                    <i class="${item.icon} pill-icon"></i>
                    <div class="pill-info">
                        <span class="pill-name">${item.name}</span>
                        <span class="pill-sub">${item.domain.toLowerCase()}</span>
                    </div>
                </div>
            `;
            arsenalGrid.appendChild(wrap);
        });
    }

    // 1-Click Pipeline: Copy Discord Tag
    const copyTagBtn = document.getElementById('copy-tag-btn');
    if (copyTagBtn) {
        copyTagBtn.addEventListener('click', () => {
            const textToCopy = CONFIG.discordId || CONFIG.profile.username;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`đã sao chép discord id: ${textToCopy}`);
                playBeepSound(600, 0.08);
            });
        });
    }

    // 1-Click Pipeline: Copy Page Link
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('đã sao chép liên kết trang');
                playBeepSound(680, 0.08);
            });
        });
    }

    // 1-Click Pipeline: Sync Telemetry
    const syncBtn = document.getElementById('sync-telemetry-btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            const icon = syncBtn.querySelector('i');
            if (icon) icon.classList.add('fa-spin');
            syncBtn.style.opacity = '0.5';
            playBeepSound(540, 0.06);
            connectLanyardWebSocket();
            showToast('đã đồng bộ lại telemetry & presence');
            setTimeout(() => {
                syncBtn.style.opacity = '1';
                if (icon) icon.classList.remove('fa-spin');
            }, 600);
        });
    }
}

/* -----------------------------------------------------------------------------
   DISCORD INVITE COUNTER FETCH
   ----------------------------------------------------------------------------- */
async function fetchDiscordInviteData(inviteUrl, idx) {
    try {
        const code = inviteUrl.split('/').pop().trim();
        if (!code) return;
        const res = await fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.guild) return;

        const nameEl = document.getElementById(`server-name-${idx}`);
        const iconEl = document.getElementById(`server-icon-${idx}`);

        if (nameEl && data.guild.name) nameEl.textContent = data.guild.name;
        if (iconEl && data.guild.icon) {
            const ext = data.guild.icon.startsWith('a_') ? 'gif' : 'png';
            iconEl.src = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.${ext}?size=256`;
        }
    } catch (e) { }
}

/* -----------------------------------------------------------------------------
   macOS TITLEBAR CONTROLS
   ----------------------------------------------------------------------------- */
function initTitlebarControls() {
    const closeBtn = document.getElementById('titlebar-close-btn');
    const minBtn = document.getElementById('titlebar-min-btn');
    const maxBtn = document.getElementById('titlebar-max-btn');
    const overlay = document.getElementById('enter-overlay');
    const windowFrame = document.getElementById('window-frame');

    // Red: Lock view / return to launcher
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            playBeepSound(420, 0.08);
            if (overlay) {
                overlay.classList.remove('entered');
                showToast('đã khóa màn hình desktop', 'fa-solid fa-lock');
            }
        });
    }

    // Yellow: Minimize / compact view toggle
    if (minBtn && windowFrame) {
        minBtn.addEventListener('click', () => {
            playBeepSound(520, 0.06);
            windowFrame.classList.toggle('compact-mode');
            const isCompact = windowFrame.classList.contains('compact-mode');
            showToast(isCompact ? 'chế độ thu gọn (compact)' : 'chế độ mở rộng (standard)');
        });
    }

    // Green: Re-run sequence / refresh telemetry pipeline
    if (maxBtn) {
        maxBtn.addEventListener('click', () => {
            playBeepSound(700, 0.08);
            connectLanyardWebSocket();
            showToast('đang chạy lại chuỗi đồng bộ telemetry...', 'fa-solid fa-arrows-rotate');
        });
    }
}

/* -----------------------------------------------------------------------------
   CLICK TO ENTER / LAUNCHER PIPELINE
   ----------------------------------------------------------------------------- */
function initClickToEnter() {
    const overlay = document.getElementById('enter-overlay');
    const enterBtn = document.getElementById('launcher-enter-btn');
    if (!overlay) return;

    function handleEnter() {
        if (overlay.classList.contains('entered')) return;
        overlay.classList.add('entered');
        playBeepSound(640, 0.08);

        if (CONFIG.music && CONFIG.music.autoplayOnEnter) {
            const audio = document.getElementById('bg-audio');
            if (audio) {
                audio.play().then(() => {
                    updateAudioWidgetState(true);
                    if (playlist.length > 0 && playlist[currentTrackIndex]) {
                        showToast(`đang phát: ${playlist[currentTrackIndex].title}`, 'fa-solid fa-music');
                    }
                }).catch(() => { });
            }
        }
    }

    overlay.addEventListener('click', (e) => {
        // Prevent accidental trigger if clicking links inside launcher
        if (e.target && e.target.tagName === 'A') return;
        handleEnter();
    });

    if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEnter();
        });
    }
}

/* -----------------------------------------------------------------------------
   AUDIO PLAYER CONTROLLER (HQ Audio Stream)
   ----------------------------------------------------------------------------- */
let currentTrackIndex = 0;
let playlist = [];

function initAudioController() {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('audio-play-btn');
    const prevBtn = document.getElementById('audio-prev-btn');
    const nextBtn = document.getElementById('audio-next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.querySelector('.volume-icon');
    const trackTitle = document.getElementById('audio-track-title');
    const artistName = document.getElementById('audio-artist-name');
    const livePill = document.getElementById('audio-live-pill');
    const audioProgressTrack = document.getElementById('audio-progress-track');
    const audioProgressFill = document.getElementById('audio-progress-fill');
    const audioTimeCurrent = document.getElementById('audio-time-current');
    const audioTimeTotal = document.getElementById('audio-time-total');

    if (!audio || !CONFIG.music) return;

    if (Array.isArray(CONFIG.music.playlist) && CONFIG.music.playlist.length > 0) {
        playlist = [...CONFIG.music.playlist];
    } else if (CONFIG.music.url) {
        playlist = [{
            title: CONFIG.music.title || 'audio stream',
            artist: CONFIG.music.artist || 'alex',
            url: CONFIG.music.url
        }];
    }

    audio.volume = typeof CONFIG.music.volume === 'number' ? CONFIG.music.volume : 0.45;
    if (volumeSlider) volumeSlider.value = audio.volume;

    function updateVolumeIcon(vol) {
        if (!volumeIcon) return;
        if (vol <= 0.01) volumeIcon.className = 'fa-solid fa-volume-xmark volume-icon';
        else if (vol < 0.5) volumeIcon.className = 'fa-solid fa-volume-low volume-icon';
        else volumeIcon.className = 'fa-solid fa-volume-high volume-icon';
    }
    updateVolumeIcon(audio.volume);

    if (volumeIcon) {
        let prevVol = audio.volume;
        volumeIcon.style.cursor = 'pointer';
        volumeIcon.title = 'tắt/bật âm thanh';
        volumeIcon.addEventListener('click', () => {
            if (audio.volume > 0.01) {
                prevVol = audio.volume;
                audio.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
            } else {
                audio.volume = prevVol > 0.05 ? prevVol : 0.45;
                if (volumeSlider) volumeSlider.value = audio.volume;
            }
            updateVolumeIcon(audio.volume);
        });
    }

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

        if (trackTitle) trackTitle.textContent = track.title;
        if (artistName) artistName.textContent = track.artist;
        if (audioProgressFill) audioProgressFill.style.width = '0%';
        if (audioTimeCurrent) audioTimeCurrent.textContent = '0:00';

        if (livePill) {
            livePill.innerHTML = `<i class="fa-solid fa-circle-play"></i> stream ${currentTrackIndex + 1}/${playlist.length}`;
            livePill.onclick = () => {
                if (CONFIG.music && CONFIG.music.youtubePlaylistUrl) {
                    window.open(CONFIG.music.youtubePlaylistUrl, '_blank');
                }
            };
        }

        if (autoPlay) {
            audio.play().then(() => {
                updateAudioWidgetState(true);
                showToast(`đang phát: ${track.title} • ${track.artist}`, 'fa-solid fa-music');
            }).catch(() => {
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
                audio.play().then(() => updateAudioWidgetState(true)).catch(() => { });
            } else {
                audio.pause();
                updateAudioWidgetState(false);
            }
        });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => window.playNextTrack());
    if (prevBtn) prevBtn.addEventListener('click', () => window.playPrevTrack());

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = parseFloat(e.target.value);
            updateVolumeIcon(audio.volume);
        });
    }

    // Progress bar scrub & updates
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const pct = (audio.currentTime / audio.duration) * 100;
            if (audioProgressFill) audioProgressFill.style.width = `${pct}%`;
            if (audioTimeCurrent) audioTimeCurrent.textContent = formatSeconds(audio.currentTime);
            if (audioTimeTotal) audioTimeTotal.textContent = formatSeconds(audio.duration);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration) && audioTimeTotal) {
            audioTimeTotal.textContent = formatSeconds(audio.duration);
        }
    });

    if (audioProgressTrack) {
        audioProgressTrack.addEventListener('click', (e) => {
            const rect = audioProgressTrack.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));
            if (!isNaN(audio.duration) && audio.duration > 0) {
                audio.currentTime = ratio * audio.duration;
                playBeepSound(500, 0.04);
            }
        });
    }

    audio.addEventListener('play', () => updateAudioWidgetState(true));
    audio.addEventListener('pause', () => updateAudioWidgetState(false));
    audio.addEventListener('ended', () => window.playNextTrack());
    audio.addEventListener('error', () => {
        setTimeout(() => window.playNextTrack(), 800);
    });
}

function updateAudioWidgetState(isPlaying) {
    const playIcon = document.getElementById('play-icon');
    const eq = document.getElementById('equalizer');

    if (isPlaying) {
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        if (eq) eq.classList.add('active');
    } else {
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (eq) eq.classList.remove('active');
    }
}

/* -----------------------------------------------------------------------------
   DISCORD LANYARD REALTIME WEBSOCKET
   ----------------------------------------------------------------------------- */
let spotifyProgressInterval = null;

function initLanyardRealtime() {
    if (!CONFIG.discordId) {
        setMockDiscordState();
        return;
    }
    connectLanyardWebSocket();
}

function connectLanyardWebSocket() {
    try {
        const ws = new WebSocket('wss://api.lanyard.rest/socket');
        let heartbeatInterval = null;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: CONFIG.discordId }
            }));
            const pingBadge = document.getElementById('lanyard-ping');
            if (pingBadge) pingBadge.style.opacity = '1';
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const { op, t, d } = data;

                if (op === 1) {
                    heartbeatInterval = setInterval(() => {
                        ws.send(JSON.stringify({ op: 3 }));
                    }, d.heartbeat_interval);
                }

                if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
                    updateDiscordPresenceUI(d);
                }
            } catch (e) { }
        };

        ws.onerror = () => fetchLanyardREST();

        ws.onclose = () => {
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            setTimeout(fetchLanyardREST, 5000);
        };
    } catch (e) {
        fetchLanyardREST();
    }
}

async function fetchLanyardREST() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`);
        if (res.status === 404) {
            setMockDiscordState(true);
            return;
        }
        const json = await res.json();
        if (json && json.success && json.data) {
            updateDiscordPresenceUI(json.data);
        } else {
            setMockDiscordState(true);
        }
    } catch (e) {
        setMockDiscordState(false);
    }
}

function updateDiscordPresenceUI(data) {
    if (!data || !data.discord_status) {
        setMockDiscordState(true);
        return;
    }

    const { discord_user, discord_status, activities, listening_to_spotify, spotify } = data;

    // Live Avatar
    if (discord_user && discord_user.avatar) {
        const ext = discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
        const liveAvatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${ext}?size=256`;
        const avatarEl = document.getElementById('profile-avatar');
        if (avatarEl) avatarEl.src = liveAvatarUrl;
        const enterAvatarEl = document.querySelector('.enter-avatar-img');
        if (enterAvatarEl) enterAvatarEl.src = liveAvatarUrl;
    }

    // Status Dots & Header
    const statusDots = document.querySelectorAll('.status-dot');
    const headerStatusText = document.getElementById('header-status-text');

    statusDots.forEach(dot => {
        dot.className = `status-dot ${discord_status}`;
    });
    const statusMap = {
        online: 'active • online',
        idle: 'idle • away',
        dnd: 'dnd • do not disturb',
        offline: 'offline • standby'
    };
    if (headerStatusText) headerStatusText.textContent = statusMap[discord_status] || `${discord_status.toLowerCase()} • active`;

    // Avatar Decoration Sync
    const decorationAsset = discord_user && discord_user.avatar_decoration_data
        ? discord_user.avatar_decoration_data.asset
        : null;
    document.querySelectorAll('.avatar-decoration').forEach(el => {
        if (decorationAsset) {
            const url = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png`;
            if (el.getAttribute('src') !== url) el.src = url;
            el.style.display = 'block';
        } else if (el.getAttribute('src')) {
            el.style.display = 'block';
        }
    });

    // Custom Status
    const customStatus = activities ? activities.find(a => a.type === 4) : null;
    const customStatusEmoji = document.getElementById('custom-status-emoji');
    const customStatusText = document.getElementById('custom-status-text');

    if (customStatus) {
        let emoji = '💬';
        if (customStatus.emoji) {
            if (customStatus.emoji.id) {
                emoji = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" style="width:16px;height:16px;vertical-align:middle;">`;
            } else if (customStatus.emoji.name) {
                emoji = customStatus.emoji.name;
            }
        }
        if (customStatusEmoji) customStatusEmoji.innerHTML = emoji;
        if (customStatusText) customStatusText.textContent = customStatus.state || 'Online on Discord';
    } else {
        if (customStatusEmoji) customStatusEmoji.textContent = '⚡';
        if (customStatusText) customStatusText.textContent = `status: ${discord_status.toLowerCase()} • active`;
    }

    // Spotify Activity
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

            if (elapsed >= duration) clearInterval(spotifyProgressInterval);
        }

        updateProgress();
        spotifyProgressInterval = setInterval(updateProgress, 1000);
    } else {
        if (spotifyCard) spotifyCard.style.display = 'none';
    }

    // Game / Code Activity
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
                gameArt.src = 'images/avatar.png';
            }
        }

        if (gameBadge) {
            let label = 'game activity';
            let icon = 'fa-gamepad';
            const actName = gameActivity.name.toLowerCase();
            if (actName.includes('code') || actName.includes('studio') || actName.includes('sublime')) {
                label = 'developing';
                icon = 'fa-code';
            } else if (gameActivity.type === 2) {
                label = 'listening';
                icon = 'fa-headphones';
            }
            gameBadge.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${label}</span>`;
        }
    } else {
        if (gameCard) gameCard.style.display = 'none';
    }
}

function setMockDiscordState(is404 = false) {
    document.querySelectorAll('.status-dot').forEach(dot => {
        dot.className = 'status-dot online';
    });
    const headerStatusText = document.getElementById('header-status-text');
    const customStatusEmoji = document.getElementById('custom-status-emoji');
    const customStatusText = document.getElementById('custom-status-text');

    if (headerStatusText) headerStatusText.textContent = 'standby';

    if (customStatusEmoji) customStatusEmoji.innerHTML = '⚡';
    if (customStatusText) {
        customStatusText.textContent = is404
            ? 'lanyard standby • online'
            : 'đang kết nối discord lanyard...';
    }
}

function formatMs(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function formatSeconds(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    const totalSec = Math.floor(sec);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* -----------------------------------------------------------------------------
   LOCAL MONO CLOCK
   ----------------------------------------------------------------------------- */
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

/* -----------------------------------------------------------------------------
   TYPEWRITER GREETING & QUOTES
   ----------------------------------------------------------------------------- */
function initGreeting() {
    const greetingEl = document.getElementById('greeting-text');
    if (!greetingEl) return;

    function computeGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return `chào buổi sáng, sẵn sàng build code`;
        if (hour >= 11 && hour < 13) return `chào buổi trưa, nạp năng lượng`;
        if (hour >= 13 && hour < 18) return `chào buổi chiều, tập trung triển khai`;
        if (hour >= 18 && hour < 22) return `chào buổi tối, chill & code`;
        return `khuya rồi, chúc ngủ ngon`;
    }

    const quoteList = [computeGreeting()];
    if (CONFIG.profile && Array.isArray(CONFIG.profile.quotes) && CONFIG.profile.quotes.length > 0) {
        quoteList.push(...CONFIG.profile.quotes.map(q => q.toLowerCase()));
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
                setTimeout(step, 40);
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
                setTimeout(step, 18);
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
                    setTimeout(loop, 300);
                });
            }, 3000);
        });
    }

    loop();
}

/* -----------------------------------------------------------------------------
   THEME TOGGLE (Light / Dark)
   ----------------------------------------------------------------------------- */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('alex_tech_theme') || localStorage.getItem('alex_bio_theme') || 'light';
    applyTheme(savedTheme, false);

    function applyTheme(theme, showFeedback = true) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            if (themeLabel) themeLabel.textContent = 'light';
            if (showFeedback) showToast('đã chuyển sang light tech theme', 'fa-solid fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            if (themeLabel) themeLabel.textContent = 'dark';
            if (showFeedback) showToast('đã chuyển sang dark tech theme', 'fa-solid fa-moon');
        }
        localStorage.setItem('alex_tech_theme', theme);
    }

    toggleBtn.addEventListener('click', () => {
        playBeepSound(640, 0.06);
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme, true);
    });
}

/* -----------------------------------------------------------------------------
   TOAST NOTIFICATION (Chamfer Minimalist)
   ----------------------------------------------------------------------------- */
function showToast(message, icon = 'fa-solid fa-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 200);
    }, 2400);
}

/* -----------------------------------------------------------------------------
   AUDIO BEEP SYNTHESIZER (Micro-interaction feedback)
   ----------------------------------------------------------------------------- */
function playBeepSound(freq = 520, duration = 0.06) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) { }
}
