
document.addEventListener('DOMContentLoaded', function () {
    const playingAudios = new Map();

    // Function to toggle the active state of all cards with a specific audio source.
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

    // Toggle playback of a sound when a card is clicked.
    function toggleSound(card, audio, audioSrc) {
        // Check if the clicked card is within the "Current Mix" pane.
        const isCurrentMixPane = card.closest('#current-mix') !== null;
    
        if (isCurrentMixPane) {
            // If clicked from "Current Mix" pane, pause and reset the audio.
            audio.pause();
            audio.currentTime = 0;
            // Mark all cards with the same audio source as inactive.
            setActiveStateToAllCardsWithAudioSrc(audioSrc, false);
            // Remove the audio from the "Current Mix" section.
            removeFromCurrentMix(audioSrc);
        } else {
            // If the audio is paused and clicked outside the "Current Mix" pane, play it.
            if (audio.paused) {
                audio.play();
                // Mark all cards with the same audio source as active.
                setActiveStateToAllCardsWithAudioSrc(audioSrc, true);
                // Add the audio to the "Current Mix" section.
                addToCurrentMix(audioSrc);
            } else {
                // If the audio is playing and clicked outside the "Current Mix" pane, pause and reset it.
                audio.pause();
                audio.currentTime = 0;
                // Mark all cards with the same audio source as inactive.
                setActiveStateToAllCardsWithAudioSrc(audioSrc, false);
                // Remove the audio from the "Current Mix" section.
                removeFromCurrentMix(audioSrc);
            }
        }
    }

    // Add a sound card to the "Current Mix" section.
    function addToCurrentMix(audioSrc) {
        const currentMixRow = document.getElementById('current-mix-row');
        const originalCard = document.querySelector(`.card[data-audio-src="${audioSrc}"]`);
        if (originalCard) {
            const cardClone = originalCard.cloneNode(true);
            currentMixRow.appendChild(cardClone);

            const audioClone = new Audio(audioSrc);
            audioClone.loop = true;
            cardClone.addEventListener('click', function () {
                toggleSound(cardClone, audioClone, audioSrc);
            });
        }
    }

    // Remove a sound card from the "Current Mix" section.
    function removeFromCurrentMix(audioSrc) {
        const currentMixRow = document.getElementById('current-mix-row');
        const cardToRemove = currentMixRow.querySelector(`.card[data-audio-src="${audioSrc}"]`);
        if (cardToRemove) {
            currentMixRow.removeChild(cardToRemove);
        }
    }
    // Save the current mix.
    function saveCurrentMix(mixId) {
        const activeSoundCards = document.querySelectorAll('.card.active-sound');
        const soundIds = [...activeSoundCards].map(card => card.getAttribute('data-sound-id'));

        // Update the hidden sound fields in the save mix modal.
        const hiddenSoundFields = document.getElementById('hiddenSoundFields');
        hiddenSoundFields.innerHTML = ''; // Clear any existing inputs
        soundIds.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'sound_ids[]';
            input.value = id;
            hiddenSoundFields.appendChild(input);
        });

        // Set the mix ID if provided.
        if (mixId) {
            document.getElementById('mixId').value = mixId;
        } else {
            document.getElementById('mixId').value = ''; // Clear the mix ID for new mixes
        }

        // Now open the modal for the user to provide a mix name.
        $('#saveMixModal').modal('show');
            // Check if there's an error in the response
            if (response.error) {
                // Show the error modal
                $('#errorModal').modal('show');
            } else {
                // Show the success modal
                $('#successModal').modal('show');
            }
    
    }

    // Attach event listeners to each sound card.
    const soundCards = document.querySelectorAll('.card');
    soundCards.forEach(card => {
        const audioSrc = card.getAttribute('data-audio-src');
        if (audioSrc) {
            // Create or retrieve the audio element associated with the audioSrc.
            let audio = playingAudios.get(audioSrc) || new Audio(audioSrc);
            audio.loop = true;
            // Store or update the audio element in the map.
            playingAudios.set(audioSrc, audio);

            // Add click event listener to the card to toggle its sound.
            card.addEventListener('click', function () {
                toggleSound(card, audio, audioSrc);
            });

            // If the audio ends, mark all cards with the same audio source as inactive.
            audio.addEventListener('ended', function () {
                setActiveStateToAllCardsWithAudioSrc(audioSrc, false);
            });
        }
    });

    // Add event listener for the save mix button.
    document.getElementById('saveMix').addEventListener('click', function () {
        // Call the saveCurrentMix function.
        saveCurrentMix();
    });
});
