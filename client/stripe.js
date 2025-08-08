const stripe = Stripe(
    "pk_test_51RpqjfLagKYI9jCot5ia1aBKLGbptRVQikDLqer6HPvLvvi0pH7lFnnCN36Ww36ScNgPusuWJywP3mWC5cnol8O400sLbfbo5w"
);

// Stripe Elements manager.
const elements = stripe.elements();

// card input fields: Card number, Expiry date, CVC
const card = elements.create("card", {
    style: {
        base: {
            fontSize: "16px",
            color: "#32325d",
        },
    },
    hidePostalCode: true, // 🔥 This hides the postal code field
});
// Stripe will inject its secure input fields into that div.
card.mount("#card-element");

const form = document.getElementById("payment-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: card,
        billing_details: {
            name: "Sora Test",
        },
    });

    if (error) {
        alert(error.message);
        return;
    }

    const token = getToken();

    // Send the paymentMethod.id to your backend
    const response = await fetch("http://localhost:8080/api/user/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });

    const result = await response.json();

    if (result.success) {
        console.log(result.data);
        alert("Card saved!");
    } else {
        alert("Error saving card.");
    }
});
