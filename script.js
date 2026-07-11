document.getElementById("merchantForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    console.log("🔵 Form submitted!");
    
    // Get all form values (POS quantity removed)
    const companyName = document.getElementById("companyName").value;
    const businessName = document.getElementById("businessName").value;
    const address = document.getElementById("address").value;
    const picName = document.getElementById("picName").value;
    const phone = document.getElementById("phone").value;
    const packageVal = document.getElementById("package").value;
    const notes = document.getElementById("notes").value;
    
    console.log("📝 Form Values:", {
        companyName, businessName, address, picName, phone, packageVal, notes
    });

    const merchant = {
        companyName: companyName || "Not provided",
        businessName: businessName || companyName || "Not provided",
        address: address || "Not provided",
        picName: picName || "Not provided",
        phone: phone || "Not provided",
        package: packageVal || "Standard",
        // POS QUANTITY REMOVED
        notes: notes || "None"
    };

    console.log("📦 Merchant Object:", merchant);

    // Generate merchant ID
    const merchantId = 'merchant_' + Date.now();
    console.log("🆔 Merchant ID:", merchantId);

    // Save data
    localStorage.setItem(`merchant_${merchantId}`, JSON.stringify(merchant));
    console.log("💾 Data saved to localStorage");

    // Create tasks
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

    // Create welcome message
    const welcomeMessage = {
        sender: 'System',
        text: `🎉 Welcome! Merchant "${merchant.companyName}" has been onboarded.`,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(`messages_${merchantId}`, JSON.stringify([welcomeMessage]));

    // Show success
    alert(`✅ Merchant "${merchant.companyName}" has been successfully registered!`);

    // Redirect
    console.log("🔄 Redirecting to:", `onboarding.html?merchantId=${merchantId}`);
    window.location.href = `onboarding.html?merchantId=${merchantId}`;
});
