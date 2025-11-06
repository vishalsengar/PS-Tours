/**
 * P.S. Tours Website - Main JavaScript File
 * Handles navigation, form submission, slider, and interactive features
 */

// ============================================
// HERO SLIDER FUNCTIONALITY
// ============================================

/**
 * Initialize hero slider with auto-play and navigation
 */
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll(".hero-slide");
        this.indicators = document.querySelectorAll(".slider-indicator");
        this.prevButton = document.getElementById("prevSlide");
        this.nextButton = document.getElementById("nextSlide");
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds

        if (this.slides.length === 0) {
            return;
        }

        this.init();
    }

    /**
     * Initialize slider functionality
     */
    init() {
        // Set up navigation buttons
        if (this.prevButton) {
            this.prevButton.addEventListener("click", () => this.prevSlide());
        }

        if (this.nextButton) {
            this.nextButton.addEventListener("click", () => this.nextSlide());
        }

        // Set up indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => this.goToSlide(index));
        });

        // Start auto-play
        this.startAutoPlay();

        // Pause auto-play on hover
        const heroSection = document.querySelector(".hero");
        if (heroSection) {
            heroSection.addEventListener("mouseenter", () => this.stopAutoPlay());
            heroSection.addEventListener("mouseleave", () => this.startAutoPlay());
        }

        // Touch/swipe support for mobile
        this.addTouchSupport();
    }

    /**
     * Show specific slide
     * @param {number} index - Slide index to show
     */
    showSlide(index) {
        // Remove active class from all slides and indicators
        this.slides.forEach((slide) => slide.classList.remove("active"));
        this.indicators.forEach((indicator) => indicator.classList.remove("active"));

        // Ensure index is within bounds
        if (index < 0) {
            this.currentSlide = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = index;
        }

        // Add active class to current slide and indicator
        this.slides[this.currentSlide].classList.add("active");
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add("active");
        }
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
        this.resetAutoPlay();
    }

    /**
     * Go to previous slide
     */
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
        this.resetAutoPlay();
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    /**
     * Start auto-play functionality
     */
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing interval
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    /**
     * Stop auto-play functionality
     */
    stopAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    /**
     * Reset auto-play (restart timer)
     */
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    /**
     * Add touch/swipe support for mobile devices
     */
    addTouchSupport() {
        const heroSection = document.querySelector(".hero");
        if (!heroSection) {
            return;
        }

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        heroSection.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSection.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
}

// Initialize slider when DOM is loaded
let heroSlider;
document.addEventListener("DOMContentLoaded", () => {
    heroSlider = new HeroSlider();
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

/**
 * Initialize mobile menu toggle
 */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a nav link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (hamburger && navMenu) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    }
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

/**
 * Add shadow to navbar on scroll
 */
const navbar = document.getElementById("navbar");

// Hide-on-scroll: show when scrolling up, hide when scrolling down
let lastScrollY = window.pageYOffset;
let rafId = 0;
const SCROLL_HIDE_THRESHOLD = 8; // px
const HIDE_START_OFFSET = 100; // px from top before hide behavior starts

function handleScroll() {
    if (!navbar) return;

    const currentY = window.pageYOffset;

    // Add shadow when scrolled
    if (currentY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    // Do not hide if mobile menu is open
    const isMenuOpen = navMenu && navMenu.classList.contains("active");

    if (!isMenuOpen && currentY > HIDE_START_OFFSET && Math.abs(currentY - lastScrollY) > SCROLL_HIDE_THRESHOLD) {
        if (currentY > lastScrollY) {
            // scrolling down -> hide
            navbar.classList.add("nav-hidden");
        } else {
            // scrolling up -> show
            navbar.classList.remove("nav-hidden");
        }
    }

    if (currentY <= HIDE_START_OFFSET) {
        navbar.classList.remove("nav-hidden");
    }

    lastScrollY = currentY;
    rafId = 0;
}

window.addEventListener("scroll", () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(handleScroll);
});

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================

/**
 * Enhanced smooth scrolling with offset for fixed navbar
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        
        // Skip if it's just "#"
        if (href === "#" || href === "") {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
            });
        }
    });
});

// ============================================
// FORM VALIDATION AND SUBMISSION
// ============================================

/**
 * Validate form input
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field - The form field to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = "";

    // Remove existing error styling
    field.classList.remove("error");
    
    // Check required fields
    if (field.hasAttribute("required") && !value) {
        isValid = false;
        errorMessage = `${field.labels[0]?.textContent || fieldName} is required`;
    }

    // Validate email
    if (fieldName === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email address";
        }
    }

    // Validate phone
    if (fieldName === "phone" && value) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ""))) {
            isValid = false;
            errorMessage = "Please enter a valid 10-digit phone number";
        }
    }

    // Validate date (should not be in the past)
    if (fieldName === "pickupDate" && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = "Pickup date cannot be in the past";
        }
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add("error");
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

/**
 * Show error message for a specific field
 * @param {HTMLElement} field - The form field
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentElement.querySelector(".field-error");
    if (existingError) {
        existingError.remove();
    }

    // Create and add error message
    const errorElement = document.createElement("div");
    errorElement.className = "field-error";
    errorElement.style.color = "var(--error-color)";
    errorElement.style.fontSize = "0.875rem";
    errorElement.style.marginTop = "0.25rem";
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}

/**
 * Clear error message for a specific field
 * @param {HTMLElement} field - The form field
 */
function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector(".field-error");
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove("error");
}

