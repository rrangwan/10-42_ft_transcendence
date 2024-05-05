
document.addEventListener('DOMContentLoaded', function() {
    const rootElement = document.documentElement; // Change to affect the whole HTML
    let fontSize = 100; // percentage

    function changeFontSize(factor) {
        fontSize = Math.max(50, Math.min(150, fontSize + factor));
        rootElement.style.fontSize = fontSize + '%';
    }

    document.getElementById('increase-font').addEventListener('click', function() {
        changeFontSize(10);
    });

    document.getElementById('decrease-font').addEventListener('click', function() {
        changeFontSize(-10);
    });

    document.getElementById('reset-font').addEventListener('click', function() {
        fontSize = 100; // Reset font size
        rootElement.style.fontSize = fontSize + '%';
    });
});

function changeLanguage() {
    var language = document.getElementById('language-select').value;

    console.log('Selected language:', language);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/set-language/${language}/`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log('AJAX request state:', xhr.readyState);
            console.log('AJAX request status:', xhr.status);
            if (xhr.status == 200) {
                console.log('Language set successfully');
                window.location.reload(); // Reload the page to reflect the language change
            } else {
                console.error('Error setting language:', xhr.status);
            }
        }
    };
    xhr.send();
}
