// Authentication Module
const Auth = {
    // Get stored token
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    },

    // Save token
    saveToken(token) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    },

    // Remove token
    removeToken() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
    },

    // Get username
    getUsername() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
    },

    // Save username
    saveUsername(username) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, username);
    },

    // Check if authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Login
    async login(username, password) {
        try {
            // GET request with query parameters (eski panel gibi)
            const url = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.LOGIN}`;

const response = await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({ username, password })
});


            // Check if response is ok
            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                
                // Try to parse error message
                try {
                    const errorData = await response.json();
                    return { success: false, message: errorData.message || 'Giriş başarısız!' };
                } catch (e) {
                    return { success: false, message: `Server error: ${response.status}` };
                }
            }

            // Check if response has content
            const text = await response.text();
            if (!text) {
                console.error('Empty response from server');
                return { success: false, message: 'Sunucudan boş yanıt!' };
            }

            // Parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e, 'Response text:', text);
                return { success: false, message: 'Sunucu yanıtı okunamadı!' };
            }

            if (data.success && data.token) {
                this.saveToken(data.token);
                this.saveUsername(username);
                return { success: true, message: 'Giriş başarılı!' };
            } else {
                return { success: false, message: data.message || 'Giriş başarısız!' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Bağlantı hatası: ' + error.message };
        }
    },

    // Logout
    logout() {
        this.removeToken();
        window.location.href = 'login.html';
    },

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Export for use in other modules
window.Auth = Auth;