// DOM Elements
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");
const closeButtons = document.querySelectorAll(".close");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main section");
const orderNowBtn = document.getElementById("order-now-btn");

// Order Section Elements
const orderSteps = document.querySelectorAll(".order-steps .step");
const stepContents = document.querySelectorAll(".step-content");
const stationsList = document.getElementById("stations-list");
const fuelTypes = document.getElementById("fuel-types");
const fuelQuantity = document.getElementById("fuel-quantity");
const proceedToConfirm = document.getElementById("proceed-to-confirm");
const placeOrderBtn = document.getElementById("place-order-btn");
const orderSummary = document.getElementById("order-summary");
const paymentOptions = document.querySelectorAll('input[name="payment"]');
const cardDetails = document.getElementById("card-details");

// App State
let currentUser = null;
let selectedStation = null;
let selectedFuel = null;
let currentStep = 1;

// Mock Data
const stations = [
  {
    id: 1,
    name: "Shell Kabarak",
    address: "Kabarak Road, Nakuru",
    distance: "1.2 km",
    price: 180.5,
    image: "https://via.placeholder.com/300x150?text=Shell+Kabarak",
    fuels: [
      { type: "Premium", price: 185.5 },
      { type: "Regular", price: 180.5 },
      { type: "Diesel", price: 175.0 },
    ],
  },
  {
    id: 2,
    name: "Total Nakuru",
    address: "Nakuru Town",
    distance: "3.5 km",
    price: 179.0,
    image: "https://via.placeholder.com/300x150?text=Total+Nakuru",
    fuels: [
      { type: "Premium", price: 184.0 },
      { type: "Regular", price: 179.0 },
      { type: "Diesel", price: 173.5 },
    ],
  },
  {
    id: 3,
    name: "Kobil Kabarak",
    address: "Near Kabarak University",
    distance: "0.8 km",
    price: 181.0,
    image: "https://via.placeholder.com/300x150?text=Kobil+Kabarak",
    fuels: [
      { type: "Premium", price: 186.0 },
      { type: "Regular", price: 181.0 },
      { type: "Diesel", price: 176.5 },
    ],
  },
];

// Mock Orders
const orders = [];

// Event Listeners
loginBtn.addEventListener("click", () => (loginModal.style.display = "block"));
signupBtn.addEventListener(
  "click",
  () => (signupModal.style.display = "block")
);
logoutBtn.addEventListener("click", handleLogout);

closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    loginModal.style.display = "none";
    signupModal.style.display = "none";
  });
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
  if (e.target === signupModal) signupModal.style.display = "none";
});

loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionId = link.id.replace("-link", "-section");

    // Update active nav link
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // Show selected section
    sections.forEach((section) => (section.style.display = "none"));
    document.getElementById(sectionId).style.display = "block";
  });
});

orderNowBtn.addEventListener("click", () => {
  document.getElementById("order-link").click();
});

// Order Process Event Listeners
proceedToConfirm.addEventListener("click", proceedToStep3);
placeOrderBtn.addEventListener("click", placeOrder);

paymentOptions.forEach((option) => {
  option.addEventListener("change", (e) => {
    if (e.target.value === "card") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  });
});

// Initialize the app
function init() {
  renderStations();
  checkAuthStatus();
}

// Render stations list
function renderStations() {
  stationsList.innerHTML = "";

  stations.forEach((station) => {
    const stationCard = document.createElement("div");
    stationCard.className = "station-card";
    stationCard.innerHTML = `
            <img src="${station.image}" alt="${station.name}">
            <h3>${station.name}</h3>
            <p>${station.address}</p>
            <p>Distance: ${station.distance}</p>
            <p class="price">Ksh ${station.price.toFixed(2)}/L</p>
        `;

    stationCard.addEventListener("click", () => selectStation(station));
    stationsList.appendChild(stationCard);
  });
}

