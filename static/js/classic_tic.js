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
        board = [['', '', ''], ['', '', ''], ['', '', '']];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
        });
        gameStatus.textContent = updateStatus();
    }

    function updateStatus() {
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
        let game_type = 7;  
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
