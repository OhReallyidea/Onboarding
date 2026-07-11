document.getElementById("merchantForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get all form values with fallbacks
    const merchant = {
        companyName: document.getElementById("companyName").value || "Not provided",
        businessName: document.getElementById("businessName").value || document.getElementById("companyName").value || "Not provided",
        address: document.getElementById("address").value || "Not provided",
        picName: document.getElementById("picName").value || "Not provided",
        phone: document.getElementById("phone").value || "Not provided",
        email: document.getElementById("email").value || "Not provided",
        package: document.getElementById("package").value || "Standard",
        posQty: document.getElementById("posQty").value || "1",
        notes: document.getElementById("notes").value || "None"
    };

    // Log the data to check
    console.log("📝 Merchant Data:", merchant);

    // Generate a unique merchant ID
    const merchantId = 'merchant_' + Date.now();
    console.log("🆔 Generated Merchant ID:", merchantId);

    // Save merchant data to localStorage
    try {
        localStorage.setItem(`merchant_${merchantId}`, JSON.stringify(merchant));
        console.log("✅ Merchant data saved successfully!");
    } catch (error) {
        console.error("❌ Error saving merchant data:", error);
        alert("Error saving data. Please try again.");
        return;
    }

    // Create default onboarding tasks
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

    try {
        localStorage.setItem(`tasks_${merchantId}`, JSON.stringify(defaultTasks));
        console.log("✅ Tasks saved successfully!");
    } catch (error) {
        console.error("❌ Error saving tasks:", error);
    }

    // Create initial welcome message
    const welcomeMessage = {
        sender: 'System',
        text: `🎉 Welcome! Merchant "${merchant.companyName}" has been onboarded. The onboarding team will assist you shortly.`,
        timestamp: new Date().toISOString()
    };

    try {
        localStorage.setItem(`messages_${merchantId}`, JSON.stringify([welcomeMessage]));
        console.log("✅ Welcome message saved!");
    } catch (error) {
        console.error("❌ Error saving messages:", error);
    }

    // Show success message
    alert(`✅ Merchant "${merchant.companyName}" has been successfully registered!`);

    // Redirect to onboarding page with merchant ID
    console.log("🔄 Redirecting to onboarding page...");
    window.location.href = `onboarding.html?merchantId=${merchantId}`;
});
