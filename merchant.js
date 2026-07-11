// Get merchant ID from URL
const urlParams = new URLSearchParams(window.location.search);
const merchantId = urlParams.get('merchantId');

// If no merchant ID, show error
if (!merchantId) {
    document.querySelector('.container').innerHTML = `
        <div style="text-align: center; padding: 50px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
            <h2>Access Denied</h2>
            <p style="color: #64748b;">No merchant ID provided. Please use the link from your onboarding team.</p>
            <button onclick="window.location.href='index.html'" style="margin-top: 20px; width: auto; padding: 12px 30px; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer;">
                Go to Form
            </button>
        </div>
    `;
    throw new Error('No merchant ID provided');
}

// DOM Elements
const merchantNameDisplay = document.getElementById('merchantNameDisplay');
const statusBadge = document.getElementById('statusBadge');
const progressPercentage = document.getElementById('progressPercentage');
const checklistContainer = document.getElementById('checklistContainer');
const messagesList = document.getElementById('messagesList');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

// Display elements
const displayCompany = document.getElementById('displayCompany');
const displayBusiness = document.getElementById('displayBusiness');
const displayPIC = document.getElementById('displayPIC');
const displayPhone = document.getElementById('displayPhone');
// EMAIL REMOVED
const displayPackage = document.getElementById('displayPackage');
// POS QUANTITY REMOVED

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

function getMessages() {
    const storedMessages = localStorage.getItem(`messages_${merchantId}`);
    if (storedMessages) {
        return JSON.parse(storedMessages);
    }
    return [];
}

function saveMessages(messages) {
    localStorage.setItem(`messages_${merchantId}`, JSON.stringify(messages));
}

// Render merchant details
function renderMerchantInfo() {
    const merchant = getMerchantData();
    
    if (!merchant) {
        merchantNameDisplay.textContent = 'Merchant Not Found';
        return;
    }
    
    merchantNameDisplay.textContent = merchant.companyName || merchant.businessName || 'Merchant';
    displayCompany.textContent = merchant.companyName || '-';
    displayBusiness.textContent = merchant.businessName || '-';
    displayPIC.textContent = merchant.picName || '-';
    displayPhone.textContent = merchant.phone || '-';
    // EMAIL REMOVED
    displayPackage.textContent = merchant.package || '-';
    // POS QUANTITY REMOVED
}

// Render checklist
function renderChecklist() {
    const tasks = getTasks();
    
    if (tasks.length === 0) {
        checklistContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #94a3b8;">
                <div style="font-size: 32px; margin-bottom: 10px;">📝</div>
                <p>No tasks assigned yet</p>
            </div>
        `;
        return;
    }
    
    // Only show tasks visible to merchant
    const visibleTasks = tasks.filter(task => task.visibleToMerchant !== false);
    const completedTasks = visibleTasks.filter(task => task.completed).length;
    const totalTasks = visibleTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update progress
    progressPercentage.textContent = `${progress}%`;
    
    // Update status badge
    if (progress === 100) {
        statusBadge.className = 'status-badge completed';
        statusBadge.textContent = '✅ Completed!';
    } else if (progress > 50) {
        statusBadge.className = 'status-badge in-progress';
        statusBadge.textContent = '🚀 Almost There';
    } else if (progress > 0) {
        statusBadge.className = 'status-badge in-progress';
        statusBadge.textContent = '⏳ In Progress';
    } else {
        statusBadge.className = 'status-badge in-progress';
        statusBadge.textContent = '📋 Not Started';
    }
    
    let html = '';
    visibleTasks.forEach((task, index) => {
        const isCompleted = task.completed;
        html += `
            <div class="task-item ${isCompleted ? 'completed' : ''}">
                <span class="task-icon">${isCompleted ? '✅' : '⬜'}</span>
                <span class="task-title ${isCompleted ? 'completed' : ''}">${task.title}</span>
                <span class="task-owner-tag">${task.owner === 'merchant' ? '👤 You' : '👥 Team'}</span>
                ${isCompleted ? '<span style="color: #059669; font-size: 12px; margin-left: 8px;">Done</span>' : ''}
            </div>
        `;
    });
    
    checklistContainer.innerHTML = html;
}

// Render messages
function renderMessages() {
    const messages = getMessages();
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #94a3b8;">
                <div style="font-size: 32px; margin-bottom: 10px;">💬</div>
                <p>No messages yet. Start a conversation!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    messages.forEach(msg => {
        let senderClass = 'system';
        let senderName = msg.sender;
        
        if (msg.sender === 'Merchant') {
            senderClass = 'merchant';
        } else if (msg.sender === 'Onboarding Team' || msg.sender === 'Onboarding') {
            senderClass = 'onboarding';
            senderName = 'Support Team';
        } else {
            senderClass = 'system';
        }
        
        html += `
            <div class="chat-message ${senderClass}">
                <div class="message-bubble">
                    <span class="message-sender">${senderName}</span>
                    ${msg.text}
                    <span class="message-time">${new Date(msg.timestamp).toLocaleString()}</span>
                </div>
            </div>
        `;
    });
    
    messagesList.innerHTML = html;
    
    // Scroll to bottom
    const container = document.getElementById('messagesContainer');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// Handle chat submission
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    
    const messages = getMessages();
    messages.push({
        sender: 'Merchant',
        text: message,
        timestamp: new Date().toISOString()
    });
    saveMessages(messages);
    chatInput.value = '';
    renderMessages();
});

// Helper function for navigation
function getMerchantId() {
    return merchantId;
}

// Expose globally for onclick
window.getMerchantId = getMerchantId;

// Initialize page
renderMerchantInfo();
renderChecklist();
renderMessages();

// Auto-refresh messages every 15 seconds
setInterval(() => {
    renderMessages();
}, 15000);

// Auto-refresh checklist every 30 seconds
setInterval(() => {
    renderChecklist();
}, 30000);

console.log('✅ Merchant page loaded for ID:', merchantId);
