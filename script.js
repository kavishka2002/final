// Counter Animation for Stats
function animateCounters() {
    const counters = [
        { id: 'activeMembers', target: 20, duration: 2000 },
        { id: 'projectsDone', target: 10, duration: 2000 },
        { id: 'happyDonors', target: 12, duration: 2000 },
        { id: 'volunteers', target: 15, duration: 2000 }
    ];

    counters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element) { // Check if element exists
            const start = 0;
            // Ensure target is a number, even if HTML might have '20+' initially.
            // The script will overwrite this with the animation.
            const targetValue = counter.target; 
            const increment = targetValue / (counter.duration / 16); // 16ms for ~60fps
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= targetValue) {
                    clearInterval(timer);
                    current = targetValue;
                    element.textContent = Math.floor(current) + '+'; // '+' sign after the number
                } else {
                    element.textContent = Math.floor(current) + '+'; // '+' sign after the number during animation
                }
            }, 16);
        }
    });
}

// Run counter animation when About section is in view
const aboutSection = document.querySelector('.about-section');
if (aboutSection) { // Add null check for aboutSection
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.unobserve(aboutSection);
        }
    }, { threshold: 0.5 });

    observer.observe(aboutSection);
}


// DOM Elements
const openDonationModalButton = document.getElementById('openDonationModal');
const donationModal = document.getElementById('donationModal');
const closeModalButton = document.getElementById('closeModal');
const oneTimeBtn = document.getElementById('oneTimeBtn');
const monthlyBtn = document.getElementById('monthlyBtn');
const amountBtns = document.querySelectorAll('.amount-btn');
const amountDisplay = document.getElementById('amountDisplay');
const customAmount = document.getElementById('customAmount');
// const donateNowBtn = document.getElementById('donateNowBtn'); // Old button
const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn'); // New button for step 1
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn'); // New button for step 2
const backToStep1Btn = document.getElementById('backToStep1Btn');
const donationStep1 = document.getElementById('donation-step-1');
const donationStep2 = document.getElementById('donation-step-2');
const paymentAmountDisplay = document.getElementById('paymentAmountDisplay');

// Card form inputs (add these)
const cardNumberInput = document.getElementById('cardNumber');
const expiryDateInput = document.getElementById('expiryDate');
const cvvInput = document.getElementById('cvv');
const cardHolderNameInput = document.getElementById('cardHolderName');


// Variables
let donationType = 'one-time';
let selectedAmount = 0;

// Event Listeners
if (openDonationModalButton) { // Add null check
    openDonationModalButton.addEventListener('click', openModal);
}
if (closeModalButton) { // Add null check
    closeModalButton.addEventListener('click', closeModalFunc);
}

if (oneTimeBtn) { // Add null check
    oneTimeBtn.addEventListener('click', () => {
        donationType = 'one-time';
        oneTimeBtn.classList.add('active');
        if (monthlyBtn) monthlyBtn.classList.remove('active');
    });
}

if (monthlyBtn) { // Add null check
    monthlyBtn.addEventListener('click', () => {
        donationType = 'monthly';
        monthlyBtn.classList.add('active');
        if (oneTimeBtn) oneTimeBtn.classList.remove('active');
    });
}

amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedAmount = btn.getAttribute('data-amount');
        if (amountDisplay) amountDisplay.value = `Rs. ${selectedAmount}`;
        if (customAmount) customAmount.value = '';
    });
});

if (customAmount) { // Add null check
    customAmount.addEventListener('input', () => {
        if (customAmount.value) {
            amountBtns.forEach(b => b.classList.remove('active'));
            selectedAmount = customAmount.value;
            if (amountDisplay) amountDisplay.value = `Rs. ${selectedAmount}`;
        }
    });
}

if (proceedToPaymentBtn) {
    proceedToPaymentBtn.addEventListener('click', () => {
        if (!selectedAmount || parseFloat(selectedAmount) <= 0) {
            alert('Please select or enter a valid amount');
            return;
        }
        if (donationStep1 && donationStep2) {
            donationStep1.style.display = 'none';
            donationStep2.style.display = 'block';
            if (paymentAmountDisplay) {
                paymentAmountDisplay.textContent = selectedAmount;
            }
        }
    });
}

if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
        if (donationStep1 && donationStep2) {
            donationStep2.style.display = 'none';
            donationStep1.style.display = 'block';
        }
    });
}

if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
        // Basic validation for card details
        if (!cardNumberInput.value.trim() || !expiryDateInput.value.trim() || !cvvInput.value.trim() || !cardHolderNameInput.value.trim()) {
            alert('Please fill in all card details.');
            return;
        }
        // Add more specific validation if needed (e.g., card number format, expiry date format)

        const typeText = donationType === 'one-time' ? 'one-time' : 'monthly';
        console.log(`Processing ${typeText} donation of Rs. ${selectedAmount} with card details.`);
        initiatePayment(selectedAmount, donationType); // This will show the placeholder alert
        // In a real scenario, you'd pass card details to your backend here.
    });
}