/**
 * Format phone number input
 */
const phoneInput = document.getElementById("phone");
if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
        // Remove all non-digits
        let value = e.target.value.replace(/\D/g, "");
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        e.target.value = value;
    });
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

/**
 * Handle booking form submission
 */
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
// Formspark endpoint: replace FORM_ID with your actual Formspark form ID
const FORMSPARK_URL = "https://submit-form.com/ug2fzlamQ"; // e.g., https://submit-form.com/abc123

if (bookingForm) {
    // Add real-time validation
    const formFields = bookingForm.querySelectorAll("input, select, textarea");
    formFields.forEach((field) => {
        field.addEventListener("blur", () => {
            validateField(field);
        });

        field.addEventListener("input", () => {
            if (field.classList.contains("error")) {
                validateField(field);
            }
        });
    });

    bookingForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Reset form message
        formMessage.style.display = "none";
        formMessage.className = "form-message";

        // Validate all fields
        let isFormValid = true;
        formFields.forEach((field) => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showFormMessage("Please correct the errors in the form", "error");
            return;
        }

        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {};
        formData.forEach((value, key) => {
            bookingData[key] = value;
        });

        // Show loading state
        const submitButton = bookingForm.querySelector(".btn-submit");
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            // Build payload for Formspark (application/json)
            const payload = {
                name: bookingData.name,
                email: bookingData.email,
                phone: bookingData.phone,
                pickupDate: bookingData.pickupDate,
                pickupTime: bookingData.pickupTime,
                pickupLocation: bookingData.pickupLocation,
                dropLocation: bookingData.dropLocation,
                vehicle: bookingData.vehicle,
                serviceType: bookingData.serviceType,
                passengers: bookingData.passengers,
                message: bookingData.message,
                _subject: "New Booking Request - P.S. Tours",
                _replyto: bookingData.email
            };

            const response = await fetch(FORMSPARK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Formspark error: ${response.status}`);
            }

            showFormMessage(
                "Thank you! Your booking request has been submitted successfully. We will contact you shortly to confirm your booking.",
                "success"
            );

            bookingForm.reset();

        } catch (error) {
            console.error("Form submission error:", error);
            showFormMessage(
                "Sorry, there was an error submitting your request. Please try again or contact us directly.",
                "error"
            );
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

/**
 * Display form message
 * @param {string} message - Message to display
 * @param {string} type - Message type: "success" or "error"
 */
function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = "block";

        // Scroll to message
        formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

        // Auto-hide success messages after 10 seconds
        if (type === "success") {
            setTimeout(() => {
                formMessage.style.display = "none";
            }, 10000);
        }
    }
}

// ============================================
// ANIMATIONS ON SCROLL
// ============================================

/**
 * Add fade-in animation to elements on scroll
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.querySelectorAll(".service-card, .fleet-card, .feature-item, .stat-item").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});

// ============================================
// SET MINIMUM DATE FOR PICKUP DATE INPUT
// ============================================

/**
 * Set minimum date to today for pickup date input
 */
const pickupDateInput = document.getElementById("pickupDate");
if (pickupDateInput) {
    const today = new Date().toISOString().split("T")[0];
    pickupDateInput.setAttribute("min", today);
}

// ============================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ============================================

/**
 * Highlight active navigation link based on scroll position
 */
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
});

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all features when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("P.S. Tours website initialized");
    // Fleet "Book Now" buttons -> preselect vehicle and scroll to form
    const bookButtons = document.querySelectorAll(".book-now");
    const vehicleSelect = document.getElementById("vehicle");
    const contactSection = document.getElementById("contact");

    bookButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const currentTarget = e.currentTarget;
            const vehicleName = (currentTarget && currentTarget.getAttribute)
                ? currentTarget.getAttribute("data-vehicle") || ""
                : "";
            if (vehicleSelect) {
                // Try to match exact option; fallback to setting custom value if not found
                let matched = false;
                Array.from(vehicleSelect.options).forEach((opt) => {
                    if (opt.value.toLowerCase() === vehicleName.toLowerCase()) {
                        vehicleSelect.value = opt.value;
                        matched = true;
                    }
                });
                if (!matched) {
                    vehicleSelect.value = "";
                }
            }

            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: "smooth" });
                setTimeout(() => vehicleSelect?.focus(), 400);
            }
        });
    });
});
