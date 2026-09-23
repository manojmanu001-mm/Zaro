/* =========================================================
   ZARO TECHNOLOGIES
   MAIN WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");

        if (mobileMenu.classList.contains("active")) {
            mobileMenuBtn.innerHTML = "×";
        } else {
            mobileMenuBtn.innerHTML = "☰";
        }
    });

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            mobileMenu.classList.remove("active");
            mobileMenuBtn.innerHTML = "☰";
        });
    });
}


/* =========================================================
   INTERACTIVE CREATOR WORKSPACE
========================================================= */

const featureModal = document.getElementById("featureModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalIcon = document.getElementById("modalIcon");

const creatorPrompt = document.getElementById("creatorPrompt");
const creatorStyle = document.getElementById("creatorStyle");
const generateBtn = document.getElementById("generateBtn");
const creatorResult = document.getElementById("creatorResult");

const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalDoneBtn = document.getElementById("modalDoneBtn");


/* =========================================================
   FEATURE DETAILS
========================================================= */

const featureDetails = {
    "AI Content": {
        icon: "✍️",
        message: "Create captions, scripts, hooks and content ideas."
    },

    "AI Video": {
        icon: "🎬",
        message: "Turn your ideas and scripts into video concepts."
    },

    "AI Image": {
        icon: "🖼️",
        message: "Create creative visual concepts and image ideas."
    },

    "AI Audio": {
        icon: "🎙️",
        message: "Create voiceover, narration and audio concepts."
    },

    "AI Editor": {
        icon: "✂️",
        message: "Plan edits, captions, transitions and branding."
    },

    "Make It For Me": {
        icon: "🚀",
        message: "Describe your project and let Zaro plan the workflow."
    },

    "Zaro Pro": {
        icon: "⭐",
        message: "Zaro Pro is coming soon."
    }
};


/* =========================================================
   OPEN WORKSPACE
========================================================= */

function showFeature(featureName) {
    if (!featureModal) {
        return;
    }

    const details = featureDetails[featureName] || {
        icon: "✦",
        message: "Explore this Zaro feature."
    };

    if (modalTitle) {
        modalTitle.textContent = featureName;
    }

    if (modalIcon) {
        modalIcon.textContent = details.icon;
    }

    if (modalMessage) {
        modalMessage.textContent = details.message;
    }

    if (creatorPrompt) {
        creatorPrompt.value = "";
        creatorPrompt.placeholder =
            "Describe what you want to create with " +
            featureName +
            "...";
    }

    if (creatorStyle) {
        creatorStyle.value = "Professional";
    }

    if (creatorResult) {
        creatorResult.classList.remove("active");
        creatorResult.textContent =
            "Your generated result will appear here.";
    }

    if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate Demo →";
    }

    featureModal.classList.add("active");
    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE WORKSPACE
========================================================= */

function closeFeature() {
    if (!featureModal) {
        return;
    }

    featureModal.classList.remove("active");
    document.body.style.overflow = "";
}


/* =========================================================
   CLOSE BUTTONS
========================================================= */

if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeFeature);
}

if (modalDoneBtn) {
    modalDoneBtn.addEventListener("click", closeFeature);
}


/* =========================================================
   CLOSE OUTSIDE MODAL
========================================================= */

if (featureModal) {
    featureModal.addEventListener("click", function (event) {
        if (event.target === featureModal) {
            closeFeature();
        }
    });
}


/* =========================================================
   CLOSE WITH ESCAPE
========================================================= */

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeFeature();
    }
});


/* =========================================================
   CREATOR BACKEND API GENERATION
========================================================= */

