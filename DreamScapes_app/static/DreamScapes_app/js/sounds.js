document.addEventListener('DOMContentLoaded', function () {
    const playingAudios = new Map();

    // Toggle playback of a sound when a card is clicked.
    function toggleSound(card, audio, audioSrc) {
        if (audio.paused) {
            audio.play();
            card.classList.add('active-sound');
            addToCurrentMix(audioSrc);
        } else {
            audio.pause();
            audio.currentTime = 0;
            card.classList.remove('active-sound');
            removeFromCurrentMix(audioSrc);
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
    //  Save current mix
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
            const audio = new Audio(audioSrc);
            audio.loop = true;

            card.addEventListener('click', function () {
                toggleSound(card, audio, audioSrc);
            });

            audio.addEventListener('ended', function () {
                card.classList.remove('active-sound');
            });
        }
    });

    // Add event listener for the save mix button.
    document.getElementById('saveMix').addEventListener('click', function () {
        // Call saveCurrentMix without mixId when the save mix button is clicked.
        // If you want to update an existing mix, you'd call saveCurrentMix with the appropriate mixId.
        saveCurrentMix();
        
    });
});
