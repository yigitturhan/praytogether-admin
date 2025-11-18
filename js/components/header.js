// Header Component
const Header = {
    render() {
        const state = State.get();
        
        return `
            <div class="bg-white shadow">
                <div class="container">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center space-x-3">
                            <div class="bg-purple-600 p-2 rounded-lg text-white">
                                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-2xl font-bold text-gray-900">PrayTogether Admin</h1>
                                <p class="text-sm text-gray-600">Yönetim Paneli</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <button
                                onclick="App.refreshData()"
                                ${state.loading ? 'disabled' : ''}
                                class="p-2 text-gray-600 transition"
                                style="background: none;"
                                title="Verileri Yenile"
                            >
                                <svg class="icon ${state.loading ? 'animate-spin' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                            </button>
                            <button
                                onclick="Auth.logout()"
                                class="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg transition"
                            >
                                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                                <span>Çıkış</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
window.Header = Header;