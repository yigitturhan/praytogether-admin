// State Management
const State = {
    // Current state
    data: {
        activeTab: 'dashboard',
        loading: false,
        dashboard: null,
        users: [],
        prayers: [],
        reports: [],
        deleteModal: {
            show: false,
            type: null,
            id: null,
            name: null
        }
    },

    // Listeners
    listeners: [],

    // Get state
    get() {
        return this.data;
    },

    // Set state
    set(updates) {
        this.data = { ...this.data, ...updates };
        this.notify();
    },

    // Update nested state
    update(key, value) {
        this.data[key] = value;
        this.notify();
    },

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
    },

    // Notify all listeners
    notify() {
        this.listeners.forEach(listener => listener(this.data));
    },

    // Show delete modal
    showDeleteModal(type, id, name) {
        this.set({
            deleteModal: {
                show: true,
                type,
                id,
                name
            }
        });
    },

    // Hide delete modal
    hideDeleteModal() {
        this.set({
            deleteModal: {
                show: false,
                type: null,
                id: null,
                name: null
            }
        });
    },

    // Set loading state
    setLoading(loading) {
        this.set({ loading });
    },

    // Set active tab
    setActiveTab(tab) {
        this.set({ activeTab: tab });
    },

    // Set dashboard data
    setDashboard(dashboard) {
        this.update('dashboard', dashboard);
    },

    // Set users
    setUsers(users) {
        this.update('users', users);
    },

    // Set prayers
    setPrayers(prayers) {
        this.update('prayers', prayers);
    },

    // Set reports
    setReports(reports) {
        this.update('reports', reports);
    }
};

// Export for use in other modules
window.State = State;