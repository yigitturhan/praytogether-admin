// Modal Component
const Modal = {
    customModalHtml: '',
    isCustomModalOpen: false,

    render() {
        const state = State.get();
        const modal = state.deleteModal;
        
        // Custom modal (for prayer limits)
        if (this.isCustomModalOpen) {
            return `
                <div class="modal" onclick="Modal.handleCustomBackdropClick(event)">
                    <div class="modal-content">
                        ${this.customModalHtml}
                    </div>
                </div>
            `;
        }
        
        // Delete modal
        if (!modal.show) {
            return '';
        }

        const typeText = modal.type === 'user' ? 'kullanıcıyı' : 
                        modal.type === 'prayer' ? 'dua isteğini' : 'öğeyi';
        
        return `
            <div class="modal" onclick="Modal.handleBackdropClick(event)">
                <div class="modal-content">
                    <div class="text-center">
                        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-4">
                            <svg class="icon text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Silme Onayı</h3>
                        <p class="text-sm text-gray-600 mb-6">
                            <strong>${Utils.escapeHtml(modal.name)}</strong> ${typeText} silmek istediğinizden emin misiniz?
                            <br><br>
                            Bu işlem geri alınamaz!
                        </p>
                        <div class="flex space-x-3 justify-center">
                            <button
                                onclick="State.hideDeleteModal()"
                                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
                            >
                                İptal
                            </button>
                            <button
                                onclick="Modal.confirmDelete()"
                                class="px-6 py-2 bg-red-600 text-white rounded-lg font-medium"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Show custom modal
    show(html) {
        this.customModalHtml = html;
        this.isCustomModalOpen = true;
        this.renderModal();
    },

    // Hide custom modal
    hide() {
        this.customModalHtml = '';
        this.isCustomModalOpen = false;
        this.renderModal();
    },

    // Render modal in the page
    renderModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = this.render();
        } else {
            // If container doesn't exist, trigger full app render
            const state = State.get();
            State.setState(state);
        }
    },

    handleBackdropClick(event) {
        if (event.target.classList.contains('modal')) {
            State.hideDeleteModal();
        }
    },

    handleCustomBackdropClick(event) {
        if (event.target.classList.contains('modal')) {
            this.hide();
        }
    },

    async confirmDelete() {
        const state = State.get();
        const modal = state.deleteModal;
        
        State.setLoading(true);
        
        try {
            let result;
            
            if (modal.type === 'user') {
                result = await API.deleteUser(modal.id);
            } else if (modal.type === 'prayer') {
                result = await API.deletePrayer(modal.id);
            }
            
            if (result && result.success) {
                Utils.showToast('Başarıyla silindi!');
                State.hideDeleteModal();
                
                // Refresh the current tab data
                if (modal.type === 'user') {
                    await App.loadUsers();
                } else if (modal.type === 'prayer') {
                    await App.loadPrayers();
                }
            } else {
                Utils.showToast(result?.message || 'Silme işlemi başarısız!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            Utils.showToast('Bir hata oluştu!');
        } finally {
            State.setLoading(false);
        }
    }
};

// Export for use in other modules
window.Modal = Modal;