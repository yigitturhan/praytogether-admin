// Tabs Component
const Tabs = {
    render() {
        const state = State.get();
        
        return `
            <div class="bg-white border-b">
                <div class="container">
                    <div class="flex" style="gap: 2rem;">
                        <button 
                            onclick="State.setActiveTab('dashboard')" 
                            class="tab ${state.activeTab === 'dashboard' ? 'active' : ''}"
                        >
                            📊 Dashboard
                        </button>
                        <button 
                            onclick="State.setActiveTab('users')" 
                            class="tab ${state.activeTab === 'users' ? 'active' : ''}"
                        >
                            👥 Kullanıcılar
                        </button>
                        <button 
                            onclick="State.setActiveTab('prayers')" 
                            class="tab ${state.activeTab === 'prayers' ? 'active' : ''}"
                        >
                            🙏 Dua İstekleri
                        </button>
                        <button 
                            onclick="State.setActiveTab('reports')" 
                            class="tab ${state.activeTab === 'reports' ? 'active' : ''}"
                        >
                            🚨 Şikayetler
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

// Export for use in other modules
window.Tabs = Tabs;