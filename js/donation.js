// Donation Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const donationForm = document.getElementById('donationForm');
    const amountInput = document.getElementById('amount');
    const amountButtons = document.querySelectorAll('.amount-btn');
    
    // Amount button selection
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            amountButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            amountInput.value = this.dataset.amount;
        });
    });
    
    // Custom amount input
    amountInput.addEventListener('input', function() {
        amountButtons.forEach(b => b.classList.remove('active'));
        if (this.value < 100) {
            this.setCustomValidity('Minimum donation amount is ₹100');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Form submission
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                donationType: formData.get('donationType'),
                donationPurpose: formData.get('donationPurpose'),
                amount: parseFloat(formData.get('amount')),
                donorName: formData.get('donorName'),
                donorEmail: formData.get('donorEmail'),
                donorPhone: formData.get('donorPhone'),
                donorAddress: formData.get('donorAddress'),
                anonymous: formData.get('anonymous') === 'on',
                taxReceipt: formData.get('taxReceipt') === 'on'
            };
            
            // Validation
            if (!data.amount || data.amount < 100) {
                alert('Please enter a valid donation amount (minimum ₹100)');
                return;
            }
            
            if (!data.donationPurpose) {
                alert('Please select a donation purpose');
                return;
            }
            
            // Initialize Razorpay payment
            initiateRazorpayPayment(data);
        });
    }
});

// Razorpay Payment Integration
function initiateRazorpayPayment(donationData) {
    // Note: Replace with your actual Razorpay Key ID
    const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; // Get from Razorpay Dashboard
    
    // Create order on your backend first (for security)
    // For now, this is a frontend example - you MUST implement backend order creation
    
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: donationData.amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Sathya Unar Charitable Trust',
        description: `Donation for ${donationData.donationPurpose}`,
        image: '/logo.png', // Your logo URL
        handler: function(response) {
            // Payment successful
            handlePaymentSuccess(response, donationData);
        },
        prefill: {
            name: donationData.donorName,
            email: donationData.donorEmail,
            contact: donationData.donorPhone
        },
        notes: {
            donationType: donationData.donationType,
            donationPurpose: donationData.donationPurpose,
            anonymous: donationData.anonymous,
            taxReceipt: donationData.taxReceipt
        },
        theme: {
            color: '#1e3a8a'
        },
        modal: {
            ondismiss: function() {
                console.log('Payment cancelled');
            }
        }
    };
    
    // IMPORTANT: In production, create order on backend first
    // This is just for demonstration
    const razorpay = new Razorpay(options);
    
    // For production, you should:
    // 1. Send donationData to your backend
    // 2. Backend creates Razorpay order
    // 3. Backend returns order_id
    // 4. Use order_id in options: order_id: 'order_xxx'
    
    razorpay.open();
}

// Handle successful payment
function handlePaymentSuccess(response, donationData) {
    // Send payment details to backend
    const paymentData = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        ...donationData
    };
    
    // In production, send this to your backend to verify and save
    console.log('Payment successful:', paymentData);
    
    // Show success message
    showPaymentSuccess(paymentData);
    
    // Send email receipt (handled by backend)
    // Backend should:
    // 1. Verify payment signature
    // 2. Save donation to database
    // 3. Send email receipt if taxReceipt is true
}

// Show payment success message
function showPaymentSuccess(paymentData) {
    const successHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; color: #25D366; margin-bottom: 1rem;">✓</div>
            <h2 style="color: var(--primary-blue); margin-bottom: 1rem;">Thank You!</h2>
            <p style="font-size: 1.125rem; margin-bottom: 1rem;">Your donation of ₹${paymentData.amount} has been received successfully.</p>
            <p style="color: var(--gray); margin-bottom: 2rem;">Payment ID: ${paymentData.razorpay_payment_id}</p>
            ${paymentData.taxReceipt ? '<p style="color: var(--gold); font-weight: 600;">Tax receipt will be sent to your email shortly.</p>' : ''}
            <div style="margin-top: 2rem;">
                <a href="index.html" class="btn btn-primary">Return to Home</a>
            </div>
        </div>
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'payment-success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    content.innerHTML = successHTML;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 10000);
}

// Backend Integration Helper (for reference)
async function createRazorpayOrder(donationData) {
    // This should be called from your backend
    // Example endpoint: POST /api/create-order
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(donationData)
        });
        
        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Error processing donation. Please try again.');
    }
}