// Functions
function openModal() {
    if (donationModal) {
        donationModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const navbarElement = document.querySelector('.navbar'); // Get the navbar element
        if (navbarElement) {
            navbarElement.style.display = 'none'; // Hide the navbar
        }
        // Reset to step 1 when modal opens
        if (donationStep1 && donationStep2) {
            donationStep1.style.display = 'block';
            donationStep2.style.display = 'none';
        }
        // Reset amount and type (optional, or retain previous selection)
        // selectedAmount = 0;
        // if(amountDisplay) amountDisplay.value = '';
        // if(customAmount) customAmount.value = '';
        // amountBtns.forEach(b => b.classList.remove('active'));
        // oneTimeBtn.click(); // or set default
    }
}

function closeModalFunc() {
    if (donationModal) {
        donationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const navbarElement = document.querySelector('.navbar'); // Get the navbar element
        if (navbarElement) {
            navbarElement.style.display = 'flex'; // Show the navbar (Bootstrap default)
        }
        // Reset to step 1 when modal closes
        if (donationStep1 && donationStep2) {
            donationStep1.style.display = 'block';
            donationStep2.style.display = 'none';
        }
    }
}

// Placeholder function for payment gateway integration
function initiatePayment(amount, type) {
    // This is where you would integrate with your chosen payment gateway.
    // 1. Make a request to your backend server with the amount and type.
    // 2. Your backend would then interact with the payment gateway API 
    //    to create a payment session or charge.
    // 3. The backend would return a session ID or a URL to redirect the user to.
    // 4. Frontend handles the redirection or uses the gateway's SDK to show payment elements.

    alert(`Initiating ${type} payment of Rs. ${amount}.\nThis is a placeholder. Real payment gateway integration with card details processing is needed here.`);
    
    // Example: Redirecting to a dummy payment page (replace with actual gateway URL or SDK handling)
    // window.location.href = `/your-payment-gateway-handler?amount=${amount}&type=${type}`;

    // For now, let's just close the modal after the alert.
    // In a real scenario, you'd close it upon successful payment or cancellation.
    // And potentially clear card fields
    if (cardNumberInput) cardNumberInput.value = '';
    if (expiryDateInput) expiryDateInput.value = '';
    if (cvvInput) cvvInput.value = '';
    if (cardHolderNameInput) cardHolderNameInput.value = '';
    
    closeModalFunc();
}

// Close modal when clicking outside
if (donationModal) { // Add null check
    donationModal.addEventListener('click', (e) => {
        if (e.target === donationModal) {
            closeModalFunc();
        }
    });
}

// Optional: Add JavaScript for navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) { // Add null check
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Optional: JavaScript for nested dropdowns to work on hover/click for touch devices
document.addEventListener('DOMContentLoaded', function () {
    // Make dropdowns work on hover
    document.querySelectorAll('.dropdown-submenu').forEach(function (submenu) {
        submenu.addEventListener('mouseover', function () {
            let subMenuDropdown = this.querySelector('.dropdown-menu');
            if (subMenuDropdown) {
                subMenuDropdown.style.display = 'block';
            }
        });
        submenu.addEventListener('mouseout', function () {
            let subMenuDropdown = this.querySelector('.dropdown-menu');
            if (subMenuDropdown) {
                subMenuDropdown.style.display = 'none';
            }
        });
    });

    // Ensure parent dropdowns remain open when hovering over submenus
    document.querySelectorAll('.dropdown-menu .dropdown-submenu').forEach(function(element){
        element.addEventListener('mouseenter', function (e) {
            let submenu = this.querySelector('.dropdown-menu');
            if(submenu){
                submenu.classList.add('show');
            }
            e.stopPropagation(); // Prevents parent dropdown from closing
        });
        element.addEventListener('mouseleave', function (e) {
            let submenu = this.querySelector('.dropdown-menu');
            if(submenu){
                submenu.classList.remove('show');
            }
        });
    });
    
    // Add hover effect for social icons
    document.querySelectorAll('.social-icon').forEach(function(icon) {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) rotate(5deg)';
        });
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });
});


// Footer newsletter form handling
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.footer-newsletter .input-group');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const subscribeBtn = newsletterForm.querySelector('button');
        
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            if (email && isValidEmail(email)) {
                // Here you would typically send this to your backend
                console.log('Newsletter subscription for:', email);
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
        
        // Also submit on Enter key
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                subscribeBtn.click();
            }
        });
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scroll for footer links
document.querySelectorAll('.footer-links a, .footer-bottom-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});