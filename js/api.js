// API Module
const API = {
    // Base request method
    async request(endpoint, options = {}) {
        const token = Auth.getToken();
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, mergedOptions);
            const data = await response.json();
            
            if (response.status === 401) {
                Auth.logout();
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },

    // Dashboard - fetch all data separately like old panel
    async getDashboard() {
        try {
            const [usersRes, prayersRes, statsRes] = await Promise.all([
                this.request(CONFIG.ENDPOINTS.USERS),
                this.request(CONFIG.ENDPOINTS.PRAYERS),
                this.request(CONFIG.ENDPOINTS.STATS)
            ]);

            if (usersRes && usersRes.success && prayersRes && prayersRes.success && statsRes && statsRes.success) {
                return {
                    success: true,
                    data: {
                        stats: statsRes.stats,
                        recent_prayers: prayersRes.prayers ? prayersRes.prayers.slice(0, 5) : []
                    }
                };
            }
            
            return { success: false };
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            return { success: false };
        }
    },

    // Users
    async getUsers() {
        return await this.request(CONFIG.ENDPOINTS.USERS);
    },

    async updateUserStatus(userId, isActive) {
        return await this.request(`${CONFIG.ENDPOINTS.USERS}/${userId}/toggle-active`, {
            method: 'POST'
        });
    },

    async deleteUser(userId) {
        return await this.request(`${CONFIG.ENDPOINTS.USERS}/${userId}`, {
            method: 'DELETE'
        });
    },

    // Prayers
    async getPrayers() {
        return await this.request(CONFIG.ENDPOINTS.PRAYERS);
    },

    async deletePrayer(prayerId) {
        return await this.request(`${CONFIG.ENDPOINTS.PRAYERS}/${prayerId}`, {
            method: 'DELETE'
        });
    },

    // Reports
    async getReports() {
        return await this.request(CONFIG.ENDPOINTS.REPORTS);
    },

    async updateReportStatus(reportId, status) {
        return await this.request(`${CONFIG.ENDPOINTS.REPORTS}/${reportId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    // Notifications
    async sendNotification(title, message) {
        return await this.request(CONFIG.ENDPOINTS.SEND_NOTIFICATION, {
            method: 'POST',
            body: JSON.stringify({ title, message })
        });
    }
};

// Export for use in other modules
window.API = API;