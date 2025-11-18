// Reports Page
const ReportsPage = {
    render() {
        const state = State.get();
        const reports = state.reports;
        
        if (!reports || reports.length === 0) {
            return `
                <div class="bg-white rounded-xl shadow p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">Şikayetler</h2>
                    <div class="text-center py-8 text-gray-500">Şikayet bulunamadı</div>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-xl shadow">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-900">Şikayetler (${reports.length})</h2>
                </div>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Şikayet Eden</th>
                                <th>Şikayet Edilen</th>
                                <th>Tür</th>
                                <th>Açıklama</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reports.map(report => this.renderReportRow(report)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderReportRow(report) {
        return `
            <tr>
                <td class="text-gray-700">
                    ${Utils.escapeHtml(report.reporter_name)}
                    <div class="text-xs text-gray-500">${report.reporter_phone}</div>
                </td>
                <td class="text-gray-700">
                    ${Utils.escapeHtml(report.reported_user_name)}
                    <div class="text-xs text-gray-500">${report.reported_user_phone}</div>
                </td>
                <td>
                    <span class="text-sm font-medium text-gray-700">
                        ${Utils.getReportTypeLabel(report.report_type)}
                    </span>
                </td>
                <td>
                    <div class="text-sm text-gray-600 truncate" style="max-width: 250px;" title="${Utils.escapeHtml(report.description)}">
                        ${Utils.escapeHtml(Utils.truncate(report.description, 60))}
                    </div>
                    ${report.prayer_title ? `
                        <div class="text-xs text-purple-600 mt-1">
                            🙏 ${Utils.escapeHtml(report.prayer_title)}
                        </div>
                    ` : ''}
                </td>
                <td>
                    ${Utils.getStatusBadge(report.status)}
                </td>
                <td class="text-sm text-gray-500">
                    ${Utils.timeAgo(report.created_at)}
                </td>
                <td>
                    <div class="flex space-x-2">
                        ${report.status === 'pending' ? `
                            <button 
                                onclick="ReportsPage.updateStatus('${report.id}', 'reviewed')"
                                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                                title="İncelendi Olarak İşaretle"
                            >
                                👀 İncelendi
                            </button>
                        ` : ''}
                        ${report.status !== 'resolved' ? `
                            <button 
                                onclick="ReportsPage.updateStatus('${report.id}', 'resolved')"
                                class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                                title="Çözüldü Olarak İşaretle"
                            >
                                ✅ Çözüldü
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    },

    async updateStatus(reportId, status) {
        State.setLoading(true);
        
        try {
            const result = await API.updateReportStatus(reportId, status);
            
            if (result && result.success) {
                Utils.showToast('Şikayet durumu güncellendi!');
                await App.loadReports();
            } else {
                Utils.showToast(result?.message || 'İşlem başarısız!');
            }
        } catch (error) {
            console.error('Update report status error:', error);
            Utils.showToast('Bir hata oluştu!');
        } finally {
            State.setLoading(false);
        }
    }
};

// Export for use in other modules
window.ReportsPage = ReportsPage;