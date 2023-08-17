document.addEventListener('DOMContentLoaded', function () {

    function toggleSound(card, audio, audioSrc) {
        if (audio.paused) {
            audio.play();
            card.classList.add('active-sound');
            localStorage.setItem('activeSound', audioSrc);
            localStorage.setItem('isPlaying', 'true');
        } else {
            audio.pause();
            audio.currentTime = 0;
            card.classList.remove('active-sound');
            localStorage.removeItem('activeSound');
            localStorage.setItem('isPlaying', 'false');
        }
    }

    const soundCards = document.querySelectorAll('.card');

    soundCards.forEach(card => {
        const audioSrc = card.getAttribute('data-audio-src');
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.loop = true;

            card.addEventListener('click', function () {
                toggleSound(card, audio, audioSrc);
            });

            audio.addEventListener('ended', function() {
                card.classList.remove('active-sound');
            });
        }
    });

    // Play the sound if it was active before a refresh or navigating to another page.
    const activeSoundSrc = localStorage.getItem('activeSound');
    const isPlaying = localStorage.getItem('isPlaying') === 'true';

    if (activeSoundSrc && isPlaying) {
        const audio = new Audio(activeSoundSrc);
        audio.loop = true;
        audio.play();

        // Mark the card corresponding to the active sound.
        const activeCard = document.querySelector(`.card[data-audio-src="${activeSoundSrc}"]`);
        if (activeCard) {
            activeCard.classList.add('active-sound');
        }
    }
});
