
// Initialization and main functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialization started');
    const initializer = new ProgramInitializer();
    initializer.initialize()
        .catch(error => {
            console.error('Initialization Error:', error);
            PopupHandler.showError('Could not initialize the program. Check the console for details.');
        });
});
