// Dashboard Page
const DashboardPage = {
    render() {
        const state = State.get();
        const dashboard = state.dashboard;
        
        if (!dashboard) {
            return '<div class="text-center py-8 text-gray-500">Veriler yükleniyor...</div>';
        }

        return `
            <div class="space-y-8">
                ${Stats.render()}
                
                ${this.renderRecentActivity()}
            </div>
        `;
    },

    renderRecentActivity() {
        const state = State.get();
        const dashboard = state.dashboard;
        
        if (!dashboard?.recent_prayers || dashboard.recent_prayers.length === 0) {
            return '';
        }

        return `
            <div class="bg-white rounded-xl shadow p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-6">Son Dua İstekleri</h2>
                <div class="space-y-4">
                    ${dashboard.recent_prayers.map(prayer => `
                        <div class="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-900">${Utils.escapeHtml(prayer.title)}</h3>
                                <p class="text-sm text-gray-600 mt-1">
                                    ${Utils.escapeHtml(prayer.requester_name)} tarafından ${Utils.timeAgo(prayer.created_at)}
                                </p>
                                <div class="flex items-center space-x-4 mt-2">
                                    <span class="text-xs text-gray-500">
                                        📿 ${prayer.prayer_type}
                                    </span>
                                    <span class="text-xs text-gray-500">
                                        🔢 ${prayer.prayer_completed_count}/${prayer.prayer_count}
                                    </span>
                                    <span class="text-xs text-gray-500">
                                        ⭐ ${prayer.points_reward} puan
                                    </span>
                                </div>
                            </div>
                            <div class="ml-4">
                                ${Utils.getStatusBadge(prayer.status)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
window.DashboardPage = DashboardPage;