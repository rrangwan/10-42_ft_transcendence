

document.addEventListener('DOMContentLoaded', function () {

    const currentScorePlayer1 = document.getElementById('player1-score');
    const currentScorePlayer2 = document.getElementById('player2-score');
    const countdownDisplay = document.getElementById('countdown');
    const gameTimerDisplay = document.getElementById('game-timer');
    const startButton = document.getElementById('start-button');
    
    

    // Initialize
    let gameActive = false;
    let ballSpeedX2 = 0.75; 
    let ballSpeedY2 = 0.75;
    let ballSpeedX = -0.5; 
    let ballSpeedY = 0.5;

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
        resetBall(); // Position the ball in the middle
        resetBall2();
        gameActive = true;
        requestAnimationFrame(moveBall);
        requestAnimationFrame(moveBall2);

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
        clearInterval(movementInterval);
        clearInterval(movementInterval2);
        document.removeEventListener('keydown', movePaddle);
        ball.style.display = 'none';
        ball2.style.display = 'none';
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

    

    
    function resetBall2() {
        ballSpeedX2 = 0;
        ballSpeedY2 = 0;
        console.log("is game2 active? ", gameActive);

        ball2.style.left = `${gameArea.clientWidth / 2 - ball2.offsetWidth / 2}px`;
        ball2.style.top = `${gameArea.clientHeight / 2 - ball2.offsetHeight / 2}px`;
        
        if (!gameActive) 
            return;  // Ensure no reset if the game is no longer active
    
        // Reset speeds to a manageable level
        ballSpeedX2 = 0.75; // Set a default initial speed that does not instantly score
        ballSpeedY2 = 0.75;
    
        setTimeout(() => {
            if (gameActive) {  // Only restart the game loop if the game is still active
            requestAnimationFrame(moveBall2);}
        }, 500); // Pause for half a second before starting motion again
    }
    
    function moveBall() {
        let nextX = ball.offsetLeft + ballSpeedX;
        let nextY = ball.offsetTop + ballSpeedY;
    
        if (nextY <= 0 || nextY >= gameArea.clientHeight - ball.offsetHeight) {
            ballSpeedY *= -1;  // Reverse direction on hitting top/bottom boundaries
        }
    
        ball.style.left = `${nextX}px`;
        ball.style.top = `${nextY}px`;

        if (nextX <= paddle1.offsetLeft + paddle1.offsetWidth + 10 && nextY + ball.offsetHeight > paddle1.offsetTop && nextY < paddle1.offsetTop + paddle1.offsetHeight) {
            ballSpeedX *= -1;  // Reverse horizontal direction on hitting paddle1
        }
        if (nextX + ball.offsetWidth - 10 >= paddle2.offsetLeft && nextY + ball.offsetHeight > paddle2.offsetTop && nextY < paddle2.offsetTop + paddle2.offsetHeight) {
            ballSpeedX *= -1;  // Reverse horizontal direction on hitting paddle2
        }
    
        // Update positions
        ball.style.left = `${nextX}px`;
        ball.style.top = `${nextY}px`;
    
        if (nextX <= 0 || nextX >= gameArea.clientWidth - ball.offsetWidth) {
            updateScore(nextX <= 0 ? 'player2' : 'player1');  // Update score based on which side was hit
            resetBall();  // Reset the ball to the center
        } else {
            requestAnimationFrame(moveBall);  // Continue the animation
        }
    }
    
    function moveBall2() {
        let nextX = ball2.offsetLeft + ballSpeedX2;
        let nextY = ball2.offsetTop + ballSpeedY2;
    
        if (nextY <= 0 || nextY >= gameArea.clientHeight - ball2.offsetHeight) {
            ballSpeedY2 *= -1;  // Reverse direction on hitting top/bottom boundaries
        }
    
        ball2.style.left = `${nextX}px`;
        ball2.style.top = `${nextY}px`;
        
        if (nextX <= paddle1.offsetLeft + paddle1.offsetWidth && nextY + ball2.offsetHeight + 10 > paddle1.offsetTop && nextY < paddle1.offsetTop + paddle1.offsetHeight) {
            ballSpeedX2 *= -1;  // Reverse horizontal direction on hitting paddle1
        }
        if (nextX + ball2.offsetWidth - 10 >= paddle2.offsetLeft && nextY + ball2.offsetHeight > paddle2.offsetTop && nextY < paddle2.offsetTop + paddle2.offsetHeight) {
            ballSpeedX2 *= -1;  // Reverse horizontal direction on hitting paddle2
        }
    
        ball2.style.left = `${nextX}px`;
        ball2.style.top = `${nextY}px`;
    
        if (nextX <= 0 || nextX >= gameArea.clientWidth - ball2.offsetWidth) {
            updateScore(nextX <= 0 ? 'player2' : 'player1');  // Update score based on which side was hit
            resetBall2();  // Reset the ball to the center
        } else {
            requestAnimationFrame(moveBall2);  // Continue the animation
        }
    }
    
    function resetBall() {
        ballSpeedX = 0;
        ballSpeedY = 0;
        console.log("is game active? ", gameActive);

        ball.style.left = `${gameArea.clientWidth / 2 - ball.offsetWidth / 2}px`;
        ball.style.top = `${gameArea.clientHeight / 2 - ball.offsetHeight / 2}px`;
        
        if (!gameActive) 
            return;  // Ensure no reset if the game is no longer active
    
        // Reset speeds to a manageable level
        ballSpeedX = -0.75; // Set a default initial speed that does not instantly score
        ballSpeedY =  0.75;
    
        setTimeout(() => {
            if (gameActive) {  // Only restart the game loop if the game is still active
            requestAnimationFrame(moveBall);}
        }, 500); // Pause for half a second before starting motion again
    }
    


    // Add event listener to prevent default scrolling behavior
    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
    });


    
    function updateScore(player) {
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



