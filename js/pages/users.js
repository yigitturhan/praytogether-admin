// Users Page
const UsersPage = {
    render() {
        const state = State.get();
        const users = state.users;
        
        if (!users || users.length === 0) {
            return `
                <div class="bg-white rounded-xl shadow p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">Kullanıcılar</h2>
                    <div class="text-center py-8 text-gray-500">Kullanıcı bulunamadı</div>
                </div>
            `;
        }

        return `
            <div class="bg-white rounded-xl shadow">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold text-gray-900">Kullanıcılar (${users.length})</h2>
                </div>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>İsim</th>
                                <th>Telefon</th>
                                <th>Puan</th>
                                <th>Durum</th>
                                <th>Kayıt Tarihi</th>
                                <th>İstatistikler</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => this.renderUserRow(user)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderUserRow(user) {
        return `
            <tr>
                <td class="font-medium text-gray-900">
                    ${Utils.escapeHtml(user.name)}
                </td>
                <td class="text-gray-600">${user.phone}</td>
                <td>
                    <span class="font-semibold text-purple-600">
                        ${Utils.formatNumber(user.points)} ⭐
                    </span>
                </td>
                <td>
                    <span class="badge ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${user.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                </td>
                <td class="text-sm text-gray-500">
                    ${Utils.timeAgo(user.created_at)}
                </td>
                <td class="text-sm text-gray-600">
                    <div>✅ ${user.prayers_completed} tamamlandı</div>
                    <div>🙏 ${user.prayers_requested} istendi</div>
                </td>
                <td>
                    <div class="flex space-x-2">
                        <button
                            onclick="UsersPage.toggleUserStatus('${user.id}')"
                            class="px-3 py-1 ${user.is_active ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded-lg text-sm font-medium"
                            title="${user.is_active ? 'Pasif Yap' : 'Aktif Yap'}"
                        >
                            ${user.is_active ? '🚫 Pasif Yap' : '✅ Aktif Yap'}
                        </button>
                        <button
                            onclick="State.showDeleteModal('user', '${user.id}', '${Utils.escapeHtml(user.name)}')"
                            class="btn-danger"
                            title="Kullanıcıyı Sil"
                        >
                            🗑️ Sil
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    async toggleUserStatus(userId) {
        State.setLoading(true);
        
        try {
            const result = await API.updateUserStatus(userId);
            
            if (result && result.success) {
                Utils.showToast(result.message);
                await App.loadUsers();
            } else {
                Utils.showToast(result?.message || 'İşlem başarısız!');
            }
        } catch (error) {
            console.error('Toggle user status error:', error);
            Utils.showToast('Bir hata oluştu!');
        } finally {
            State.setLoading(false);
        }
    }
};

// Export for use in other modules
window.UsersPage = UsersPage;