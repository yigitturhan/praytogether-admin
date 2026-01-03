// Users Page
const UsersPage = {
    searchName: '',
    searchPhone: '',

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

        // Filter users based on search
        const filteredUsers = this.filterUsers(users);

        return `
            <div class="bg-white rounded-xl shadow">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-900">Kullanıcılar (${filteredUsers.length}/${users.length})</h2>
                        
                        <!-- Add Prayer Limits to All Button -->
                        <button
                            onclick="UsersPage.showAddPrayerLimitsAllDialog()"
                            class="px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg font-semibold shadow-md hover:from-purple-800 hover:to-indigo-800 transition-all duration-200"
                            title="Tüm Kullanıcılara Dua Hakkı Ekle"
                        >
                            ✨ Tüm Kullanıcılara Dua Hakkı Ekle
                        </button>
                    </div>
                    
                    <!-- Search Boxes -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2" style="display: block;">
                                İsim ile Ara
                            </label>
                            <input
                                type="text"
                                id="searchName"
                                placeholder="İsim giriniz..."
                                value="${this.searchName}"
                                oninput="UsersPage.handleSearchName(this.value)"
                                class="w-full px-4 py-2 rounded-lg"
                            >
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 mb-2" style="display: block;">
                                Telefon ile Ara
                            </label>
                            <input
                                type="text"
                                id="searchPhone"
                                placeholder="Telefon numarası giriniz..."
                                value="${this.searchPhone}"
                                oninput="UsersPage.handleSearchPhone(this.value)"
                                class="w-full px-4 py-2 rounded-lg"
                            >
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>İsim</th>
                                <th>Telefon</th>
                                <th>Puan</th>
                                <th>Kalan Dua Hakkı</th>
                                <th>Durum</th>
                                <th>Kayıt Tarihi</th>
                                <th>İstatistikler</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredUsers.length > 0 
                                ? filteredUsers.map(user => this.renderUserRow(user)).join('') 
                                : '<tr><td colspan="8" class="text-center py-8 text-gray-500">Arama sonucu bulunamadı</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    filterUsers(users) {
        return users.filter(user => {
            const nameMatch = this.searchName === '' || 
                user.name.toLowerCase().includes(this.searchName.toLowerCase());
            
            const phoneMatch = this.searchPhone === '' || 
                user.phone.includes(this.searchPhone);
            
            return nameMatch && phoneMatch;
        });
    },

    handleSearchName(value) {
        this.searchName = value;
        this.updateTable();
    },

    handleSearchPhone(value) {
        this.searchPhone = value;
        this.updateTable();
    },

    updateTable() {
        const state = State.get();
        const users = state.users;
        const filteredUsers = this.filterUsers(users);
        
        // Update only the table body and count
        const tbody = document.querySelector('table tbody');
        const countElement = document.querySelector('.p-6.border-b h2');
        
        if (tbody) {
            tbody.innerHTML = filteredUsers.length > 0 
                ? filteredUsers.map(user => this.renderUserRow(user)).join('') 
                : '<tr><td colspan="8" class="text-center py-8 text-gray-500">Arama sonucu bulunamadı</td></tr>';
        }
        
        if (countElement) {
            countElement.textContent = `Kullanıcılar (${filteredUsers.length}/${users.length})`;
        }
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
                    <span class="font-bold text-orange-600 text-lg">
                        ${user.prayer_limits_remaining || 0}
                    </span>
                    <div class="text-xs text-gray-500">dua hakkı</div>
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
                    <div class="flex flex-col space-y-2">
                        <!-- Prayer Limits Button -->
                        <button
                            onclick="UsersPage.showAddPrayerLimitsDialog('${user.id}', '${Utils.escapeHtml(user.name)}')"
                            class="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
                            title="Dua Hakkı Ekle"
                        >
                            ✨ Dua Hakkı Ekle
                        </button>
                        
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
                    </div>
                </td>
            </tr>
        `;
    },

    showAddPrayerLimitsDialog(userId, userName) {
        const html = `
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">
                    🙏 ${userName} için Dua Hakkı Ekle
                </h3>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Dua Hakkı Miktarı
                    </label>
                    <input
                        type="number"
                        id="prayerLimitAmount"
                        min="1"
                        max="1000"
                        value="10"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Örn: 10, 50, 100"
                    />
                    <p class="mt-2 text-sm text-gray-500">
                        Bu kullanıcıya eklenecek dua hakkı miktarını giriniz
                    </p>
                </div>
                
                <div class="flex space-x-3">
                    <button
                        onclick="Modal.hide()"
                        class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                    >
                        İptal
                    </button>
                    <button
                        onclick="UsersPage.confirmAddPrayerLimitsToUser('${userId}')"
                        class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg"
                    >
                        ✨ Ekle
                    </button>
                </div>
            </div>
        `;
        
        Modal.show(html);
    },

    showAddPrayerLimitsAllDialog() {
        const state = State.get();
        const activeUserCount = state.users.filter(u => u.is_active).length;
        
        const html = `
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">
                    ✨ Tüm Kullanıcılara Dua Hakkı Ekle
                </h3>
                
                <div class="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p class="text-sm text-purple-800">
                        <strong>${activeUserCount}</strong> aktif kullanıcıya dua hakkı eklenecek
                    </p>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Dua Hakkı Miktarı
                    </label>
                    <input
                        type="number"
                        id="prayerLimitAmountAll"
                        min="1"
                        max="1000"
                        value="10"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Örn: 10, 50, 100"
                    />
                    <p class="mt-2 text-sm text-gray-500">
                        Her kullanıcıya eklenecek dua hakkı miktarını giriniz
                    </p>
                </div>
                
                <div class="flex space-x-3">
                    <button
                        onclick="Modal.hide()"
                        class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                    >
                        İptal
                    </button>
                    <button
                        onclick="UsersPage.confirmAddPrayerLimitsToAll()"
                        class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg"
                    >
                        ✨ Tümüne Ekle
                    </button>
                </div>
            </div>
        `;
        
        Modal.show(html);
    },

    async confirmAddPrayerLimitsToUser(userId) {
        const amountInput = document.getElementById('prayerLimitAmount');
        const amount = parseInt(amountInput.value);
        
        if (!amount || amount < 1 || amount > 1000) {
            Utils.showToast('Lütfen 1-1000 arası geçerli bir miktar giriniz!');
            return;
        }
        
        Modal.hide();
        State.setLoading(true);
        
        try {
            const result = await API.addPrayerLimitsToUser(userId, amount);
            
            if (result && result.success) {
                Utils.showToast(result.message);
                await App.loadUsers();
            } else {
                Utils.showToast(result?.message || 'Dua hakkı eklenemedi!');
            }
        } catch (error) {
            console.error('Add prayer limits error:', error);
            Utils.showToast('Bir hata oluştu!');
        } finally {
            State.setLoading(false);
        }
    },

    async confirmAddPrayerLimitsToAll() {
        const amountInput = document.getElementById('prayerLimitAmountAll');
        const amount = parseInt(amountInput.value);
        
        if (!amount || amount < 1 || amount > 1000) {
            Utils.showToast('Lütfen 1-1000 arası geçerli bir miktar giriniz!');
            return;
        }
        
        Modal.hide();
        State.setLoading(true);
        
        try {
            const result = await API.addPrayerLimitsToAll(amount);
            
            if (result && result.success) {
                Utils.showToast(`${result.message} 🎉`);
                await App.loadUsers();
            } else {
                Utils.showToast(result?.message || 'Dua hakkı eklenemedi!');
            }
        } catch (error) {
            console.error('Add prayer limits to all error:', error);
            Utils.showToast('Bir hata oluştu!');
        } finally {
            State.setLoading(false);
        }
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