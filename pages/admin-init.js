// ============================================
// ADMIN PAGE INITIALIZATION FIX
// ============================================

// This file contains the initialization code that was causing template literal errors
// in admin.js. Include this AFTER admin.js

// Wait for admin.js module to load and export functions
function waitForAdminFunctions() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (window.updateBookingStatus && window.refreshBookings) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 10);
    });
}

// Wait for DOM to be ready and admin functions to be available
async function initWhenReady() {
    if (document.readyState === 'loading') {
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
    }
    await waitForAdminFunctions();
    initAdmin();
}

initWhenReady();

function initAdmin() {
    console.log('✅ Admin initialization fixed and running');
    
    // Add essential CSS
    const style = document.createElement('style');
    style.textContent = `
        .local-badge {
            background: #ffc107;
            color: #000;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);

    // Set up edit form
    if (typeof setupEditForm === 'function') {
        setupEditForm();
    }

    // Set admin name
    const adminName = sessionStorage.getItem('adminEmail') || 'Admin User';
    const adminUserSpan = document.querySelector('.admin-user span');
    if (adminUserSpan) {
        adminUserSpan.textContent = adminName;
    }

    // Set up filter listeners
    const dateFilter = document.getElementById('dateFilter');
    const statusFilter = document.getElementById('statusFilter');
    const activityFilter = document.getElementById('activityFilter');
    const searchInput = document.getElementById('searchInput');

    if (dateFilter) {
        dateFilter.addEventListener('change', () => filterBookings());
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', () => filterBookings());
    }

    if (activityFilter) {
        activityFilter.addEventListener('change', () => filterBookings());
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => filterBookings());
    }

    // Set up refresh button
    const refreshBtn = document.querySelector('.btn-refresh, .filter-btn.primary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => refreshBookings());
    }

    // Set up export button  
    const exportBtn = document.querySelector('.btn-export, .filter-btn.secondary');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => exportToCSV());
    }

    // Initialize and load bookings
    console.log('📊 Initializing bookings from storage...');
    if (typeof initializeBookingsFromStorage === 'function') {
        initializeBookingsFromStorage();
    } else {
        console.error('❌ initializeBookingsFromStorage not found');
    }

    // Close edit modal when clicking outside
    window.onclick = function (event) {
        const editModal = document.getElementById('editModal');
        if (event.target === editModal) {
            closeEditModal();
        }
    };

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const editModal = document.getElementById('editModal');
            if (editModal && editModal.style.display === 'flex') {
                closeEditModal();
            }
        }
    });

    console.log('✅ Admin page fully initialized');
}
