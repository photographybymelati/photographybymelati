// /assets/js/components/booking.js

export class BookingSystem {
    constructor(options = {}) {
        this.options = {
            availabilityEndpoint: '/api/availability',
            bookingEndpoint: '/api/book',
            stripe: options.stripe || null,
            ...options
        };
        
        this.init();
    }
    
    async init() {
        this.initCalendar();
        this.initPackageSelection();
        this.initPaymentSystem();
    }
    
    initCalendar() {
        this.calendar = {
            blockedDates: new Set(),
            selectedDate: null,
            
            async fetchAvailability(month, year) {
                try {
                    const response = await fetch(`${this.options.availabilityEndpoint}?month=${month}&year=${year}`);
                    const data = await response.json();
                    
                    // Update blocked dates
                    this.blockedDates = new Set(data.blockedDates);
                    this.renderCalendar();
                } catch (error) {
                    console.error('Error fetching availability:', error);
                }
            },
            
            renderCalendar() {
                const calendarElement = document.querySelector('.booking-calendar');
                if (!calendarElement) return;
                
                // Calendar rendering logic
                // This would create a full calendar UI with date selection
            }
        };
    }
    
    initPackageSelection() {
        const packageButtons = document.querySelectorAll('.package-select');
        packageButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectedPackage = button.dataset.package;
                this.updateSummary();
            });
        });
    }
    
    async initPaymentSystem() {
        if (!this.options.stripe) return;
        
        this.stripe = this.options.stripe;
        const elements = this.stripe.elements();
        
        // Create payment element
        this.paymentElement = elements.create('payment');
        const paymentContainer = document.querySelector('#payment-element');
        if (paymentContainer) {
            this.paymentElement.mount(paymentContainer);
        }
    }
    
    updateSummary() {
        const summaryElement = document.querySelector('.booking-summary');
        if (!summaryElement || !this.selectedPackage) return;
        
        // Update booking summary display
        summaryElement.innerHTML = `
            <h3>Booking Summary</h3>
            <div class="summary-details">
                <p>Package: ${this.selectedPackage}</p>
                <p>Date: ${this.calendar.selectedDate}</p>
                <p>Total: ${this.getPackagePrice()}</p>
            </div>
        `;
    }
    
    getPackagePrice() {
        const prices = {
            'wedding-intimate': 2000,
            'wedding-signature': 3000,
            'wedding-adventure': 4000,
            'portrait-couple': 400,
            'portrait-family': 500
        };
        
        return prices[this.selectedPackage] || 0;
    }
    
    async processBooking(formData) {
        try {
            // Create payment intent
            const { clientSecret } = await this.createPaymentIntent();
            
            // Confirm payment
            const { error: paymentError } = await this.stripe.confirmPayment({
                elements: this.paymentElement,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/booking/confirmation`,
                }
            });
            
            if (paymentError) {
                throw new Error(paymentError.message);
            }
            
            // Submit booking
            await this.submitBooking(formData);
            
            return { success: true };
        } catch (error) {
            console.error('Booking error:', error);
            return { success: false, error: error.message };
        }
    }
    
    async createPaymentIntent() {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: this.getPackagePrice(),
                package: this.selectedPackage
            })
        });
        
        return await response.json();
    }
    
    async submitBooking(formData) {
        const response = await fetch(this.options.bookingEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                package: this.selectedPackage,
                date: this.calendar.selectedDate,
                ...Object.fromEntries(formData)
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit booking');
        }
        
        return await response.json();
    }
}
