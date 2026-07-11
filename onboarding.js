// Get merchant ID from URL
const urlParams = new URLSearchParams(window.location.search);
const merchantId = urlParams.get('merchantId');

// If no merchant ID, show error
if (!merchantId) {
    document.querySelector('.container').innerHTML = `
        <div style="text-align: center; padding: 50px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
            <h2>Access Denied</h2>
            <p style="color: #64748b;">No merchant ID provided. Please go back and submit a form.</p>
            <button onclick="window.location.href='index.html'" style="margin-top: 20px; padding: 12px 30px; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer;">
                Go to Form
            </button>
        </div>
    `;
    throw new Error('No merchant ID provided');
}

// DOM Elements
const merchantInfo = document.getElementById('merchantInfo');
const taskList = document.getElementById('taskList');

// Helper functions
function getMerchantData() {
    const storedData = localStorage.getItem(`merchant_${merchantId}`);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return null;
}

function getTasks() {
    const storedTasks = localStorage.getItem(`tasks_${merchantId}`);
    if (storedTasks) {
        return JSON.parse(storedTasks);
    }
    return [];
}

function saveTasks(tasks) {
    localStorage.setItem(`tasks_${merchantId}`, JSON.stringify(tasks));
}

// Render merchant details
function renderMerchantDetails() {
    const merchant = getMerchantData();
    
    if (!merchant) {
        merchantInfo.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #ef4444;">
                <p>❌ Merchant not found</p>
            </div>
        `;
        return;
    }
    
    // Calculate progress for status
    const tasks = getTasks();
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    let statusText = 'In Progress';
    let statusClass = 'in-progress';
    if (progress === 100 && totalTasks > 0) {
        statusText = '✅ Completed';
        statusClass = 'completed';
    } else if (progress === 0) {
        statusText = '⏳ Not Started';
        statusClass = 'pending';
    }
    
    merchantInfo.innerHTML = `
        <div class="merchant-info-grid">
            <div class="info-item">
                <span class="info-label">Company Name</span>
                <span class="info-value">${merchant.companyName || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Business Name</span>
                <span class="info-value">${merchant.businessName || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address</span>
                <span class="info-value">${merchant.address || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">PIC Name</span>
                <span class="info-value">${merchant.picName || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Phone</span>
                <span class="info-value">${merchant.phone || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Package</span>
                <span class="info-value">${merchant.package || '-'}</span>
            </div>
        </div>
        ${merchant.notes && merchant.notes !== 'None' ? `<p style="margin-top: 12px;"><strong>Special Requirements:</strong> ${merchant.notes}</p>` : ''}
        <div style="margin-top: 15px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <span style="font-size: 14px; color: #64748b;">Progress: ${progress}% complete</span>
        </div>
    `;
}

// Render tasks
function renderTasks() {
    const tasks = getTasks();
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📝</div>
                <p>No tasks assigned yet</p>
            </div>
        `;
        return;
    }
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 14px; color: #64748b;">${completedTasks} of ${totalTasks} tasks completed</span>
                <span style="font-weight: 600; color: #1e3a8a;">${progress}%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progress}%;"></div>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;
    
    tasks.forEach(task => {
        const ownerLabel = task.owner === 'merchant' ? '👤 Merchant' : '👥 Onboarding';
        const isCompleted = task.completed;
        html += `
            <div class="task-item ${isCompleted ? 'completed' : ''}">
                <input type="checkbox" 
                       data-task-id="${task.id}" 
                       ${isCompleted ? 'checked' : ''} 
                       class="task-checkbox">
                <span class="task-title ${isCompleted ? 'completed' : ''}">${task.title}</span>
                <span class="task-owner-tag">${ownerLabel}</span>
                ${task.visibleToMerchant ? '<span class="task-visibility">👁️</span>' : '<span style="font-size: 11px; color: #94a3b8;">🔒 Internal</span>'}
            </div>
        `;
    });
    
    html += `</div>`;
    taskList.innerHTML = html;
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = parseInt(this.dataset.taskId);
            const tasks = getTasks();
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = this.checked;
                saveTasks(tasks);
                
                // Re-render everything to update progress
                renderTasks();
                renderMerchantDetails();
            }
        });
    });
}

// Helper function for navigation
function getMerchantId() {
    return merchantId;
}

// Expose globally for onclick
window.getMerchantId = getMerchantId;

// Initialize page
renderMerchantDetails();
renderTasks();

// Auto-refresh tasks and details every 30 seconds
setInterval(() => {
    renderTasks();
    renderMerchantDetails();
}, 30000);

console.log('✅ Onboarding dashboard loaded for merchant ID:', merchantId);
console.log('💬 Chat button will open chat.html?merchantId=' + merchantId);