// Select a station
function selectStation(station) {
  selectedStation = station;

  // Update UI
  document.querySelectorAll(".station-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Render fuel types
  renderFuelTypes();

  // Proceed to next step
  goToStep(2);
}

// Render fuel types for selected station
function renderFuelTypes() {
  fuelTypes.innerHTML = "";

  selectedStation.fuels.forEach((fuel) => {
    const fuelType = document.createElement("div");
    fuelType.className = "fuel-type";
    fuelType.innerHTML = `
            <h4>${fuel.type}</h4>
            <p>Ksh ${fuel.price.toFixed(2)}/L</p>
        `;

    fuelType.addEventListener("click", () => {
      selectedFuel = fuel;
      document.querySelectorAll(".fuel-type").forEach((ft) => {
        ft.classList.remove("selected");
      });
      fuelType.classList.add("selected");
    });

    fuelTypes.appendChild(fuelType);
  });
}

// Proceed to step 3 (confirm order)
function proceedToStep3() {
  if (!selectedFuel) {
    alert("Please select a fuel type");
    return;
  }

  // Update selected station info
  const selectedStationInfo = document.getElementById("selected-station-info");
  selectedStationInfo.innerHTML = `
        <h3>${selectedStation.name}</h3>
        <p>${selectedStation.address}</p>
        <p>Distance: ${selectedStation.distance}</p>
    `;

  // Update order summary
  const quantity = parseInt(fuelQuantity.value);
  const total = (selectedFuel.price * quantity).toFixed(2);

  orderSummary.innerHTML = `
        <div class="order-summary-item">
            <span>Station:</span>
            <span>${selectedStation.name}</span>
        </div>
        <div class="order-summary-item">
            <span>Fuel Type:</span>
            <span>${selectedFuel.type}</span>
        </div>
        <div class="order-summary-item">
            <span>Price per Liter:</span>
            <span>Ksh ${selectedFuel.price.toFixed(2)}</span>
        </div>
        <div class="order-summary-item">
            <span>Quantity:</span>
            <span>${quantity} Liters</span>
        </div>
        <div class="order-summary-item total">
            <span>Total:</span>
            <span>Ksh ${total}</span>
        </div>
    `;

  goToStep(3);
}

// Place order
function placeOrder() {
  if (!currentUser) {
    alert("Please login to place an order");
    loginModal.style.display = "block";
    return;
  }

  const quantity = parseInt(fuelQuantity.value);
  const total = (selectedFuel.price * quantity).toFixed(2);
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  const newOrder = {
    id: Date.now(),
    userId: currentUser.id,
    station: selectedStation.name,
    fuelType: selectedFuel.type,
    quantity: quantity,
    total: parseFloat(total),
    paymentMethod: paymentMethod,
    status: "pending",
    date: new Date().toLocaleString(),
  };

  orders.push(newOrder);

  alert(`Order placed successfully! Total: Ksh ${total}`);
  resetOrderProcess();
  document.getElementById("home-link").click();
}

// Reset order process
function resetOrderProcess() {
  selectedStation = null;
  selectedFuel = null;
  fuelQuantity.value = 10;

  document.querySelectorAll(".station-card").forEach((card) => {
    card.classList.remove("selected");
  });

  document.querySelectorAll(".fuel-type").forEach((ft) => {
    ft.classList.remove("selected");
  });

  goToStep(1);
}

// Navigate between steps
function goToStep(step) {
  currentStep = step;

  // Update step indicators
  orderSteps.forEach((s, index) => {
    if (index < step) {
      s.classList.add("completed");
      s.classList.remove("active");
    } else if (index === step - 1) {
      s.classList.add("active");
      s.classList.remove("completed");
    } else {
      s.classList.remove("active", "completed");
    }
  });

  // Show current step content
  stepContents.forEach((content, index) => {
    if (index === step - 1) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
}

// Handle login
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // In a real app, this would be an API call
  if (email && password) {
    currentUser = {
      id: 1,
      name: "Test User",
      email: email,
      phone: "0712345678",
      vehicle: "car",
    };

    updateAuthUI();
    loginModal.style.display = "none";
    alert("Login successful!");
  } else {
    alert("Please enter email and password");
  }
}

// Handle signup
function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const phone = document.getElementById("signup-phone").value;
  const password = document.getElementById("signup-password").value;
  const vehicle = document.getElementById("signup-vehicle").value;

  if (name && email && phone && password && vehicle) {
    currentUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      vehicle: vehicle,
    };

    updateAuthUI();
    signupModal.style.display = "none";
    alert("Account created successfully!");
  } else {
    alert("Please fill all fields");
  }
}

// Handle logout
function handleLogout() {
  currentUser = null;
  updateAuthUI();
  document.getElementById("home-link").click();
}

// Update UI based on auth status
function updateAuthUI() {
  if (currentUser) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "block";

    // Update account info if on account page
    if (document.getElementById("account-section").style.display === "block") {
      renderAccountInfo();
    }
  } else {
    loginBtn.style.display = "block";
    signupBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
}

// Render account info
function renderAccountInfo() {
  const accountInfo = document.getElementById("account-info");

  if (currentUser) {
    accountInfo.innerHTML = `
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Vehicle Type:</strong> ${currentUser.vehicle}</p>
        `;
  } else {
    accountInfo.innerHTML = "<p>Please login to view account information</p>";
  }
}

// Check auth status on page load
function checkAuthStatus() {
  // In a real app, this would check localStorage or cookies
  // For demo, we'll just check if currentUser exists
  updateAuthUI();
}

// Initialize the app
init();
