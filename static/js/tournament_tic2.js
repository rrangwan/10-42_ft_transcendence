document.addEventListener('DOMContentLoaded', function () {
    // Element references for alias submission and game control
    const player2AliasInput = document.getElementById('player2-alias');
    const player3AliasInput = document.getElementById('player3-alias');
    const submitAliasesButton = document.getElementById('submit-aliases');
    const startButton = document.getElementById('start-button');
    const gameStatus = document.getElementById('game-status');
    const cells = document.querySelectorAll('.cell');

    let playerNames = [document.getElementById('current-name-player1').textContent, '', ''];
    let playerScores = [0, 0, 0];
    let board = Array(4).fill('').map(() => Array(4).fill(''));
    let player = 'X';
    let gameActive = false;
    let gameSequence = 0;

    function validateAliases(aliases) {
        const uniqueAliases = new Set(aliases);
        return uniqueAliases.size === aliases.length && aliases.every(alias => /^[a-zA-Z0-9]{2,9}$/.test(alias));
    }

    submitAliasesButton.addEventListener('click', function () {
        const aliases = [player2AliasInput.value.trim(), player3AliasInput.value.trim()];
        if (validateAliases(aliases)) {
            playerNames[1] = aliases[0];
            playerNames[2] = aliases[1];
            document.getElementById('current-name-player2').textContent = aliases[0];
            document.getElementById('current-name-player3').textContent = aliases[1];
            startButton.style.display = 'block';
            submitAliasesButton.style.display = 'none';
        } else {
            alert("Please ensure aliases are unique, 2-9 characters, no spaces, and alphanumeric.");
        }
    });

    startButton.addEventListener('click', function() {
        gameActive = true;
        clearBoard();
        startButton.style.display = 'none';
        // updateGameStatus2("Tournament started! First match: " + playerNames[0] + " vs " + playerNames[1]);
        setupGame();
    });

    function clearBoard() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
        });
        board = Array(4).fill('').map(() => Array(4).fill(''));
    }
    

    function setupGame() {
        gameActive = true;
        clearBoard();
        togglePlayer(true);  // Call with a parameter to set initial player for the round
        // updateGameStatus();
        startButton.style.display = 'none';
    }


    function updateGameStatus2(status) {
        console.log("Updating game status:", status);  // Debugging output to console
        gameStatus.textContent = status;
    }

    
    function updateGameStatus() {
        let status;
        if (gameSequence === 0) {  // Round 1: Player1 (X) vs Player2 (O)
            status = `${playerNames[0]} 'X' vs ${playerNames[1]} 'O' <br>(${player})'s turn`;
        } else if (gameSequence === 1) {  // Round 2: Player1 (X) vs Player3 (O)
            status = `${playerNames[0]} 'X' vs ${playerNames[2]} 'O' <br>(${player})'s turn`;
        } else if (gameSequence === 2) {  // Round 3: Player2 (X) vs Player3 (O)
            status = `${playerNames[1]} 'X' vs ${playerNames[2]} 'O' <br>(${player})'s turn`;
        }
        gameStatus.innerHTML = status; //changed to accomodate <br>
    }
    
    function togglePlayer(initial = false) {
        if (initial) {
            player = 'X'; // Always start with 'X' at the beginning of a game
        } else {
            player = (player === 'X') ? 'O' : 'X';
        }
        updateGameStatus();  // Call updateGameStatus to reflect the correct match setup
    }


    cells.forEach(cell => {
        const row = parseInt(cell.id.charAt(5));
        const col = parseInt(cell.id.charAt(6));
        cell.addEventListener('click', function() {
            handleCellClick(row, col, this);
        });
    });
    
    
    function handleCellClick(row, col, cellElement) {
        if (!gameActive || board[row][col] !== '') return;
        board[row][col] = player;
        cellElement.textContent = player;
    
        if (checkWinner()) {
            let winnerIndex = determineWinnerIndex();
            updateScores(winnerIndex, 2);
            endGame(`${playerNames[winnerIndex]} wins!`);
        } else if (checkDraw()) {
            updateScoresForDraw();
            endGame('Draw!');
        } else {
            togglePlayer();
        }
    }
    
    function determineWinnerIndex() {
        if (gameSequence === 0) {
            return player === 'X' ? 0 : 1;
        } else if (gameSequence === 1) {
            return player === 'X' ? 0 : 2;
        } else if (gameSequence === 2) {
            return player === 'X' ? 1 : 2;
        }
    }
    
    function updateScoresForDraw() {
        if (gameSequence === 0) {
            updateScores(0, 1);
            updateScores(1, 1);
        } else if (gameSequence === 1) {
            updateScores(0, 1);
            updateScores(2, 1);
        } else if (gameSequence === 2) {
            updateScores(1, 1);
            updateScores(2, 1);
        }
    }
    
    
    
    
    function checkDraw() {
        return board.every(row => row.every(cell => cell !== '')) && !checkWinner();
    }
    
    
    function checkWinner() {
        // Rows and columns check
        for (let i = 0; i < 4; i++) {
            if ((new Set([board[i][0], board[i][1], board[i][2], board[i][3]])).size === 1 && board[i][0] !== '') return true;
            if ((new Set([board[0][i], board[1][i], board[2][i], board[3][i]])).size === 1 && board[0][i] !== '') return true;
        }
        
        // Diagonal checks
        if ((new Set([board[0][0], board[1][1], board[2][2], board[3][3]])).size === 1 && board[0][0] !== '') return true;
        if ((new Set([board[0][3], board[1][2], board[2][1], board[3][0]])).size === 1 && board[0][3] !== '') return true;
    
        return false;
    }
    

    function endGame(message) {
        updateGameStatus2(message);
        gameActive = false;
        cells.forEach(cell => cell.disabled = true);
    
        console.log("Game ended, preparing for next match or conclusion.");
    
        if (gameSequence < 2) {
            gameSequence++;
            startButton.textContent = 'Next Match';
            startButton.style.display = 'block';
        } else {
            setTimeout(() => {
                determineOverallWinner(); //  setTimeout to ensure any pending updates complete
            }, 0);
        }
    }
    

    function updateScores(playerIndex, points) {
        playerScores[playerIndex] += points;
        document.getElementById(`current-score-player${playerIndex + 1}`).textContent = playerScores[playerIndex].toString();
        console.log(`Updated scores: ${playerScores.join(', ')}`); // Log score update
    }

    function determineOverallWinner() {
        const maxScore = Math.max(...playerScores);
        const winners = playerScores.flatMap((score, index) => score === maxScore ? [playerNames[index]] : []);
        const player1Index = 0;  
        // Determine if all players have the same score
        if (playerScores.every(score => score === maxScore)) {
            updateGameStatus2(`Tie between ${winners.join(', ')}`);
            announceWinner('Draw');  // All players are tied
        } else if (winners.includes(playerNames[player1Index])) {
            // Player 1 is among the winners
            if (winners.length > 1) {
                // There are multiple winners including Player 1
                updateGameStatus2(`Tie between ${winners.join(' and ')}`);
                announceWinner('Draw');
            } else {
                // Player 1 is the sole winner
                updateGameStatus2(`${playerNames[player1Index]} wins the tournament!`);
                announceWinner('Win');
            }
        } else {
            // Player 1 did not win
            updateGameStatus2(`${winners[0]} wins the tournament!`);
            announceWinner('Lose');
        }
    }
    


    function announceWinner(result) {
        const csrfToken = getCookie('csrftoken');
        let game_type = 11;
    
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
