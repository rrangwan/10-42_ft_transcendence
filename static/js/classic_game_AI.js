
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

    let ballSpeedX = 0.5;
    let ballSpeedY = 0.5;
    // let movementInterval; //old way
    let gameActive = false;
    let animationFrameId;
    let botMovementInterval;
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
        gameActive = true;
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
        ballSpeedX = 0;
        ballSpeedY = 0;
        console.log("is game active? ", gameActive);

        ball.style.left = `${gameArea.clientWidth / 2 - ball.offsetWidth / 2}px`;
        ball.style.top = `${gameArea.clientHeight / 2 - ball.offsetHeight / 2}px`;
        
        if (!gameActive) 
            return;  // Ensure no reset if the game is no longer active
    
        // Reset speeds to a manageable level
        ballSpeedX = -0.75; // Set a default initial speed that does not instantly score
        ballSpeedY = (Math.random() < 0.5 ? -1 : 1) * 1;
    
        setTimeout(() => {
            if (gameActive) {  // Only restart the game loop if the game is still active
            requestAnimationFrame(moveBall);}
        }, 500); // Pause for half a second before starting motion again
    }

    function startGame() {
        console.log("Game starting...");
        resetBall();
        animationFrameId = requestAnimationFrame(moveBall);
        startGameTimer();
        startBotMovement();
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
        }
    }
    
    function startBotMovement() {
        const paddleSpeed = 40;
        const topBoundary = 40;
        const bottomBoundary = gameArea.clientHeight - paddle2.offsetHeight + 15;

        botMovementInterval = setInterval(() => {
            let ballY = ball.offsetTop + ball.offsetHeight / 2;
            let paddleY = paddle2.offsetTop + paddle2.offsetHeight / 2;
            if (ballY < paddleY - paddleSpeed) {
                paddle2.style.top = `${Math.max(paddle2.offsetTop - paddleSpeed, topBoundary)}px`;
            } else if (ballY > paddleY + paddleSpeed) {
                paddle2.style.top = `${Math.min(paddle2.offsetTop + paddleSpeed, bottomBoundary)}px`;
            }
        }, 500);
    }

    function moveBall() {
        let nextX = ball.offsetLeft + ballSpeedX;
        let nextY = ball.offsetTop + ballSpeedY;
    
        // Collision with top or bottom
        if (nextY <= 0 || nextY + ball.offsetHeight >= gameArea.clientHeight) {
            ballSpeedY = -ballSpeedY;
            nextY = nextY <= 0 ? 0 : gameArea.clientHeight - ball.offsetHeight;  // Adjust to remain within bounds
        }
        
            // Update ball position
        ball.style.left = `${nextX}px`;
        ball.style.top = `${nextY}px`;
    
        // Check paddle collision and reverse X direction if needed
        if (checkPaddleCollision(nextX, nextY)) {
            ballSpeedX = -ballSpeedX;
            nextX += ballSpeedX * 1.5; // Move ball back out of collision
        }
    
        // Update ball position
        ball.style.left = `${nextX}px`;
        ball.style.top = `${nextY}px`;
        // Check if the ball hits the left or right boundary of the game area
        checkGameOver(nextX);
    }
    
    
    function checkPaddleCollision(nextX, nextY) {
        const ballWidth = 20;  // Ball dimensions
        const ballHeight = 20;
    
        const ballNextRect = {
            left: nextX,
            top: nextY,
            right: nextX + ballWidth,
            bottom: nextY + ballHeight
        };
    
        const gameAreaWidth = document.getElementById('pong-game').clientWidth;  // Assuming the ID of your game container
    
        // For the left paddle
        const paddle1Rect = {
            left: paddle1.offsetLeft,
            top: paddle1.offsetTop - paddle1.offsetHeight / 2,
            right: paddle1.offsetLeft + paddle1.offsetWidth,
            bottom: paddle1.offsetTop + paddle1.offsetHeight / 2
        };
    
        // Adjusted For the right paddle to trigger collision slightly earlier
        const rightOffset = 5; // The CSS right property value used
        const collisionAdjustment = -5; 
        const paddle2Rect = {
            left: gameAreaWidth - paddle2.offsetWidth - rightOffset - collisionAdjustment,
            top: paddle2.offsetTop - paddle2.offsetHeight / 2,
            right: gameAreaWidth - rightOffset,
            bottom: paddle2.offsetTop + paddle2.offsetHeight / 2
        };
    
        let collidesWithPaddle1 = (ballNextRect.right > paddle1Rect.left && ballNextRect.left < paddle1Rect.right &&
            ballNextRect.bottom > paddle1Rect.top && ballNextRect.top < paddle1Rect.bottom);
        let collidesWithPaddle2 = (ballNextRect.right > paddle2Rect.left && ballNextRect.left < paddle2Rect.right &&
            ballNextRect.bottom > paddle2Rect.top && ballNextRect.top < paddle2Rect.bottom);
    
        if (collidesWithPaddle1 || collidesWithPaddle2) {
            console.log("Collision detected with:", collidesWithPaddle1 ? "Paddle 1" : "Paddle 2");
        }
    
        return collidesWithPaddle1 || collidesWithPaddle2;
    }
    

    function updateScore(player) {
        const scoreElement = player === 'player1' ? player1Score : player2Score;
        let score = parseInt(scoreElement.textContent.split(': ')[1]) + 1;
        let playerLabel = player === 'player1' ? playerName : 'player2';  
        scoreElement.textContent = `${playerLabel}: ${score}`;
    }
    

    function checkGameOver(nextX) {
        const gameAreaWidth = document.getElementById('pong-game').clientWidth;
        const ballWidth = 20;  // Assuming ball width is still 20px
        const leftWallOffset = 10;  // Adjust this value to control collision with the left wall
        const rightWallOffset = -10;  // Adjust this value to control collision with the right wall
    
        // Check if the ball hits the left or right wall
        if (nextX < 0 - leftWallOffset) {
            console.log('Ball hit the left wall. Player 2 scores!');
            updateScore('player2');
            resetBall();
        } else if (nextX + ballWidth > gameAreaWidth + rightWallOffset) {
            console.log('Ball hit the right wall. Player 1 scores!');
            updateScore('player1');
            resetBall();
        } else {
            requestAnimationFrame(moveBall);
        }
    }
   

    function startGameTimer() {
        let timeLeft = 30; // can change
        gameTimerDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
        const timer = setInterval(() => {
            timeLeft--;
            gameTimerDisplay.textContent = `Time Left: ${formatTime(timeLeft)}`;
            if (timeLeft === 0) {
                clearInterval(timer);
                gameActive = false;
                cancelAnimationFrame(animationFrameId);
                clearInterval(botMovementInterval);
                paddle1.display = 'none';
                paddle2.display = 'none';
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
    
        countdownDisplay.textContent = result === 'Win' ? `${playerName} Wins!` : (result === 'Lose' ? 'AI Wins!' : 'Draw!');
    
        // classic pong AI
        let game_type = 3;
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
