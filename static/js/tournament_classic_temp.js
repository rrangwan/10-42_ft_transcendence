document.addEventListener('DOMContentLoaded', function () {
    // Elements for alias submission and game control
    const player2AliasInput = document.getElementById('player2-alias');
    const player3AliasInput = document.getElementById('player3-alias');
    const submitAliasesButton = document.getElementById('submit-aliases');
    const startButton = document.getElementById('start-button');
    const aliasInputs = document.getElementById('alias-inputs');

    // Game score display elements and player names setup
    const currentNamePlayer1 = document.getElementById('current-name-player1');
    const currentNamePlayer2 = document.getElementById('current-name-player2');
    const currentNamePlayer3 = document.getElementById('current-name-player3');

    // Player names and scores initialization
    let playerNames = [currentNamePlayer1.textContent, '', '']; // Initialize with Player 1's nickname from the server
    const currentScores = [0, 0, 0];
    let gameSequence = 0;

    // Handle alias submission
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

    function validateAliases(aliases) {
        // Check for unique, non-empty, and valid pattern aliases
        const uniqueAliases = new Set(aliases);
        if (uniqueAliases.size !== aliases.length || aliases.includes("")) return false;
        return aliases.every(alias => /^[a-zA-Z0-9]{2,9}$/.test(alias));
    }

    startButton.addEventListener('click', startGameSequence);

    function startGameSequence() {
        startButton.style.display = 'none';
        // Set active players based on game sequence
        switch (gameSequence % 3) {
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
        let countdown = 3; // 3-second countdown
        let countdownElement = document.getElementById('countdown');
        countdownElement.textContent = countdown + ' seconds until ' + matchTitle;
        let interval = setInterval(function() {
            countdown--;
            countdownElement.textContent = countdown + ' seconds until ' + matchTitle;
            if (countdown <= 0) {
                clearInterval(interval);
                countdownElement.textContent = ''; // Clear countdown
                startRound(player1Index, player2Index);
            }
        }, 1000);
    }

    function startRound(player1Index, player2Index) {
        let timeLeft = 5; // 20 seconds per round
        let timerElement = document.getElementById('game-timer');
        timerElement.textContent = 'Time Left: ' + timeLeft;
        let interval = setInterval(function() {
            timeLeft--;
            timerElement.textContent = 'Time Left: ' + timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                concludeRound(player1Index, player2Index);
            }
        }, 1000);
    }

    function concludeRound(player1Index, player2Index) {
        // Logic to handle end of a round
        alert(`Round over between ${playerNames[player1Index]} and ${playerNames[player2Index]}`);
        if (gameSequence < 3) {
            startGameSequence();
        } else {
            determineWinner();
        }
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
            // Check if Player 1 is among the winners
            if (winners.includes(playerNames[0])) {
                alert('The game is a draw between: ' + winners.join(', '));
                result = 'Draw';
            } else {
                alert('The winners are: ' + winners.join(', '));
                result = 'Lose';
            }
        } else {
            alert('Winner is: ' + winners[0]);
            result = (winners[0] === playerNames[0]) ? 'Win' : 'Lose';
        }
    
        announceWinner(result);
    }
    
    // Function to handle CSRF token retrieval and POST request
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
        let game_type = 2; // Classic Pong Tournament
    
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
    
    // Attach keydown event listener for scoring
    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            currentScores[0]++;
            document.getElementById('current-score-player1').textContent = currentScores[0];
        } else if (event.key === 'ArrowUp') {
            if (gameSequence % 3 === 0) {
                currentScores[1]++;
                document.getElementById('current-score-player2').textContent = currentScores[1];
            } else if (gameSequence % 3 === 1) {
                currentScores[2]++;
                document.getElementById('current-score-player3').textContent = currentScores[2];
            } else if (gameSequence % 3 === 2) {
                if (event.key === 'w') {
                    currentScores[1]++;
                    document.getElementById('current-score-player2').textContent = currentScores[1];
                } else {
                    currentScores[2]++;
                    document.getElementById('current-score-player3').textContent = currentScores[2];
                }
            }
        }
    });
});
