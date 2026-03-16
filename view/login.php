 <!-- ====================== LOGIN PAGE ====================== -->
    <div id="login-screen">
        <div class="login-container">
            <div class="logo-circle">
                <img src="images/logo.png" alt="F21 Cafe Logo">
            </div>
            <h2>F21 CAFE</h2>
            <p class="subtitle-text">EST 2023</p>

            <!-- Login Fields -->
            <input type="text" id="user_name" placeholder="Username" required>
            <input type="password" id="pass_word" placeholder="Password" required>
            <p class="error-text" id="login_msg"></p>

            <button class="login-btn" onclick="doLogin()">Log In</button>

            <!-- Demo Account Info -->
            <p class="demo-info">
                <strong>Demo Accounts:</strong><br>
                Owner: owner / admin123<br>
                Staff: staff / staff123<br>
                Staff2: user / user123
            </p>
        </div>
    </div>