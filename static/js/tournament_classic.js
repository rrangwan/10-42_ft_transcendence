
document.addEventListener('DOMContentLoaded', function () {
    // Elements for alias submission and game control
    const player2AliasInput = document.getElementById('player2-alias');
    const player3AliasInput = document.getElementById('player3-alias');
    const submitAliasesButton = document.getElementById('submit-aliases');
    const startButton = document.getElementById('start-button');
    const aliasInputs = document.getElementById('alias-inputs');
    const gameStatus = document.getElementById('status');

    // Element references for updating the player names and scores
    const currentNamePlayer1 = document.getElementById('current-name-player1');
    const currentScorePlayer1 = document.getElementById('current-score-player1');
    const currentNamePlayer2 = document.getElementById('current-name-player2');
    const currentScorePlayer2 = document.getElementById('current-score-player2');
    const currentNamePlayer3 = document.getElementById('current-name-player3');
    const currentScorePlayer3 = document.getElementById('current-score-player3');


    // Initialize with Player 1's nickname from the server
    let playerNames = [currentNamePlayer1.textContent, '', ''];
    const currentScores = [0, 0, 0];
    let gameSequence = 0;
    let movementInterval;
    let ballSpeedX = 0.75;
    let ballSpeedY = 0.75;
    
    // Setup the Pong game elements
    const gameArea = document.getElementById('pong-game');
    const paddle1 = createPaddle('paddle1');
    const paddle2 = createPaddle('paddle2');
    const ball = createBall('ball');
    gameArea.appendChild(paddle1);
    gameArea.appendChild(paddle2);
    gameArea.appendChild(ball);


    // let movementInterval; //old way
    let gameActive = false;
    let animationFrameId = requestAnimationFrame(moveBall);

    submitAliasesButton.addEventListener('click', function() {
        const aliases = [player2AliasInput.value.trim(), player3AliasInput.value.trim()];
        if (validateAliases(aliases)) {
            playerNames[1] = aliases[0];
            playerNames[2] = aliases[1];
            currentNamePlayer2.textContent = aliases[0];
            currentNamePlayer3.textContent = aliases[1];

            // Hide alias inputs and show start button
            aliasInputs.style.display = 'none';
            startButton.style.display = 'block';
        } else {
            alert("Please ensure aliases are unique, 2-9 characters, no spaces, and alphanumeric.");
        }
    });

    startButton.addEventListener('click', function() {
        startGameSequence();
    });

    function validateAliases(aliases) {
        const uniqueAliases = new Set(aliases);
        return uniqueAliases.size === aliases.length && aliases.every(alias => /^[a-zA-Z0-9]{2,9}$/.test(alias));
    }

    function startGameSequence() {
        startButton.style.display = 'none';
        resetPaddles();  // Reset paddles to standard positions before starting countdown
        switch (gameSequence) {
            case 0:
                performCountdown(`${playerNames[0]} vs ${playerNames[1]}`, 0, 1);
                break;
            case 1:
                performCountdown(`${playerNames[0]} vs ${playerNames[2]}`, 0, 2);
                break;
            case 2:
                performCountdown(`${playerNames[1]} vs ${playerNames[2]}`, 1, 2);
                break;
        }
        gameSequence++;
    }
    
    function resetPaddles() {
        const centerY = `${gameArea.clientHeight / 2 - paddle1.offsetHeight / 2}px`;
        paddle1.style.top = centerY;
        paddle2.style.top = centerY;
    }

    function performCountdown(matchTitle, player1Index, player2Index) {
        let countdown = 3;
        let countdownElement = document.getElementById('countdown');
        countdownElement.textContent = countdown + ' seconds until ' + matchTitle;
        let interval = setInterval(function() {
            countdown--;
            countdownElement.textContent = countdown ? countdown + ' seconds until ' + matchTitle : 'Go!';
            if (!countdown) {
                clearInterval(interval);
                countdownElement.textContent = '';
                gameStatus.textContent = '';
                startPongGame(player1Index, player2Index);
            }
        }, 1000);
    }

    function startPongGame(player1Index, player2Index) {
        gameActive = true;
        resetBall(); // Position the ball in the middle
        let timeLeft = 30; // 
        requestAnimationFrame(moveBall);
        let timerElement = document.getElementById('game-timer');
        timerElement.textContent = 'Time Left: ' + formatTime(timeLeft); // Update UI
    
        let interval = setInterval(function() {
            timeLeft--;
            timerElement.textContent = 'Time Left: ' + formatTime(timeLeft);
    
            if (timeLeft <= 0) {
                clearInterval(interval);
                stopPongGame(); // Stops the pong game ball movement and key listeners
                gameActive = false;
                concludeRound(player1Index, player2Index);
            }
        }, 1000);
    
        // Add keydown listener specifically for this round
        function handleKeypress(event) {
            movePaddle(event, player1Index, player2Index);
        }

        document.addEventListener('keydown', handleKeypress);

        requestAnimationFrame(moveBall); // Start moving the ball

        function stopPongGame() {
            clearInterval(movementInterval); // Assume movementInterval is your global var for moveBall interval
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('keydown', handleKeypress); // Remove key listener when round ends
        }
}
    
    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function concludeRound(player1Index, player2Index) {
        // gameStatus.textContent = `Round over between ${playerNames[player1Index]} and ${playerNames[player2Index]}`;

        if (gameSequence < 3) {
            startGameSequence(); // Setup the next round or end the game
        } else {
            determineWinner();
        }
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

    function movePaddle(event, player1Index, player2Index) {
        const paddleSpeed = 10;
        const topBoundary = 40;
        const bottomBoundary = gameArea.clientHeight - paddle1.offsetHeight + 15;
        if (player1Index === 0 || player1Index === 1) {
            if (event.key === 'w') {
                paddle1.style.top = `${Math.max(paddle1.offsetTop - paddleSpeed, topBoundary)}px`;
            } else if (event.key === 's') {
                paddle1.style.top = `${Math.min(paddle1.offsetTop + paddleSpeed, bottomBoundary)}px`;
            }
        }
        if (player2Index === 1 || player2Index === 2) {
            if (event.key === 'ArrowUp') {
                paddle2.style.top = `${Math.max(paddle2.offsetTop - paddleSpeed, topBoundary)}px`;
            } else if (event.key === 'ArrowDown') {
                paddle2.style.top = `${Math.min(paddle2.offsetTop + paddleSpeed, bottomBoundary)}px`;
            }
        }
    }

    function moveBall() {
        // ballSpeedX = 1;
        // ballSpeedY = 1;
        console.log('moveBall called', { ballSpeedX, ballSpeedY, gameActive });
    
        if (!gameActive) {
            console.log('Game is not active. Exiting moveBall.');
            return;
        }
    
        let nextX = ball.offsetLeft + ballSpeedX;
        let nextY = ball.offsetTop + ballSpeedY;

        // Collision with top or bottom boundaries
        if (nextY <= 0 || nextY + ball.offsetHeight >= gameArea.clientHeight) {
            ballSpeedY = -ballSpeedY;
            nextY = nextY <= 0 ? 0 : gameArea.clientHeight - ball.offsetHeight;  // Adjust to remain within bounds
        }

        // Handle player-ball collisions
        if (nextX - ball.offsetWidth <= paddle1.offsetLeft + paddle1.offsetWidth && nextX >= paddle1.offsetLeft) {
            if (nextY <= paddle1.offsetTop + paddle1.offsetHeight && nextY + ball.offsetHeight >= paddle1.offsetTop) {
                nextX = paddle1.offsetLeft + paddle1.offsetWidth + ball.offsetWidth;
                ballSpeedX = -ballSpeedX; // Reverse the horizontal direction
                // ballSpeedY *= -1; // Reverse the vertical direction
            }
        }

        // Adjusted collision logic for right paddle (paddle2)
        if (nextX + ball.offsetWidth >= paddle2.offsetLeft && nextX < paddle2.offsetLeft + paddle2.offsetWidth) {
            if (nextY + ball.offsetHeight > paddle2.offsetTop && nextY <        paddle2.offsetTop + paddle2.offsetHeight) 
            {
                ballSpeedX = -Math.abs(ballSpeedX);  // Ensure the ball always bounces back left
                nextX = paddle2.offsetLeft - ball.offsetWidth;  // Correctly position ball outside the paddle
            }
        }

        // Collision with left paddle
        if (nextX <= paddle1.offsetLeft - 15 + paddle1.offsetWidth && nextY + ball.offsetHeight + 15 > paddle1.offsetTop && nextY < paddle1.offsetTop + paddle1.offsetHeight + 15) {
            ballSpeedX *= -1;  // Reverse the horizontal direction
            ball.style.left = `${paddle1.offsetLeft + paddle1.offsetWidth}px`;  // Move ball outside the paddle
        }

        // Collision with left or right boundaries (score update)
        if (nextX <= 10) {
            // Ball hits left boundary, score for the player on the right
            updateScore(rightPlayerIndex(gameSequence));
            resetBall();
            return; // Stop further updates within this tick
        } else if (nextX >= gameArea.clientWidth - ball.offsetWidth + 5) {
            // Ball hits right boundary, score for the player on the left
            updateScore(leftPlayerIndex(gameSequence));
            resetBall();
            return; // Stop further updates within this tick
        }

        ball.style.left = `${nextX}px`;
        ball.style.top = `${nextY}px`;

        if (gameActive) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(moveBall);
        }

    }


// Add event listener to prevent default scrolling behavior
document.addEventListener('keydown', function(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
});


    function rightPlayerIndex(sequence) {
        switch (sequence) {
            case 1: return 1; // Player 2 is on the right in Game Sequence 0
            case 2: return 2; // Player 3 is on the right in Game Sequence 1
            case 3: return 2; // Player 3 is also on the right in Game Sequence 2
        }
    }

    function leftPlayerIndex(sequence) {
        switch (sequence) {
            case 1: return 0; // Player 1 is on the left in Game Sequence 0
            case 2: return 0; // Player 1 is also on the left in Game Sequence 1
            case 3: return 1; // Player 2 is on the left in Game Sequence 2
        }
    }

        
    function updateScore(playerIndex) {
        currentScores[playerIndex]++;
        if (playerIndex === 0) {
            currentScorePlayer1.textContent = currentScores[playerIndex].toString();
        } else if (playerIndex === 1) {
            currentScorePlayer2.textContent = currentScores[playerIndex].toString();
        } else if (playerIndex === 2) {
            currentScorePlayer3.textContent = currentScores[playerIndex].toString();
        }
    }


    function resetBall() {
        ballSpeedX = 0;
        ballSpeedY = 0;
        console.log("is game active? ", gameActive);

        ball.style.left = `${gameArea.clientWidth / 2 - ball.offsetWidth / 2}px`;
        ball.style.top = `${gameArea.clientHeight / 2 - ball.offsetHeight / 2}px`;
        
        if (!gameActive) {
            return;  // Ensure no reset if the game is no longer active
        } 
        // Reset speeds to a manageable level
        ballSpeedX = -0.75; // Set a default initial speed that does not instantly score
        ballSpeedY =  0.75;
    
        setTimeout(() => {
            if (gameActive) {  // Only restart the game loop if the game is still active
            cancelAnimationFrame(animationFrameId);
            requestAnimationFrame(moveBall);}
        }, 500); // Pause for half a second before starting motion again
    }

    function determineWinner() {
        let maxScore = Math.max(...currentScores);
        let winners = [];
        currentScores.forEach((score, index) => {
            if (score === maxScore) {
                winners.push(playerNames[index]);
            }
        });

        let result;
        if (winners.length > 1) {
            if (winners.includes(playerNames[0])) {
                gameStatus.textContent = 'The game is a draw between: ' + winners.join(', ');
                result = 'Draw';

            } else {
                gameStatus.textContent = 'The winners are: ' + winners.join(', ');
                result = 'Lose';

            }
        } else {
            gameStatus.textContent = 'Winner is: ' + winners[0];
            result = (winners[0] === playerNames[0]) ? 'Win' : 'Lose';

        }
        paddle1.display = 'none';
        paddle2.display = 'none';
        ball.style.display = 'none'; 
        cancelAnimationFrame(animationFrameId);
        announceWinner(result);
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

    function announceWinner(result) {
        const csrfToken = getCookie('csrftoken');
        let game_type = 2; 

        fetch('/save_game_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: `result=${result}&game_type=${game_type}`
        }).then(response => response.json())
          .then(data => console.log(data.message))
          .catch(error => console.error('Error posting game results:', error));
    }
});



