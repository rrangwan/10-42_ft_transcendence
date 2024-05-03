
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
    window.location.href = `/set-language/${language}/`; 
}