

document.addEventListener('DOMContentLoaded', function () {

    const currentScorePlayer1 = document.getElementById('player1-score');
    const currentScorePlayer2 = document.getElementById('player2-score');
    const countdownDisplay = document.getElementById('countdown');
    const gameTimerDisplay = document.getElementById('game-timer');
    const startButton = document.getElementById('start-button');
    
    

    // Initialize
    let movementInterval;
    let movementInterval2;
    let gameActive = false;
    let ballSpeedX2 = 1.1; 
    let ballSpeedY2 = 1.1;
    let ballSpeedX = -1.1; 
    let ballSpeedY = 1.1;

    // Setup the Pong game elements
    const gameArea = document.getElementById('pong-game');
    const paddle1 = createPaddle('paddle1');
    const paddle2 = createPaddle('paddle2');
    const ball = createBall('ball');
    const ball2 = createBall('ball2'); // Create the second ball
    gameArea.appendChild(paddle1);
    gameArea.appendChild(paddle2);
    gameArea.appendChild(ball);
    gameArea.appendChild(ball2);


    startButton.addEventListener('click', function() {
        startGameSequence();
    });

    function startGameSequence() {
        startButton.style.display = 'none';
        resetPaddles();  // Reset paddles to standard positions before starting countdown
        performCountdown();
    }
    
    function resetPaddles() {
        const centerY = `${gameArea.clientHeight / 2 - paddle1.offsetHeight / 2}px`;
        paddle1.style.top = centerY;
        paddle2.style.top = centerY;
    }

    function performCountdown() {
        let countdown = 3;
        countdownDisplay.textContent = countdown;
        const countdownInterval = setInterval(function() {
            countdownDisplay.textContent = --countdown || 'Go!';
            if (countdown === 0) {
                clearInterval(countdownInterval);
                countdownDisplay.textContent = '';
                startPongGame();
            }
        }, 1000);
    }


    function startPongGame(player1Index, player2Index) {
        console.log("Game starting...");
        gameActive = true;
        resetBall(); // Position the ball in the middle
        resetBall2();
        moveBall(); // Start moving the ball
        moveBall2();
        startGameTimer();

    }

    function startGameTimer() {
        let timeLeft = 20; // can change
        gameTimerDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
        const timer = setInterval(() => {
            timeLeft--;
            gameTimerDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
            if (timeLeft === 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        if (!gameActive) {
            return; // If game is already inactive, do nothing.
        }
        gameActive = false;
        clearInterval(movementInterval);
        clearInterval(movementInterval2);
        ball.style.display = 'none';
        ball2.style.display = 'none';
        paddle1.display = 'none';
        paddle2.display = 'none';
        document.removeEventListener('keydown', movePaddle);
        announceWinner();
    }

    //POST request made from JavaScript so including CSRF token for security.
    function announceWinner() {
        const csrfToken = getCookie('csrftoken');
        const score1 = parseInt(currentScorePlayer1.textContent.split(':')[1].trim());
        const score2 = parseInt(currentScorePlayer2.textContent.split(':')[1].trim());
        let result = 'Draw';
        if (score1 > score2) {
            result = 'Win';
        } else if (score2 > score1) {
            result = 'Lose';
        }
    
        countdownDisplay.textContent = result === 'Win' ? `${playerName} Wins!` : (result === 'Lose' ? 'Player 2 Wins!' : 'Draw!');


    
        // classic pong 2 balls
        let game_type = 4;
        fetch('/save_game_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: `result=${result}&game_type=${game_type}`
        }).then(response => response.json())
          .then(data => console.log(data.message));

        return;
    }


    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    

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


    // Event listeners
    document.addEventListener('keydown', movePaddle);
    startButton.addEventListener('click', startGameSequence);    


    // Add event listener to prevent default scrolling behavior
    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    });

    

    function moveBall2() {
        ballSpeedX2 = -1; 
        ballSpeedY2 = -1;
        movementInterval2 = setInterval(function() {
            let nextX = ball2.offsetLeft + ballSpeedX2;
            let nextY = ball2.offsetTop + ballSpeedY2;
    
            // Collision with top or bottom boundaries
            if (nextY <= 0 || nextY >= gameArea.clientHeight - ball2.offsetHeight) {
                ballSpeedY2 *= -1;
            }
    
            // Handle player-ball collisions
            if (nextX - ball2.offsetWidth <= paddle1.offsetLeft + paddle1.offsetWidth && nextX >= paddle1.offsetLeft) {
                if (nextY <= paddle1.offsetTop + paddle1.offsetHeight && nextY + ball2.offsetHeight >= paddle1.offsetTop) {
                    nextX = paddle1.offsetLeft + paddle1.offsetWidth + ball2.offsetWidth;
                    ballSpeedX2 *= -1;
                    ballSpeedY2 *= -1;
                }
            }
    
            ball2.style.left = `${nextX}px`;
            ball2.style.top = `${nextY}px`;

            // Collision with right paddle
            if (nextX + ball2.offsetWidth >= paddle2.offsetLeft && nextY + ball2.offsetHeight > paddle2.offsetTop && nextY < paddle2.offsetTop + paddle2.offsetHeight) {
                ballSpeedX2 *= -1;  // Reverse the horizontal direction
                ball2.style.left = `${paddle2.offsetLeft - ball2.offsetWidth}px`;  // Move ball outside the paddle
            }

            // Collision with left paddle
            if (nextX <= paddle1.offsetLeft + paddle1.offsetWidth && nextY + ball2.offsetHeight > paddle1.offsetTop && nextY < paddle1.offsetTop + paddle1.offsetHeight) {
                ballSpeedX2 *= -1;  // Reverse the horizontal direction
                ball2.style.left = `${paddle1.offsetLeft + paddle1.offsetWidth}px`;  // Move ball outside the paddle
            }


            // Collision with left or right boundaries (score update)
            if (nextX <= 0) {
                updateScore('player2');
                resetBall2();
                return;
            } else if (nextX >= gameArea.clientWidth - ball2.offsetWidth) {
                updateScore('player1');
                resetBall2();
                return;
            }
    
            ball2.style.left = `${nextX}px`;
            ball2.style.top = `${nextY}px`;
        }, 20);
    }
    
    function resetBall2() {

        ballSpeedX2 = 0;
        ballSpeedY2 = 0;
    
        ball2.style.left = `${gameArea.clientWidth / 2 - ball2.offsetWidth / 2}px`;
        ball2.style.top = `${gameArea.clientHeight / 2 - ball2.offsetHeight / 2}px`;
        
        if (!gameActive) {
            return;  // Ensure no reset or movement starts if the game is no longer active
        }
        
        ballSpeedX2 = -1; // Standard initial speed
        ballSpeedY2 = 1;

    }
    
    

    function moveBall() {
        ballSpeedX = 1
        ballSpeedY = 1;
        movementInterval = setInterval(function() {
            let nextX = ball.offsetLeft + ballSpeedX;
            let nextY = ball.offsetTop + ballSpeedY;

            // Collision with top or bottom boundaries
            if (nextY <= 0 || nextY >= gameArea.clientHeight - ball.offsetHeight) {
                ballSpeedY *= -1;
            }

            // Handle player-ball collisions
            if (nextX - ball.offsetWidth <= paddle1.offsetLeft + paddle1.offsetWidth && nextX >= paddle1.offsetLeft) {
                if (nextY <= paddle1.offsetTop + paddle1.offsetHeight && nextY + ball.offsetHeight >= paddle1.offsetTop) {
                    nextX = paddle1.offsetLeft + paddle1.offsetWidth + ball.offsetWidth;
                    ballSpeedX *= -1; // Reverse the horizontal direction
                    ballSpeedY *= -1; // Reverse the vertical direction
                }
            }

            ball.style.left = `${nextX}px`;
            ball.style.top = `${nextY}px`;

            // Collision with right paddle
            if (nextX + ball.offsetWidth >= paddle2.offsetLeft && nextY + ball.offsetHeight > paddle2.offsetTop && nextY < paddle2.offsetTop + paddle2.offsetHeight) {
                ballSpeedX *= -1;  // Reverse the horizontal direction
                ball.style.left = `${paddle2.offsetLeft - ball.offsetWidth}px`;  // Move ball outside the paddle
            }

            // Collision with left paddle
            if (nextX <= paddle1.offsetLeft + paddle1.offsetWidth && nextY + ball.offsetHeight > paddle1.offsetTop && nextY < paddle1.offsetTop + paddle1.offsetHeight) {
                ballSpeedX *= -1;  // Reverse the horizontal direction
                ball.style.left = `${paddle1.offsetLeft + paddle1.offsetWidth}px`;  // Move ball outside the paddle
            }


            // Collision with left or right boundaries (score update)
            if (nextX <= 0) {
                // Ball hits left boundary, score for the player on the right
                updateScore('player2');
                resetBall();
                return; // Stop further updates within this tick
            } else if (nextX >= gameArea.clientWidth - ball.offsetWidth) {
                // Ball hits right boundary, score for the player on the left
                updateScore('player1');
                resetBall();
                return; // Stop further updates within this tick
            }

            ball.style.left = `${nextX}px`;
            ball.style.top = `${nextY}px`;
        }, 20);
    }
    
    function resetBall() {

        ballSpeedX = 0;
        ballSpeedY = 0;
    
        ball.style.left = `${gameArea.clientWidth / 2 - ball.offsetWidth / 2}px`;
        ball.style.top = `${gameArea.clientHeight / 2 - ball.offsetHeight / 2}px`;
        
        if (!gameActive) {
            return;  // Ensure no reset or movement starts if the game is no longer active
        }
        
        ballSpeedX = 1; // Standard initial speed
        ballSpeedY = 1;
    

    }
    
    
    


    // Add event listener to prevent default scrolling behavior
    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    });


    
    function updateScore(player) {
        if (!gameActive) {
            return; // Avoid updating the score if the game is not active
        }
        const scoreElement = player === 'player1' ? currentScorePlayer1 : currentScorePlayer2;
        let score = parseInt(scoreElement.textContent.split(': ')[1]) + 1;
        let playerLabel = player === 'player1' ? playerName : 'Player 2';  // Use player name or "Player 2"
        scoreElement.textContent = `${playerLabel}: ${score}`;
    }


   

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

});



