// Utility Functions
const Utils = {
    // Format time ago
    timeAgo(dateString) {
        if (!dateString) return 'Bilinmiyor';
        
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = {
            yıl: 31536000,
            ay: 2592000,
            gün: 86400,
            saat: 3600,
            dakika: 60
        };
        
        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return `${interval} ${name} önce`;
            }
        }
        
        return 'Az önce';
    },

    // Format date
    formatDate(dateString) {
        if (!dateString) return 'Bilinmiyor';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format number with separator
    formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    // Get status badge HTML
    getStatusBadge(status) {
        const statusInfo = CONFIG.STATUS_LABELS[status] || { 
            text: status, 
            class: 'bg-gray-100 text-gray-700' 
        };
        return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
    },

    // Get report type label
    getReportTypeLabel(type) {
        return CONFIG.REPORT_TYPE_LABELS[type] || type;
    },

    // Show toast notification
    showToast(message, type = 'info') {
        // Simple alert for now - can be enhanced with a toast library
        alert(message);
    },

    // Confirm action
    confirm(message) {
        return window.confirm(message);
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Truncate text
    truncate(text, length = 50) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    // Calculate progress percentage
    calculateProgress(completed, total) {
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    },

    // Get progress color
    getProgressColor(percentage) {
        if (percentage >= 75) return '#10b981'; // green
        if (percentage >= 50) return '#3b82f6'; // blue
        if (percentage >= 25) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    }
};

// Export for use in other modules
window.Utils = Utils;