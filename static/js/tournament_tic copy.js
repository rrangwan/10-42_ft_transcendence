    function moveBall() {
        // movementInterval = setInterval(function() {
            let nextX = ball.offsetLeft + ballSpeedX;
            let nextY = ball.offsetTop + ballSpeedY;
    
            // Collision with top or bottom
            if (nextY <= 0 || nextY + ball.offsetHeight >= gameArea.clientHeight) {
                ballSpeedY *= -1;
            }
    
            // Collision with paddles
            if (checkPaddleCollision(nextX, nextY)) {
                ballSpeedX *= -1; // Reverse the horizontal direction
            }
    
            // Handle player-ball collisions
            if (nextX - ball.offsetWidth <= paddle1.offsetLeft + paddle1.offsetWidth && nextX >= paddle1.offsetLeft) {
                if (nextY <= paddle1.offsetTop + paddle1.offsetHeight && nextY + ball.offsetHeight >= paddle1.offsetTop) {
                    nextX = paddle1.offsetLeft + paddle1.offsetWidth + ball.offsetWidth;
                    ballSpeedX = 1; // Set the ball's horizontal speed
                    ballSpeedY *= -1; // Reverse the vertical direction
                }
            }
    
            if (nextX <= paddle2.offsetLeft + paddle2.offsetWidth && nextX + ball.offsetWidth >= paddle2.offsetLeft) {
                if (nextY <= paddle2.offsetTop + paddle2.offsetHeight && nextY + ball.offsetHeight >= paddle2.offsetTop) {
                    nextX = paddle2.offsetLeft - ball.offsetWidth;
                    ballSpeedX = -1; // Set the ball's horizontal speed
                    ballSpeedY *= -1; // Reverse the vertical direction
                }
            }
    
            // Update ball position
            ball.style.left = `${nextX}px`;
            ball.style.top = `${nextY}px`;
    
            // Check for game over condition
            checkGameOver(ball.offsetLeft);
    
            // Check for new serve
            if (ball.offsetLeft + ball.offsetWidth < 0 || ball.offsetLeft > gameArea.clientWidth) {
                resetBall();
                ballSpeedX = 2; // Set the ball's horizontal speed for the new serve
                ballSpeedY = Math.random() < 0.5 ? -2 : 2; // Randomize the vertical direction
            }
        // }, 20);
        animationFrameId = requestAnimationFrame(moveBall);
    }