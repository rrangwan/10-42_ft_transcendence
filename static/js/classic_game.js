document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    // Game elements
    const gameArea = document.getElementById('pong-game');
    const paddle1 = createPaddle('paddle1');
    const paddle2 = createPaddle('paddle2');
    const ball = createBall('ball');
    gameArea.appendChild(paddle1);
    gameArea.appendChild(paddle2);
    gameArea.appendChild(ball);

    // Game variables
    let ballSpeedX = 2;
    let ballSpeedY = 2;
    let movementInterval;
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');
    const countdownDisplay = document.getElementById('countdown');
    const gameTimerDisplay = document.getElementById('game-timer');
    const startButton = document.getElementById('start-button');

    // Event listeners
    document.addEventListener('keydown', movePaddle);
    startButton.addEventListener('click', startButtonClick);

    // Functions
    function createPaddle(id) {
        const paddle = document.createElement('div');
        paddle.id = id;
        paddle.classList.add('paddle');
        return paddle;
    }

    function createBall(id) {
        const ball = document.createElement('div');
        ball.id = id;
        ball.classList.add('ball');
        ball.style.position = 'absolute';
        return ball;
    }

    function startButtonClick() {
        console.log("Start button clicked");
        startButton.style.display = 'none'; // Hide the start button
        performCountdown();
    }

    function performCountdown() {
        let countdown = 3;
        countdownDisplay.textContent = countdown;
        const countdownInterval = setInterval(function() {
            countdownDisplay.textContent = --countdown || 'Go!';
            if (countdown === 0) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                    countdownDisplay.textContent = '';
                    startGame();
                }, 1000);
            }
        }, 1000);
    }

    function resetBall() {
        ball.style.left = `${gameArea.clientWidth / 2 - ball.offsetWidth / 2}px`;
        ball.style.top = `${gameArea.clientHeight / 2 - ball.offsetHeight / 2}px`;
        ballSpeedX = 1;
        ballSpeedY = 1; // Reset the ball speed direction
        
        moveBall();
    }
    
    
    function startGame() {
        console.log("Game starting...");
        resetBall();
        moveBall();
        startGameTimer();
    }

    function movePaddle(event) {
        const paddleSpeed = 10;
        const topBoundary = 40;
        const bottomBoundary = gameArea.clientHeight - paddle1.offsetHeight + 15; // Adjusted boundary

        switch (event.key) {
            case 'w':
                paddle1.style.top = `${Math.max(paddle1.offsetTop - paddleSpeed, topBoundary)}px`;
                break;
            case 's':
                paddle1.style.top = `${Math.min(paddle1.offsetTop + paddleSpeed, bottomBoundary)}px`;
                break;
            case 'ArrowUp':
                paddle2.style.top = `${Math.max(paddle2.offsetTop - paddleSpeed, topBoundary)}px`;
                break;
            case 'ArrowDown':
                paddle2.style.top = `${Math.min(paddle2.offsetTop + paddleSpeed, bottomBoundary)}px`;
                break;
        }
    }
    

    function moveBall() {
        movementInterval = setInterval(function() {
            let nextX = ball.offsetLeft + ballSpeedX;
            let nextY = ball.offsetTop + ballSpeedY;
    
            // Collision with top or bottom
            if (nextY <= 0 || nextY + ball.offsetHeight >= gameArea.clientHeight) {
                ballSpeedY *= -1;
            }
    
            // Collision with paddles
            if (checkPaddleCollision(nextX, nextY)) {
                ballSpeedX *= -1; // Reverse the horizontal direction
            }
    
            // Handle player-ball collisions
            if (nextX - ball.offsetWidth <= paddle1.offsetLeft + paddle1.offsetWidth && nextX >= paddle1.offsetLeft) {
                if (nextY <= paddle1.offsetTop + paddle1.offsetHeight && nextY + ball.offsetHeight >= paddle1.offsetTop) {
                    nextX = paddle1.offsetLeft + paddle1.offsetWidth + ball.offsetWidth;
                    ballSpeedX = 1; // Set the ball's horizontal speed
                    ballSpeedY *= -1; // Reverse the vertical direction
                }
            }
    
            if (nextX <= paddle2.offsetLeft + paddle2.offsetWidth && nextX + ball.offsetWidth >= paddle2.offsetLeft) {
                if (nextY <= paddle2.offsetTop + paddle2.offsetHeight && nextY + ball.offsetHeight >= paddle2.offsetTop) {
                    nextX = paddle2.offsetLeft - ball.offsetWidth;
                    ballSpeedX = -1; // Set the ball's horizontal speed
                    ballSpeedY *= -1; // Reverse the vertical direction
                }
            }
    
            // Update ball position
            ball.style.left = `${nextX}px`;
            ball.style.top = `${nextY}px`;
    
            // Check for game over condition
            checkGameOver(ball.offsetLeft);
    
            // Check for new serve
            if (ball.offsetLeft + ball.offsetWidth < 0 || ball.offsetLeft > gameArea.clientWidth) {
                resetBall();
                ballSpeedX = 2; // Set the ball's horizontal speed for the new serve
                ballSpeedY = Math.random() < 0.5 ? -2 : 2; // Randomize the vertical direction
            }
        }, 20);
    }
    
    // Add event listener to prevent default scrolling behavior
    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    });

    function checkPaddleCollision(nextX, nextY) {
        let ballBounds = ball.getBoundingClientRect();
        let paddle1Bounds = paddle1.getBoundingClientRect();
        let paddle2Bounds = paddle2.getBoundingClientRect();

        return (
            (nextX <= paddle1Bounds.right && ballBounds.right >= paddle1Bounds.left &&
                nextY + ball.offsetHeight >= paddle1Bounds.top && nextY <= paddle1Bounds.bottom) ||
            (nextX + ball.offsetWidth >= paddle2Bounds.left && ballBounds.left <= paddle2Bounds.right &&
                nextY + ball.offsetHeight >= paddle2Bounds.top && nextY <= paddle2Bounds.bottom)
        );
    }

    function updateScore(player) {
        const scoreElement = player === 'player1' ? player1Score : player2Score;
        let score = parseInt(scoreElement.textContent.split(': ')[1]) + 1;
        let playerLabel = player === 'player1' ? playerName : 'Player 2';  // Use player name or "Player 2"
        scoreElement.textContent = `${playerLabel}: ${score}`;
    }
    

    function checkGameOver(ballLeft) {
        if (ballLeft + ball.offsetWidth < 0) {
            updateScore('player2');
            clearInterval(movementInterval);
            resetBall();
        } else if (ballLeft > gameArea.clientWidth) {
            updateScore('player1');
            clearInterval(movementInterval);
            resetBall();
        }
    }

   

    function startGameTimer() {
        let timeLeft = 20; // can change
        gameTimerDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
        const timer = setInterval(() => {
            timeLeft--;
            gameTimerDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
            if (timeLeft === 0) {
                clearInterval(timer);
                clearInterval(movementInterval);
                ball.style.display = 'none'; // Hide the ball
                announceWinner();
            }
        }, 1000);
    }

    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    //using cookie to handle CSRF (Cross-Site Request Forgery) tokens when making POST requests
    //to comply with Django's security requirements
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    

    //POST request made from JavaScript so including CSRF token for security.
    function announceWinner() {
        const csrfToken = getCookie('csrftoken');
        const score1 = parseInt(player1Score.textContent.split(':')[1].trim());
        const score2 = parseInt(player2Score.textContent.split(':')[1].trim());
        let result = 'Draw';
        if (score1 > score2) {
            result = 'Win';
        } else if (score2 > score1) {
            result = 'Lose';
        }
    
        countdownDisplay.textContent = result === 'Win' ? `${playerName} Wins!` : (result === 'Lose' ? 'Player 2 Wins!' : 'Draw!');
    
        // classic pong
        let game_type = 1;
        fetch('/save_game_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: `result=${result}&game_type=${game_type}`
        }).then(response => response.json())
          .then(data => console.log(data.message));
    }
    
});
