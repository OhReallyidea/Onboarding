document.getElementById("merchantForm").addEventListener("submit", function(e){

    e.preventDefault();

    const merchant = {

        companyName: document.getElementById("companyName").value,

        ssmNumber: document.getElementById("ssmNumber").value,

        businessName: document.getElementById("businessName").value,

        address: document.getElementById("address").value,

        picName: document.getElementById("picName").value,

        phone: document.getElementById("phone").value,

        email: document.getElementById("email").value,

        package: document.getElementById("package").value,

        posQty: document.getElementById("posQty").value,

        notes: document.getElementById("notes").value

    };

    console.log(merchant);

    alert("Merchant information submitted successfully!");

    document.getElementById("merchantForm").reset();

});
