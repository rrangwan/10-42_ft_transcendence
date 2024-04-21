document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('pong-game');
    const paddle1 = document.createElement('div');
    paddle1.id = 'paddle1';
    paddle1.classList.add('paddle');
    const paddle2 = document.createElement('div');
    paddle2.id = 'paddle2';
    paddle2.classList.add('paddle');

    gameArea.appendChild(paddle1);
    gameArea.appendChild(paddle2);

    // Function to move paddles based on keyboard input
    function movePaddle(event) {
        switch(event.key) {
            case 'w':
                paddle1.style.top = `${paddle1.offsetTop - 10}px`;
                break;
            case 's':
                paddle1.style.top = `${paddle1.offsetTop + 10}px`;
                break;
            case 'ArrowUp':
                paddle2.style.top = `${paddle2.offsetTop - 10}px`;
                break;
            case 'ArrowDown':
                paddle2.style.top = `${paddle2.offsetTop + 10}px`;
                break;
        }
    }
    
    // Listen for keydown events to move paddles
    document.addEventListener('keydown', movePaddle);
});
