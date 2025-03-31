/**
 * TechMayank Newsletter Subscription Handler
 * Handles newsletter subscription form submission and displays appropriate messages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find the subscription form on the page
    const subscribeForm = document.getElementById('mc-embedded-subscribe-form');
    
    // If the form exists on this page, set up the subscription handlers
    if (subscribeForm) {
        const subscribeButton = document.getElementById('mc-embedded-subscribe');
        const emailInput = document.getElementById('mce-EMAIL');
        const mceSuccessResponse = document.getElementById('mce-success-response');
        const mceErrorResponse = document.getElementById('mce-error-response');
        
        // Create a new status element if it doesn't exist
        let subscribeStatus = document.getElementById('subscribe-status');
        if (!subscribeStatus) {
            subscribeStatus = document.createElement('div');
            subscribeStatus.id = 'subscribe-status';
            subscribeStatus.className = 'subscribe-message';
            subscribeStatus.style.display = 'none';
            
            const statusText = document.createElement('p');
            statusText.textContent = 'Thank you for subscribing! Please check your inbox to confirm your subscription.';
            subscribeStatus.appendChild(statusText);
            
            // Insert after the mce-responses div
            const mceResponses = document.getElementById('mce-responses');
            if (mceResponses) {
                mceResponses.parentNode.insertBefore(subscribeStatus, mceResponses.nextSibling);
            } else {
                subscribeForm.appendChild(subscribeStatus);
            }
        }
        
        // Form submission handling
        subscribeForm.addEventListener('submit', function(e) {
            // Don't prevent default - we want the form to submit to Mailchimp
            
            // Check if email is valid first
            if (emailInput.validity.valid) {
                // Save the email for potential use
                const emailValue = emailInput.value;
                
                // Show loading state
                subscribeButton.classList.add('loading');
                subscribeButton.disabled = true;
                subscribeButton.textContent = 'Subscribing...';
                
                // Hide any previous messages
                mceSuccessResponse.style.display = 'none';
                mceErrorResponse.style.display = 'none';
                subscribeStatus.style.display = 'none';
                
                // Set a timeout to handle the case when Mailchimp doesn't respond
                setTimeout(function() {
                    // If Mailchimp hasn't shown its response yet, show our custom one
                    if (mceSuccessResponse.style.display === 'none' && mceErrorResponse.style.display === 'none') {
                        // Reset button
                        subscribeButton.classList.remove('loading');
                        subscribeButton.disabled = false;
                        subscribeButton.textContent = 'Subscribe';
                        
                        // Show custom success message
                        subscribeStatus.style.display = 'block';
                        emailInput.value = '';
                        
                        // Hide the custom message after 5 seconds
                        setTimeout(function() {
                            subscribeStatus.style.display = 'none';
                        }, 5000);
                    }
                }, 3000); // Wait 3 seconds for Mailchimp response before showing our custom message
            }
        });
        
        // Observer to watch for Mailchimp's success or error messages
        const observerConfig = { attributes: true, attributeFilter: ['style'] };
        
        // Create observer for success response
        const successObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.style.display !== 'none') {
                    // Reset button state
                    subscribeButton.classList.remove('loading');
                    subscribeButton.disabled = false;
                    subscribeButton.textContent = 'Subscribe';
                    
                    // Clear email field
                    emailInput.value = '';
                    
                    // Hide our custom message if it's showing
                    subscribeStatus.style.display = 'none';
                    
                    // Hide Mailchimp message after 5 seconds
                    setTimeout(function() {
                        mutation.target.style.display = 'none';
                    }, 5000);
                }
            });
        });
        
        // Create observer for error response
        const errorObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.style.display !== 'none') {
                    // Reset button state
                    subscribeButton.classList.remove('loading');
                    subscribeButton.disabled = false;
                    subscribeButton.textContent = 'Subscribe';
                    
                    // Hide our custom message if it's showing
                    subscribeStatus.style.display = 'none';
                    
                    // Hide Mailchimp error message after 5 seconds
                    setTimeout(function() {
                        mutation.target.style.display = 'none';
                    }, 5000);
                }
            });
        });
        
        // Start observing Mailchimp response elements
        if (mceSuccessResponse) {
            successObserver.observe(mceSuccessResponse, observerConfig);
        }
        
        if (mceErrorResponse) {
            errorObserver.observe(mceErrorResponse, observerConfig);
        }
    }
});