if (generateBtn) {
    generateBtn.addEventListener("click", async function () {
        const prompt = creatorPrompt
            ? creatorPrompt.value.trim()
            : "";

        const style = creatorStyle
            ? creatorStyle.value
            : "Professional";

        const feature = modalTitle
            ? modalTitle.textContent
            : "Zaro Creator";

        if (!prompt) {
            alert("Please describe what you want to create.");

            if (creatorPrompt) {
                creatorPrompt.focus();
            }

            return;
        }

        const token = localStorage.getItem("zaroToken");

        if (!token) {
            alert("Please login first to use Zaro AI.");
            window.location.href = "login.html";
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = "Sending Request...";

        if (creatorResult) {
            creatorResult.classList.add("active");
            creatorResult.textContent =
                "Sending your request to Zaro backend...";
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/ai/generate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify({
                        feature: feature,
                        prompt: prompt,
                        style: style
                    })
                }
            );

            const data = await response.json();

            /* LOGIN REQUIRED */
            if (response.status === 401) {
                alert("Your login session expired. Please login again.");
                localStorage.removeItem("zaroToken");
                localStorage.removeItem("zaroUser");
                window.location.href = "login.html";
                return;
            }

            /* ONE FREE USE COMPLETED */
            if (
                response.status === 403 &&
                data.code === "FREE_LIMIT_REACHED"
            ) {
                if (creatorResult) {
                    creatorResult.textContent =
                        "Your one free generation has been completed.\n\n" +
                        "Please choose a subscription plan to continue.";
                }

                const openPricing = confirm(
                    "Your free generation is completed. Would you like to view pricing plans?"
                );

                if (openPricing) {
                    window.location.href = "pricing.html";
                }

                return;
            }

           if (!response.ok) {
    if (response.status === 401) {
        alert("Please login first to use Zaro AI.");
        return;
    }

    if (
        response.status === 403 &&
        data.code === "FREE_LIMIT_REACHED"
    ) {
        if (creatorResult) {
            creatorResult.textContent =
                "Your free generation is completed.\n\n" +
                "Please choose a subscription plan to continue.";
        }

        setTimeout(function () {
            window.location.href = "pricing.html";
        }, 1000);

        return;
    }

    throw new Error(
        data.message || "Request failed."
    );
}

            if (creatorResult) {
                creatorResult.textContent =
                    "Request Submitted Successfully\n\n" +
                    "Feature: " + feature + "\n\n" +
                    "Style: " + style + "\n\n" +
                    "Your idea:\n" + prompt + "\n\n" +
                    "Request ID: " + data.requestId + "\n\n" +
                    "Status: " + data.status;
            }

        } catch (error) {
            console.error("AI API Error:", error);

            if (creatorResult) {
                creatorResult.textContent =
                    "Unable to connect to Zaro backend.\n\n" +
                    "Please make sure your Node.js server is running.\n\n" +
                    "Error: " + error.message;
            }

        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = "Generate →";
        }
    });
}


/* =========================================================
   CONTACT FORM API
========================================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nameElement = document.getElementById("contactName");
        const emailElement = document.getElementById("contactEmail");
        const messageElement = document.getElementById("contactMessage");

        const name = nameElement
            ? nameElement.value.trim()
            : "";

        const email = emailElement
            ? emailElement.value.trim()
            : "";

        const message = messageElement
            ? messageElement.value.trim()
            : "";

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const submitButton = contactForm.querySelector("button");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Message could not be sent."
                );
            }

            alert("Your message has been sent successfully!");
            contactForm.reset();

        } catch (error) {
            console.error("Contact API Error:", error);
            alert("Unable to send your message. Please try again.");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message →";
            }
        }
    });
}


/* =========================================================
   NEWSLETTER FORM API
========================================================= */

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailInput =
            document.getElementById("newsletterEmail");

        const newsletterMessage =
            document.getElementById("newsletterMessage");

        const email = emailInput
            ? emailInput.value.trim()
            : "";

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        const submitButton = newsletterForm.querySelector("button");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Subscribing...";
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/newsletter",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Subscription failed."
                );
            }

            if (newsletterMessage) {
                newsletterMessage.textContent =
                    data.message || "Successfully subscribed!";
                newsletterMessage.style.color = "#72e6a1";
            } else {
                alert(data.message || "Successfully subscribed!");
            }

            newsletterForm.reset();

        } catch (error) {
            console.error("Newsletter API Error:", error);

            if (newsletterMessage) {
                newsletterMessage.textContent =
                    error.message || "Unable to subscribe.";
                newsletterMessage.style.color = "#ff7d8d";
            } else {
                alert("Unable to subscribe. Please try again.");
            }

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Subscribe →";
            }
        }
    });
}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    if (!navbar) {
        return;
    }

    if (window.scrollY > 50) {
        navbar.style.background =
            "rgba(5, 5, 5, 0.96)";
    } else {
        navbar.style.background =
            "rgba(8, 8, 8, 0.88)";
    }
});


/* =========================================================
   REVEAL SECTIONS ON SCROLL
========================================================= */

const revealElements = document.querySelectorAll(
    ".creator-card, .why-card, .service-card, .step, .work-card, .pricing-card, .stat"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    revealElements.forEach(function (element) {
        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";
        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
    });
}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(function (link) {
        link.style.color = "";

        const href = link.getAttribute("href");

        if (href === "#" + currentSection) {
            link.style.color = "#ffffff";
        }
    });
});


/* =========================================================
   BUTTON PRESS FEEDBACK
========================================================= */

const buttons = document.querySelectorAll(
    ".primary-btn, .secondary-btn"
);

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        this.style.transform = "scale(0.98)";

        setTimeout(function () {
            button.style.transform = "";
        }, 120);
    });
});


/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear = new Date().getFullYear();

const footerYear =
    document.querySelector(".footer-bottom p");

if (footerYear) {
    footerYear.innerHTML =
        "© " +
        currentYear +
        " Zaro Technologies. All rights reserved.";
}


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "🚀 Zaro Technologies frontend loaded successfully."
);

console.log(
    "Technology + AI + Creative Production"
);