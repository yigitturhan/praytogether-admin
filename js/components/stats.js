// Stats Component
const Stats = {
    render() {
        const state = State.get();
        const stats = state.dashboard?.stats || {};
        
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${this.renderStatCard(
                    '👥 Toplam Kullanıcı',
                    stats.total_users || 0,
                    'border-blue-500'
                )}
                ${this.renderStatCard(
                    '🙏 Aktif Dualar',
                    stats.active_prayers || 0,
                    'border-purple-500'
                )}
                ${this.renderStatCard(
                    '✅ Tamamlanan',
                    stats.completed_prayers || 0,
                    'border-green-500'
                )}
                ${this.renderStatCard(
                    '⭐ Toplam Puan',
                    Utils.formatNumber(stats.total_points || 0),
                    'border-yellow-500'
                )}
            </div>
        `;
    },

    renderStatCard(label, value, borderClass) {
        return `
            <div class="stat-card ${borderClass}">
                <p class="text-sm text-gray-600 mb-2">${label}</p>
                <p class="text-3xl font-bold text-gray-900">${value}</p>
            </div>
        `;
    }
};

// Export for use in other modules
window.Stats = Stats;