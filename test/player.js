$(document).ready(function() {
    const audio = $('#audioPlayer')[0];
    const playBtn = $('#playBtn');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const volumeBtn = $('#volumeBtn');
    const progress = $('.progress');
    const progressBar = $('.progress-bar');
    const currentTimeSpan = $('#currentTime');
    const durationSpan = $('#duration');
    const vinylRecord = $('#vinylRecord').parent();
    const lyricsContainer = $('#lyrics'); // 歌词显示区域

    let lyrics = [];
    let currentLyricIndex = 0;

    // 加载LRC歌词文件
    function loadLrcFile(url, callback) {
        $.get(url, function(lrcText) {
            callback(parseLrc(lrcText));
        }).fail(function() {
            console.error('Failed to load LRC file.');
        });
    }

    // 解析LRC歌词
    function parseLrc(lrc) {
        const lines = lrc.trim().split('\n');
        const parsedLyrics = [];
        lines.forEach(line => {
            const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const text = match[3];
                parsedLyrics.push({
                    time: minutes * 60 + seconds, // 转换为秒
                    text: text
                });
            }
        });
        return parsedLyrics;
    }

    // 更新歌词显示
    function updateLyrics(currentTime) {
        while (currentLyricIndex < lyrics.length && currentTime >= lyrics[currentLyricIndex].time) {
            currentLyricIndex++;
        }
        if (currentLyricIndex > 0) {
            lyricsContainer.html(lyrics[currentLyricIndex - 1].text.replace(/<br>/g, '\n')); // 更新歌词
        }
    }

    // 加载LRC歌词文件
    loadLrcFile('src/孤独患者-陈奕迅.lrc', function(parsedLyrics) {
        lyrics = parsedLyrics;
    });

    // Form validation
    $('#searchForm').on('submit', function(e) {
        e.preventDefault();
        const searchInput = $(this).find('input');
        if (searchInput.val().trim() === '') {
            searchInput.addClass('is-invalid');
            return;
        }
        searchInput.removeClass('is-invalid');
        // Handle search...
    });

    // Play/Pause
    playBtn.on('click', function() {
        if (audio.paused) {
            audio.play();
            playBtn.html('<i class="bi bi-pause-fill"></i>');
            vinylRecord.addClass('playing');
        } else {
            audio.pause();
            playBtn.html('<i class="bi bi-play-fill"></i>');
            vinylRecord.removeClass('playing');
        }
    });

    // Update progress bar
    audio.addEventListener('timeupdate', function() {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.css('width', `${percent}%`);
        currentTimeSpan.text(formatTime(audio.currentTime));
        if (lyrics.length > 0) {
            updateLyrics(audio.currentTime); // 更新歌词
        }
    });

    // Set duration when metadata is loaded
    audio.addEventListener('loadedmetadata', function() {
        durationSpan.text(formatTime(audio.duration));
    });

    // Click on progress bar to seek
    progress.on('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Volume control
    let isMuted = false;
    volumeBtn.on('click', function() {
        if (isMuted) {
            audio.volume = 1;
            volumeBtn.html('<i class="bi bi-volume-up-fill"></i>');
        } else {
            audio.volume = 0;
            volumeBtn.html('<i class="bi bi-volume-mute-fill"></i>');
        }
        isMuted = !isMuted;
    });

    // Previous and Next buttons (placeholder functionality)
    prevBtn.on('click', function() {
        // Handle previous track
        console.log('Previous track');
    });

    nextBtn.on('click', function() {
        // Handle next track
        console.log('Next track');
    });
});
