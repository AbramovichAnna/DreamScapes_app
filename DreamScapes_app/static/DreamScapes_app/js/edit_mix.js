document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent any default behavior
        const mixId = this.getAttribute('data-mix-id');
        openModalWithMixData(mixId);
    });
});