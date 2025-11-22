// Prayers Page
const PrayersPage = {
    render() {
        const state = State.get();
        const prayers = state.prayers;
        
        if (!prayers || prayers.length === 0) {
            return `
                <div class="bg-white rounded-xl shadow p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">Dua Ä°stekleri</h2>
                    <div class="text-center py-8 text-gray-500">Dua isteÄŸi bulunamadÄ±</div>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-xl shadow">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-900">Dua Ä°stekleri (${prayers.length})</h2>
                </div>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Başlık</th>
                                <th>İsteyen</th>
                                <th>Tür</th>
                                <th>İlerleme</th>
                                <th>Kalan</th>
                                <th>Puan</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${prayers.map(prayer => this.renderPrayerRow(prayer)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderPrayerRow(prayer) {
        const progress = Utils.calculateProgress(prayer.prayer_completed_count, prayer.prayer_count);
        const progressColor = Utils.getProgressColor(progress);
        
        return `
            <tr>
                <td>
                    <div class="font-medium text-gray-900 truncate" style="max-width: 200px;" title="${Utils.escapeHtml(prayer.title)}">
                        ${Utils.escapeHtml(prayer.title)}
                    </div>
                    <div class="text-xs text-gray-500 mt-1 truncate" style="max-width: 200px;" title="${Utils.escapeHtml(prayer.description)}">
                        ${Utils.escapeHtml(Utils.truncate(prayer.description, 50))}
                    </div>
                </td>
                <td class="text-gray-600">
                    ${Utils.escapeHtml(prayer.requester_name)}
                </td>
                <td>
                    <span class="text-sm font-medium text-gray-700">
                        ðŸ“¿ ${prayer.prayer_type}
                    </span>
                </td>
                <td>
                    <div class="flex items-center space-x-2">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%; background: ${progressColor};"></div>
                        </div>
                        <span class="text-xs text-gray-600 whitespace-nowrap">
                            ${prayer.prayer_completed_count}/${prayer.prayer_count}
                        </span>
                    </div>
                </td>
                <td>
                    <span class="text-lg font-bold text-orange-600">
                        ${prayer.remaining_count || (prayer.prayer_count - prayer.prayer_completed_count)}
                    </span>
                    <div class="text-xs text-gray-500">dua</div>
                </td>
                <td>
                    <div class="text-sm">
                        <div class="text-green-600 font-medium">+${prayer.points_reward}</div>
                        <div class="text-red-600 text-xs">-${prayer.points_cost}</div>
                    </div>
                </td>
                <td>
                    ${Utils.getStatusBadge(prayer.status)}
                </td>
                <td class="text-sm text-gray-500">
                    ${Utils.timeAgo(prayer.created_at)}
                </td>
                <td>
                    <button
                        onclick="State.showDeleteModal('prayer', '${prayer.id}', '${Utils.escapeHtml(prayer.title)}')"
                        class="btn-danger"
                        title="Dua Ä°steÄŸini Sil"
                    >
                        ðŸ—‘ï¸ Sil
                    </button>
                </td>
            </tr>
        `;
    }
};

// Export for use in other modules
window.PrayersPage = PrayersPage;