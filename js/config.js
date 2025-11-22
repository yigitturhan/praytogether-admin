// Configuration
const CONFIG = {
    // API Base URL - Railway deployed backend
    API_BASE_URL: 'https://web-production-5cd1.up.railway.app/api',
    
    // Local Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'admin_token',
        USERNAME: 'admin_username'
    },
    
    // API Endpoints
    ENDPOINTS: {
        LOGIN: '/auth/admin-login',
        STATS: '/admin/stats',
        USERS: '/admin/users',
        PRAYERS: '/admin/prayers',
        REPORTS: '/admin/reports',
        SEND_NOTIFICATION: '/admin/send-notification'
    },
    
    // Status Labels
    STATUS_LABELS: {
        active: { text: 'Aktif', class: 'bg-green-100 text-green-700' },
        completed: { text: 'Tamamlandı', class: 'bg-blue-100 text-blue-700' },
        expired: { text: 'Süresi Doldu', class: 'bg-gray-100 text-gray-700' },
        pending: { text: 'Bekliyor', class: 'bg-yellow-100 text-yellow-700' },
        reviewed: { text: 'İncelendi', class: 'bg-blue-100 text-blue-700' },
        resolved: { text: 'Çözüldü', class: 'bg-green-100 text-green-700' }
    },
    
    // Report Type Labels
    REPORT_TYPE_LABELS: {
        inappropriate: 'Uygunsuz İçerik',
        spam: 'Spam',
        offensive: 'Rahatsız Edici',
        other: 'Diğer'
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;