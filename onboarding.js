// Get merchant ID from URL
const urlParams = new URLSearchParams(window.location.search);
const merchantId = urlParams.get('merchantId');

// If no merchant ID, show error
if (!merchantId) {
    document.getElementById('merchantInfo').innerHTML = '<p style="color: red;">❌ No merchant selected. Please go back and submit a form.</p>';
    throw new Error('No merchant ID provided');
}

// DOM Elements
const merchantInfo = document.getElementById('merchantInfo');
const taskList = document.getElementById('taskList');
const messagesDiv = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

// Function to get merchant data
function getMerchantData() {
    const storedData = localStorage.getItem(`merchant_${merchantId}`);
    if (storedData) {
        return JSON.parse(storedData);
    }
    return null;
}

// Function to get tasks
function getTasks() {
    const storedTasks = localStorage.getItem(`tasks_${merchantId}`);
    if (storedTasks) {
        return JSON.parse(storedTasks);
    }
    return [];
}

// Function to get messages
function getMessages() {
    const storedMessages = localStorage.getItem(`messages_${merchantId}`);
    if (storedMessages) {
        return JSON.parse(storedMessages);
    }
    return [];
}

// Function to save messages
function saveMessages(messages) {
    localStorage.setItem(`messages_${merchantId}`, JSON.stringify(messages));
}

// Render merchant details
function renderMerchantDetails() {
    const merchant = getMerchantData();
    
    if (!merchant) {
        merchantInfo.innerHTML = '<p style="color: red;">❌ Merchant not found</p>';
        return;
    }
    
    merchantInfo.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <p><strong>Company Name:</strong> ${merchant.companyName}</p>
                <p><strong>Business Name:</strong> ${merchant.businessName}</p>
                <p><strong>Address:</strong> ${merchant.address}</p>
            </div>
            <div>
                <p><strong>PIC:</strong> ${merchant.picName}</p>
                <p><strong>Phone:</strong> ${merchant.phone}</p>
                <p><strong>Email:</strong> ${merchant.email}</p>
                <p><strong>Package:</strong> ${merchant.package}</p>
                <p><strong>POS Qty:</strong> ${merchant.posQty}</p>
            </div>
        </div>
        ${merchant.notes && merchant.notes !== 'None' ? `<p><strong>Special Requirements:</strong> ${merchant.notes}</p>` : ''}
        <div style="margin-top: 10px;">
            <span style="background: #2563eb; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px;">
                Status: In Progress
            </span>
        </div>
    `;
}

// Render tasks
function renderTasks() {
    const tasks = getTasks();
    if (tasks.length === 0) {
        taskList.innerHTML = '<p>No tasks available</p>';
        return;
    }
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Progress: ${completedTasks}/${totalTasks} tasks completed</span>
                <span>${progress}%</span>
            </div>
            <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #2563eb; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;
    
    tasks.forEach(task => {
        const ownerLabel = task.owner === 'merchant' ? '👤 Merchant' : '👥 Onboarding';
        html += `
            <div style="display: flex; align-items: center; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <input type="checkbox" 
                       data-task-id="${task.id}" 
                       ${task.completed ? 'checked' : ''} 
                       style="margin-right: 15px; width: 20px; height: 20px; cursor: pointer;">
                <span style="flex: 1; ${task.completed ? 'text-decoration: line-through; color: #94a3b8;' : ''}">
                    ${task.title}
                </span>
                <span style="font-size: 12px; color: #64748b; background: #e2e8f0; padding: 4px 10px; border-radius: 12px;">
                    ${ownerLabel}
                </span>
                ${task.visibleToMerchant ? '<span style="font-size: 12px; color: #059669; margin-left: 8px;">👁️</span>' : ''}
            </div>
        `;
    });
    
    html += `</div>`;
    taskList.innerHTML = html;
    
    // Add event listeners to checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = parseInt(this.dataset.taskId);
            const tasks = getTasks();
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = this.checked;
                localStorage.setItem(`tasks_${merchantId}`, JSON.stringify(tasks));
                renderTasks();
            }
        });
    });
}

// Render messages
function renderMessages() {
    const messages = getMessages();
    
    if (messages.length === 0) {
        messagesDiv.innerHTML = '<p style="color: #94a3b8;">No messages yet. Start the conversation!</p>';
        return;
    }
    
    let html = '';
    messages.forEach(msg => {
        const isMerchant = msg.sender === 'Merchant';
        const isSystem = msg.sender === 'System';
        html += `
            <div style="display: flex; margin-bottom: 10px; ${isMerchant ? 'justify-content: flex-start;' : 'justify-content: flex-end;'}">
                <div style="
                    max-width: 70%; 
                    padding: 12px 16px; 
                    border-radius: 12px; 
                    ${isSystem ? 'background: #fef3c7; color: #92400e;' : 
                      isMerchant ? 'background: #f1f5f9;' : 
                      'background: #2563eb; color: white;'}
                ">
                    <strong style="font-size: 12px;">${msg.sender}</strong>
                    <div>${msg.text}</div>
                    <div style="font-size: 10px; margin-top: 4px; opacity: 0.7;">
                        ${new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                </div>
            </div>
        `;
    });
    messagesDiv.innerHTML = html;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle chat form submission
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
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
});

// Helper function to get merchant ID for navigation
function getMerchantId() {
    return merchantId;
}

// Expose function globally for button onclick
window.getMerchantId = getMerchantId;

// Initialize the page
renderMerchantDetails();
renderTasks();
renderMessages();

// Auto-refresh messages every 30 seconds (for demo)
setInterval(() => {
    renderMessages();
}, 30000);
