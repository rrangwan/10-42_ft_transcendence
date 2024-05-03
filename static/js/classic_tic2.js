document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('#game-board2 .cell');
    const gameStatus = document.getElementById('game-status');
    const startButton = document.getElementById('start-button');
    const countdownDisplay = document.getElementById('countdown');

    let player = 'X';
    let board = Array(4).fill('').map(() => Array(4).fill('')); // 4x4 board initialization
    let gameActive = false;

    startButton.addEventListener('click', startButtonClick);

    function startButtonClick() {
        startButton.style.display = 'none';
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
        board = Array(4).fill('').map(() => Array(4).fill(''));
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
    
    function checkWinner() {
        // Check rows and columns for four in a row
        for (let i = 0; i < 4; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player && board[i][3] === player) return true;
            if (board[0][i] === player && board[1][i] === player && board[2][i] === player && board[3][i] === player) return true;
        }
        // Check diagonals for four in a row
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player && board[3][3] === player) return true;
        if (board[0][3] === player && board[1][2] === player && board[2][1] === player && board[3][0] === player) return true;
        return false;
    }

    function endGame() {
        gameActive = false;
        cells.forEach(cell => cell.disabled = true);
        startButton.textContent = 'Restart Game';
        startButton.style.display = 'block';
    }

    function announceWinner(result) {
        const csrfToken = getCookie('csrftoken');
        let game_type = 10;  
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
