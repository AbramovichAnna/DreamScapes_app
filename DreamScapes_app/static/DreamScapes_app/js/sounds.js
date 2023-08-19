document.addEventListener('DOMContentLoaded', function () {

    let playingAudios = new Map();  // Stores the currently playing audio elements.

    function setActiveStateToAllCardsWithAudioSrc(audioSrc, isActive) {
        const cards = document.querySelectorAll(`.card[data-audio-src="${audioSrc}"]`);
        cards.forEach(card => {
            if (isActive) {
                card.classList.add('active-sound');
            } else {
                card.classList.remove('active-sound');
            }
        });
    }

    function toggleSound(card, audio, audioSrc) {
        if (playingAudios.has(audioSrc)) {
            let playingAudio = playingAudios.get(audioSrc);
            playingAudio.pause();
            playingAudio.currentTime = 0;
            setActiveStateToAllCardsWithAudioSrc(audioSrc, false);
            playingAudios.delete(audioSrc);
        } else {
            audio.play();
            setActiveStateToAllCardsWithAudioSrc(audioSrc, true);
            playingAudios.set(audioSrc, audio);
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
                setActiveStateToAllCardsWithAudioSrc(audioSrc, false);
            });
        }
    });

    // This is just for restoring the state of a single sound on page load.
    const activeSoundSrc = localStorage.getItem('activeSound');
    const isPlaying = localStorage.getItem('isPlaying') === 'true';

    if (activeSoundSrc && isPlaying) {
        const audio = new Audio(activeSoundSrc);
        audio.loop = true;
        audio.play();

        setActiveStateToAllCardsWithAudioSrc(activeSoundSrc, true);
        playingAudios.set(activeSoundSrc, audio);
    }
});


const mixerModal = document.getElementById('mixerModal');
const closeBtn = document.querySelector('.close-btn');
const mixerBtn = document.getElementById('mixer');

// Function to show the modal
mixerBtn.addEventListener('click', function() {
    // Populate the list of playing sounds here if needed
    // Example: document.getElementById('playingSoundsList').innerHTML = 'Sound 1, Sound 2, ...';

    // Show the modal
    mixerModal.style.display = 'block';
});

// Function to close the modal
closeBtn.addEventListener('click', function() {
    mixerModal.style.display = 'none';
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    if (event.target === mixerModal) {
        mixerModal.style.display = 'none';
    }
});
