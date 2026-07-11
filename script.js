document.getElementById("merchantForm").addEventListener("submit", function(e){
    e.preventDefault();

    const merchant = {
        companyName: document.getElementById("companyName").value,
        businessName: document.getElementById("businessName").value || document.getElementById("companyName").value,
        address: document.getElementById("address").value,
        picName: document.getElementById("picName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value || "Not provided",
        package: document.getElementById("package").value,
        posQty: document.getElementById("posQty").value || "1",
        notes: document.getElementById("notes").value || "None"
    };

    // Generate a unique merchant ID
    const merchantId = 'merchant_' + Date.now();

    // Save merchant data
    localStorage.setItem(`merchant_${merchantId}`, JSON.stringify(merchant));

    // Create default tasks
    const defaultTasks = [
        { id: 1, title: 'Submit company registration document', owner: 'merchant', completed: false, visibleToMerchant: true },
        { id: 2, title: 'Submit bank account details', owner: 'merchant', completed: false, visibleToMerchant: true },
        { id: 3, title: 'Verify business information', owner: 'onboarding', completed: false, visibleToMerchant: false },
        { id: 4, title: 'Configure payment account', owner: 'onboarding', completed: false, visibleToMerchant: false },
        { id: 5, title: 'Prepare and send contract', owner: 'onboarding', completed: false, visibleToMerchant: true },
        { id: 6, title: 'Complete internal risk review', owner: 'onboarding', completed: false, visibleToMerchant: false },
        { id: 7, title: 'Send integration guide', owner: 'onboarding', completed: false, visibleToMerchant: true },
        { id: 8, title: 'Confirm go-live date', owner: 'merchant', completed: false, visibleToMerchant: true }
    ];
    localStorage.setItem(`tasks_${merchantId}`, JSON.stringify(defaultTasks));

    // Create initial welcome message
    const welcomeMessage = {
        sender: 'System',
        text: `Merchant "${merchant.companyName}" has been onboarded. Welcome to the platform!`,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(`messages_${merchantId}`, JSON.stringify([welcomeMessage]));

    console.log('✅ Merchant saved:', merchant);
    console.log('🆔 Merchant ID:', merchantId);

    // Redirect to onboarding page
    window.location.href = `onboarding.html?merchantId=${merchantId}`;
});
