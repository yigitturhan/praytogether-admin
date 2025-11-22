// Notifications Page
const NotificationsPage = {
    render() {
        const state = State.get();
        
        return `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow p-8">
                    <div class="text-center mb-8">
                        <div class="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="icon text-purple-600" style="width: 2.5rem; height: 2.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Push Bildirim Gönder</h2>
                        <p class="text-gray-600">Tüm aktif kullanıcılara bildirim gönderin</p>
                    </div>

                    <form id="notificationForm" class="space-y-6">
                        <div>
                            <label for="notificationTitle" class="text-sm font-medium text-gray-700 mb-2" style="display: block;">
                                Bildirim Başlığı
                            </label>
                            <input
                                type="text"
                                id="notificationTitle"
                                placeholder="Örn: Dua İle"
                                value="Dua İle"
                                class="w-full px-4 py-3 rounded-lg"
                                maxlength="50"
                            >
                            <p class="text-xs text-gray-500 mt-1">Boş bırakırsanız "Dua İle" kullanılır</p>
                        </div>

                        <div>
                            <label for="notificationMessage" class="text-sm font-medium text-gray-700 mb-2" style="display: block;">
                                Bildirim Mesajı *
                            </label>
                            <textarea
                                id="notificationMessage"
                                rows="5"
                                placeholder="Kullanıcılara göndermek istediğiniz mesajı yazın..."
                                class="w-full px-4 py-3 rounded-lg"
                                maxlength="500"
                                required
                            ></textarea>
                            <div class="flex justify-between mt-1">
                                <p class="text-xs text-gray-500">Maksimum 500 karakter</p>
                                <p class="text-xs text-gray-500">
                                    <span id="charCount">0</span>/500
                                </p>
                            </div>
                        </div>

                        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <div class="flex">
                                <svg class="icon text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                    <p class="text-sm text-blue-700 font-medium">Bilgi</p>
                                    <p class="text-sm text-blue-600 mt-1">
                                        Bu bildirim FCM token'ı olan tüm aktif kullanıcılara gönderilecektir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div id="notificationError" class="hidden p-3 bg-red-100 text-red-700 rounded-lg text-sm"></div>
                        <div id="notificationSuccess" class="hidden p-3 bg-green-100 text-green-700 rounded-lg text-sm"></div>

                        <button
                            type="submit"
                            id="sendNotificationBtn"
                            class="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg transition"
                            ${state.loading ? 'disabled' : ''}
                        >
                            ${state.loading ? '📤 Gönderiliyor...' : '📤 Bildirim Gönder'}
                        </button>
                    </form>

                    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-semibold text-gray-900 mb-2">💡 İpuçları</h3>
                        <ul class="text-sm text-gray-600 space-y-1" style="list-style: disc; padding-left: 1.5rem;">
                            <li>Kısa ve öz mesajlar daha etkilidir</li>
                            <li>Önemli duyurular için kullanın</li>
                            <li>Spam olarak algılanmaması için sık göndermekten kaçının</li>
                            <li>Mesajınızı göndermeden önce kontrol edin</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        // Character counter
        const messageInput = document.getElementById('notificationMessage');
        const charCount = document.getElementById('charCount');
        
        if (messageInput && charCount) {
            messageInput.addEventListener('input', (e) => {
                charCount.textContent = e.target.value.length;
            });
        }

        // Form submission
        const form = document.getElementById('notificationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    },

    async handleSubmit() {
        const title = document.getElementById('notificationTitle').value.trim();
        const message = document.getElementById('notificationMessage').value.trim();
        const errorDiv = document.getElementById('notificationError');
        const successDiv = document.getElementById('notificationSuccess');
        
        // Hide previous messages
        errorDiv.classList.add('hidden');
        successDiv.classList.add('hidden');
        
        // Validation
        if (!message) {
            this.showError('Lütfen bir mesaj girin!');
            return;
        }

        if (message.length > 500) {
            this.showError('Mesaj çok uzun! Maksimum 500 karakter olmalıdır.');
            return;
        }

        // Confirm
        if (!confirm(`Tüm kullanıcılara bu bildirimi göndermek istediğinizden emin misiniz?\n\n"${message}"`)) {
            return;
        }

        State.setLoading(true);

        try {
            const result = await API.sendNotification(title, message);
            
            if (result && result.success) {
                this.showSuccess(
                    `✅ Bildirim başarıyla gönderildi!\n\n` +
                    `📊 İstatistikler:\n` +
                    `• Toplam: ${result.stats.total_users} kullanıcı\n` +
                    `• Başarılı: ${result.stats.success_count}\n` +
                    `• Başarısız: ${result.stats.fail_count}`
                );
                
                // Clear form
                document.getElementById('notificationMessage').value = '';
                document.getElementById('charCount').textContent = '0';
            } else {
                this.showError(result?.message || 'Bildirim gönderilemedi!');
            }
        } catch (error) {
            console.error('Send notification error:', error);
            this.showError('Bağlantı hatası! Lütfen tekrar deneyin.');
        } finally {
            State.setLoading(false);
        }
    },

    showError(message) {
        const errorDiv = document.getElementById('notificationError');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    showSuccess(message) {
        const successDiv = document.getElementById('notificationSuccess');
        successDiv.textContent = message;
        successDiv.style.whiteSpace = 'pre-line';
        successDiv.classList.remove('hidden');
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

// Export for use in other modules
window.NotificationsPage = NotificationsPage;