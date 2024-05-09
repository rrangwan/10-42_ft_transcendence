document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('game-status');
    const startButton = document.getElementById('start-button');
    const countdownDisplay = document.getElementById('countdown');

    let player = 'X';
    let board = [['', '', ''], ['', '', ''], ['', '', '']];
    let gameActive = false;

    startButton.addEventListener('click', startButtonClick);

    function startButtonClick() {
        startButton.style.display = 'none'; // Hide the start button
        gameStatus.style.display = ' ';
        performCountdown();
    }

    function performCountdown() {
        let countdown = 3;
        countdownDisplay.textContent = countdown;
        const countdownInterval = setInterval(() => {
            countdown -= 1;
            countdownDisplay.textContent = countdown > 0 ? countdown : 'Go!';
            if (countdown === 0) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                    countdownDisplay.textContent = '';
                    startGame();
                }, 1000);
            }
        }, 1000);
    }

    function startGame() {
        gameActive = true;
        board = Array(4).fill(null).map(() => Array(4).fill(''));
        cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
        });
        attachEventListeners();
        gameStatus.textContent = updateStatus();
    }
    
    
    function attachEventListeners() {
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick); // Remove previous listener to avoid duplicates
            cell.addEventListener('click', handleCellClick);    // Add new listener
        });
    }
    
    function updateStatus() {
        return `${player === 'X' ? playerName : 'Player 2'}'s turn (${player})`;
    }

    function handleCellClick() {
        if (!gameActive || this.textContent !== '') return;

        const row = parseInt(this.id.charAt(5));
        const col = parseInt(this.id.charAt(6));

        if (player === 'X') {  // Human Player
            makeMove(this, row, col, player);
            if (checkGameOver()) return;

            // Switch to bot move if the game is not over
            player = 'O';
            setTimeout(botMove, 300);  // Simple delay to simulate bot thinking time
        }
    }

    function botMove() {
        // First try to win by completing three in a row
        if (!tryToWin()) {
            // If no winning move, then try to block the human player
            if (!tryToBlock()) {
                // Make the default move if no blocking or winning is necessary
                makeDefaultMove();
            }
        }
        if (!checkGameOver()) {
            // Switch back to human player
            player = 'X';
            gameStatus.textContent = updateStatus();
        }
    }
    
    function tryToWin() {
        // Check each row, column, and diagonal for three 'O's and an empty spot
        for (let i = 0; i < 4; i++) {
            if (findThreeInRow('O', i)) return true;
        }
        return false;
    }
    
    function findThreeInRow(symbol, index) {
        // This needs to be expanded to look for three in a row with an empty space in rows, columns, and diagonals
        return findThree(board[index], symbol) || 
               findThree([board[0][index], board[1][index], board[2][index], board[3][index]], symbol);
    }
    
    function findThree(line, symbol) {
        // Example simple logic for finding three of the same symbols with an empty space
        for (let i = 0; i < line.length - 2; i++) {
            if (line.slice(i, i + 3).filter(x => x === symbol).length === 3 && line.includes('')) {
                const emptyIndex = line.indexOf('');
                if (emptyIndex !== -1) {
                    const cell = document.getElementById(`cell-${index}${emptyIndex}`);
                    makeMove(cell, index, emptyIndex, 'O');
                    return true;
                }
            }
        }
        return false;
    }
    
    
    function tryToBlock() {
        // Check rows for potential blocks
        for (let row = 0; row < 3; row++) {
            if (canBlock(row, 0, row, 1, row, 2)) return true;
        }
        // Check columns for potential blocks
        for (let col = 0; col < 3; col++) {
            if (canBlock(0, col, 1, col, 2, col)) return true;
        }
        // Check diagonals for potential blocks
        if (canBlock(0, 0, 1, 1, 2, 2)) return true;
        if (canBlock(0, 2, 1, 1, 2, 0)) return true;
    
        return false;
    }
    
    function canBlock(row1, col1, row2, col2, row3, col3) {
        // This function checks if two cells have 'X' and one is empty, then blocks it with 'O'
        let cells = [[row1, col1], [row2, col2], [row3, col3]];
        let countX = 0;
        let emptyCell = null;
    
        cells.forEach(cell => {
            if (board[cell[0]][cell[1]] === 'X') {
                countX++;
            } else if (board[cell[0]][cell[1]] === '') {
                emptyCell = cell;
            }
        });
    
        if (countX === 2 && emptyCell) {
            const [emptyRow, emptyCol] = emptyCell;
            const cell = document.getElementById(`cell-${emptyRow}${emptyCol}`);
            makeMove(cell, emptyRow, emptyCol, player);
            return true;
        }
    
        return false;
    }
    
    function makeDefaultMove() {
        // Make the first available move if no blocking is required
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    const cell = document.getElementById(`cell-${row}${col}`);
                    makeMove(cell, row, col, player);
                    return;
                }
            }
        }
    }
    

    function makeMove(cell, row, col, currentPlayer) {
        board[row][col] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkGameOver()) return;
        gameStatus.textContent = updateStatus();
    }

    function updateStatus() {
        return `${player === 'X' ? playerName : 'Player 2'}'s turn (${player})`;
    }

    function checkGameOver() {
        if (checkWinner()) {
            gameStatus.textContent = `${player === 'X' ? playerName : 'Player 2'} Wins!`;
            announceWinner(player === 'X' ? 'Win' : 'Lose');
            endGame();
            return true;
        } else if (checkDraw()) {
            gameStatus.textContent = 'Draw!';
            announceWinner('Draw');
            endGame();
            return true;
        }
        return false;
    }

    function endGame() {
        gameActive = false;
        cells.forEach(cell => cell.disabled = true);
        startButton.textContent = 'Restart Game';
        startButton.style.display = 'block';
    }

    


    function checkDraw() {
        return board.every(row => row.every(cell => cell !== ''));
    }

    function checkWinner() {
        // Check rows and columns
        for (let i = 0; i < 4; i++) {
            if (checkLine(board[i][0], board[i][1], board[i][2], board[i][3])) return true;
            if (checkLine(board[0][i], board[1][i], board[2][i], board[3][i])) return true;
        }
        // Check diagonals
        if (checkLine(board[0][0], board[1][1], board[2][2], board[3][3])) return true;
        if (checkLine(board[0][3], board[1][2], board[2][1], board[3][0])) return true;
    
        return false;
    }
    
    function checkLine(a, b, c, d) {
        return (a === b && a === c && a === d && a !== '');
    }
    
    

    function announceWinner(result) {
        if (!gameActive) return;  // Prevent multiple postings if the game has already ended
        gameActive = false;       // Ensure no more game actions can occur
        const csrfToken = getCookie('csrftoken');
        let game_type = 12;  
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


    
});
