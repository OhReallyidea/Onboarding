// Get merchant ID from URL
const urlParams = new URLSearchParams(window.location.search);
const merchantId = urlParams.get('merchantId');

// If no merchant ID, show error
if (!merchantId) {
    document.querySelector('.chat-wrapper').innerHTML = `
        <div style="text-align: center; padding: 50px 20px; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
            <h2>Access Denied</h2>
            <p style="color: #64748b;">No merchant selected. Please go back to the dashboard.</p>
            <button onclick="window.location.href='onboarding.html'" style="margin-top: 20px; padding: 12px 30px; background: #2563eb; color: white; border: none; border-radius: 10px; cursor: pointer;">
                Go to Dashboard
            </button>
        </div>
    `;
    throw new Error('No merchant ID provided');
}

// Update navigation links with merchant ID
document.getElementById('backToDashboardBtn').href = `onboarding.html?merchantId=${merchantId}`;
document.getElementById('backToMerchantBtn').href = `merchant.html?merchantId=${merchantId}`;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatMessageInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMerchantName = document.getElementById('chatMerchantName');
const chatMerchantStatus = document.getElementById('chatMerchantStatus');

// Helper functions
function getMerchantData() {
    const storedData = localStorage.getItem(`merchant_${merchantId}`);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return null;
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

function getTasks() {
    const storedTasks = localStorage.getItem(`tasks_${merchantId}`);
    if (storedTasks) {
        return JSON.parse(storedTasks);
    }
    return [];
}

// Format date
function formatDate(date) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Render messages
function renderMessages() {
    const messages = getMessages();
    const merchant = getMerchantData();
    
    if (merchant) {
        chatMerchantName.textContent = merchant.companyName || merchant.businessName || 'Merchant';
    }
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-state">
                <div class="icon">💬</div>
                <h3>No messages yet</h3>
                <p>Start the conversation with the merchant</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    let lastDate = '';
    
    messages.forEach(msg => {
        const msgDate = new Date(msg.timestamp);
        const dateStr = formatDate(msg.timestamp);
        
        // Add date divider
        if (dateStr !== lastDate) {
            html += `
                <div class="date-divider">
                    <span>${dateStr}</span>
                </div>
            `;
            lastDate = dateStr;
        }
        
        let senderClass = 'system';
        let senderName = msg.sender;
        
        if (msg.sender === 'Merchant') {
            senderClass = 'merchant';
            senderName = '👤 Merchant';
        } else if (msg.sender === 'Onboarding Team' || msg.sender === 'Onboarding') {
            senderClass = 'onboarding';
            senderName = '👥 Support Team';
        } else if (msg.sender === 'System') {
            senderClass = 'system';
            senderName = '📢 System';
        } else {
            senderClass = 'system';
        }
        
        // Format time
        const timeStr = msgDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        html += `
            <div class="message-wrapper ${senderClass}">
                <div class="message-bubble">
                    <span class="message-sender">${senderName}</span>
                    <div class="message-text">${msg.text}</div>
                    <span class="message-time">${timeStr}</span>
                </div>
            </div>
        `;
    });
    
    chatMessages.innerHTML = html;
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const messages = getMessages();
    messages.push({
        sender: 'Onboarding Team',
        text: message,
        timestamp: new Date().toISOString()
    });
    saveMessages(messages);
    chatInput.value = '';
    renderMessages();
}

// Event listeners
chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-refresh messages every 10 seconds
setInterval(() => {
    renderMessages();
}, 10000);

// Initialize
renderMessages();

console.log('✅ Chat page loaded for merchant ID:', merchantId);
