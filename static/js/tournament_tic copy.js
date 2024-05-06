
document.addEventListener('DOMContentLoaded', function () {
    // Elements for alias submission and game control
    const player2AliasInput = document.getElementById('player2-alias');
    const player3AliasInput = document.getElementById('player3-alias');
    const submitAliasesButton = document.getElementById('submit-aliases');
    const startButton = document.getElementById('start-button');
    const aliasInputs = document.getElementById('alias-inputs');

    let player = 'X';
    let board = [['', '', ''], ['', '', ''], ['', '', '']];
    let gameActive = false;


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

    function startGame() {
        gameActive = true;
        board = [['', '', ''], ['', '', ''], ['', '', '']];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
        });
        gameStatus.textContent = updateStatus();
    }


    function startGameSequence() {
        startButton.style.display = 'none';
        startGame();
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
                updateStatus(player1Index, player2Index);
            }
        }, 1000);
    }

    function updateStatus(player1Index, player2Index) {
        return `${player === 'X' ? playerName : 'Player 2'}'s turn (${player})`;
    }

    cells.forEach(cell => cell.addEventListener('click', function() {
        if (!gameActive) return;
        const row = parseInt(cell.id.charAt(5));
        const col = parseInt(cell.id.charAt(6));
        if (board[row][col] === '') {
            board[row][col] = player;
            cell.textContent = player;
            if (checkWinner()) {
                gameStatus.textContent = `${player === 'X' ? playerName : 'Player 2'} Wins!`;
                announceWinner(player === 'X' ? 'Win' : 'Lose');
                endGame();
            } else if (checkDraw()) {
                gameStatus.textContent = 'Draw!';
                announceWinner('Draw');
                endGame();
            } else {
                player = player === 'X' ? 'O' : 'X';
                gameStatus.textContent = updateStatus();
            }
        }
    }));
    
    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function concludeRound(player1Index, player2Index) {
        alert(`Round over between ${playerNames[player1Index]} and ${playerNames[player2Index]}`);
        if (gameSequence < 3) {
            startGameSequence(); // Setup the next round or end the game
        } else {
            determineWinner();
        }
    }
    


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

    cells.forEach(cell => cell.addEventListener('click', function() {
        if (!gameActive) return;
        const row = parseInt(cell.id.charAt(5));
        const col = parseInt(cell.id.charAt(6));
        if (board[row][col] === '') {
            board[row][col] = player;
            cell.textContent = player;
            if (checkWinner()) {
                gameStatus.textContent = `${player === 'X' ? playerName : 'Player 2'} Wins!`;
                announceWinner(player === 'X' ? 'Win' : 'Lose');
                endGame();
            } else if (checkDraw()) {
                gameStatus.textContent = 'Draw!';
                announceWinner('Draw');
                endGame();
            } else {
                player = player === 'X' ? 'O' : 'X';
                gameStatus.textContent = updateStatus();
            }
        }
    }));

    


    function checkDraw() {
        return board.every(row => row.every(cell => cell !== ''));
    }

    function endGame() {
        gameActive = false;
        cells.forEach(cell => cell.disabled = true);
        startButton.textContent = 'Restart Game';
        startButton.style.display = 'block';
    }

    function announceWinner(result) {
        const csrfToken = getCookie('csrftoken');
        let game_type = 8;  
        fetch('/save_game_result/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: `result=${result}&game_type=${game_type}`
        }).then(response => response.json())
          .then(data => {
              console.log(data.message);
              gameStatus.textContent = result === 'Win' ? `${playerName} Wins!` : (result === 'Lose' ? 'Player 2 Wins!' : 'Draw!');
          });
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

    function checkWinner() {
        // Winning conditions check each row, column, and the two diagonals
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                return true;
            }
        }
        // Check columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === player && board[1][j] === player && board[2][j] === player) {
                return true;
            }
        }
        // Check diagonals
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            return true;
        }
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            return true;
        }
        return false;
    }
    
});



