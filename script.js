// App Data
const appData = {
    doctors: [
        { id: 1, name: 'Dr. Anjali Sharma', specialty: 'Cardiology', rating: 4.9, reviews: 127, availability: true, avatar: 'A' },
        { id: 2, name: 'Dr. Raj Patel', specialty: 'Neurology', rating: 4.8, reviews: 89, availability: true, avatar: 'R' },
        { id: 3, name: 'Dr. Priya Singh', specialty: 'Dentistry', rating: 4.7, reviews: 156, availability: false, avatar: 'P' },
        { id: 4, name: 'Dr. Amit Kumar', specialty: 'Pediatrics', rating: 4.9, reviews: 203, availability: true, avatar: 'A' },
        { id: 5, name: 'Dr. Neha Gupta', specialty: 'Orthopedics', rating: 4.8, reviews: 67, availability: true, avatar: 'N' }
    ],
    specialties: ['Cardiology', 'Neurology', 'Dentistry', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Dermatology'],
    appointments: [
        { id: 1, doctor: 'Dr. Anjali Sharma', date: '2025-12-25', time: '10:00 AM', status: 'confirmed' },
        { id: 2, doctor: 'Dr. Raj Patel', date: '2025-12-28', time: '2:30 PM', status: 'pending' }
    ],
    prescriptions: [
        { id: 1, doctor: 'Dr. Anjali Sharma', date: '2025-12-20', medication: 'Atenolol 50mg', status: 'active' },
        { id: 2, doctor: 'Dr. Raj Patel', date: '2025-12-18', medication: 'Vitamin D3', status: 'completed' }
    ],
    notifications: [
        { id: 1, message: 'Your appointment with Dr. Sharma is tomorrow at 10 AM', time: '2 min ago', type: 'appointment' },
        { id: 2, message: 'Prescription refilled successfully', time: '1 hour ago', type: 'prescription' },
        { id: 3, message: 'New doctor reviews available', time: '3 hours ago', type: 'review' }
    ],
    currentBooking: {}
};

// DOM Elements
const elements = {
    sections: document.querySelectorAll('.content-section'),
    navItems: document.querySelectorAll('.nav-item'),
    mobileNavBtns: document.querySelectorAll('.nav-btn'),
    sidebar: document.getElementById('sidebar'),
    doctorsSlider: document.getElementById('doctorsSlider'),
    doctorSearch: document.getElementById('doctorSearch'),
    specialtyFilter: document.getElementById('specialtyFilter'),
    doctorsList: document.getElementById('doctorsList'),
    specialtyGrid: document.getElementById('specialtyGrid'),
    doctorSelection: document.getElementById('doctorSelection'),
    calendarContainer: document.getElementById('calendarContainer'),
    bookingSummary: document.getElementById('bookingSummary'),
    notificationBtn: document.getElementById('notificationBtn'),
    notificationPanel: document.getElementById('notificationPanel'),
    notificationBadge: document.getElementById('notificationBadge'),
    notificationsList: document.getElementById('notificationsList'),
    profileMenu: document.getElementById('profileMenu'),
    profileOverlay: document.getElementById('profileOverlay'),
    appointmentsList: document.getElementById('appointmentsList'),
    prescriptionsGrid: document.getElementById('prescriptionsGrid')
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    renderFeaturedDoctors();
    renderDoctorsList();
    renderSpecialties();
    renderAppointments();
    renderPrescriptions();
    renderNotifications();
    setupEventListeners();
    startRealTimeUpdates();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            showSection(section);
        });
    });

    // Doctor Search
    elements.doctorSearch.addEventListener('input', debounce(renderDoctorsList, 300));

    // Specialty Filter
    elements.specialtyFilter.addEventListener('change', renderDoctorsList);

    // Notification Panel
    elements.notificationBtn.addEventListener('click', toggleNotifications);
    elements.profileMenu.addEventListener('click', toggleProfileMenu);

    // Close panels on overlay click
    elements.profileOverlay.addEventListener('click', closeProfileMenu);
}

function showSection(sectionName) {
    // Update active states
    elements.sections.forEach(s => s.classList.remove('active'));
    elements.navItems.forEach(n => n.classList.remove('active'));
    elements.mobileNavBtns.forEach(n => n.classList.remove('active'));

    document.getElementById(sectionName + '-section')?.classList.add('active');
    document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');
    document.querySelector(`.nav-btn[data-section="${sectionName}"]`)?.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Booking Flow
let currentStep = 1;
const bookingSteps = ['specialty', 'doctor', 'time', 'confirm'];

document.querySelectorAll('.step').forEach((step, index) => {
    step.dataset.step = index + 1;
});

function nextStep() {
    const currentStepEl = document.querySelector('.step.active');
    currentStepEl.classList.remove('active');
    currentStep++;
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

function prevStep() {
    document.querySelector('.step.active').classList.remove('active');
    currentStep--;
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

// Render Functions
function renderFeaturedDoctors() {
    const sliderHTML = appData.doctors.slice(0, 3).map(doctor => `
        <div class="doctor-card">
            <div class="doctor-avatar">${doctor.avatar}</div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <div class="specialty">${doctor.specialty}</div>
                <div class="rating">⭐ ${doctor.rating} (${doctor.reviews})</div>
                <div class="availability">${doctor.availability ? 'Available Now' : 'Booked'}</div>
            </div>
            <button class="book-btn" onclick="selectDoctor(${doctor.id})">Book Now</button>
        </div>
    `).join('');
    elements.doctorsSlider.innerHTML = sliderHTML;
}

function renderDoctorsList() {
    const searchTerm = elements.doctorSearch.value.toLowerCase();
    const specialty = elements.specialtyFilter.value;
    
    const filteredDoctors = appData.doctors.filter(doctor => {
        return (!searchTerm || doctor.name.toLowerCase().includes(searchTerm) || 
                doctor.specialty.toLowerCase().includes(searchTerm)) &&
               (!specialty || doctor.specialty === specialty);
    });

    elements.doctorsList.innerHTML = filteredDoctors.map(doctor => `
        <div class="doctor-card full-width">
            <div class="doctor-avatar large">${doctor.avatar}</div>
            <div class="doctor-details">
                <div class="doctor-header">
                    <h3>${doctor.name}</h3>
                    <div class="availability-badge ${doctor.availability ? 'available' : 'unavailable'}">
                        ${doctor.availability ? 'Available' : 'Booked'}
                    </div>
                </div>
                <div class="specialty">${doctor.specialty}</div>
                <div class="rating">⭐ ${doctor.rating} (${doctor.reviews} reviews)</div>
                <div class="experience">10+ years experience</div>
            </div>
            <button class="book-btn large" onclick="selectDoctor(${doctor.id})">Book Appointment</button>
        </div>
    `).join('') || '<p style="text-align: center; color: #718096; padding: 2rem;">No doctors found matching your criteria.</p>';
}

function renderSpecialties() {
    elements.specialtyGrid.innerHTML = appData.specialties.map(specialty => `
        <div class="specialty-card" onclick="selectSpecialty('${specialty}')">
            <i class="fas fa-user-md"></i>
            <h3>${specialty}</h3>
            <div class="doctor-count">12 Doctors</div>
        </div>
    `).join('');
}

function selectSpecialty(specialty) {
    appData.currentBooking.specialty = specialty;
    renderDoctorSelection();
    nextStep();
}

function renderDoctorSelection() {
    const specialtyDoctors = appData.doctors.filter(d => d.specialty === appData.currentBooking.specialty);
    elements.doctorSelection.innerHTML = specialtyDoctors.map(doctor => `
        <div class="selection-card" onclick="selectDoctorForBooking(${doctor.id})">
            <div class="avatar-medium">${doctor.avatar}</div>
            <div>
                <h4>${doctor.name}</h4>
                <div class="rating-small">⭐ ${doctor.rating}</div>
            </div>
            <i class="fas fa-chevron-right"></i>
        </div>
    `).join('');
}

function selectDoctorForBooking(doctorId) {
    appData.currentBooking.doctor = appData.doctors.find(d => d.id === doctorId);
    renderCalendar();
    nextStep();
}

function renderCalendar() {
    const today = new Date();
    const calendarHTML = `
        <div class="calendar-header">
            <button onclick="prevMonth()"><i class="fas fa-chevron-left"></i></button>
            <h3>December 2025</h3>
            <button onclick="nextMonth()"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-grid">
            ${Array(7).fill().map((_, i) => `
                <div class="calendar-day ${i === 0 || i === 6 ? 'weekend' : ''}">
                    <div class="day-number">${today.getDate() + i}</div>
                    <div class="time-slots">
                        <span class="time-slot available" onclick="selectTime('10:00 AM')">10:00 AM</span>
                        <span class="time-slot available" onclick="selectTime('11:00 AM')">11:00 AM</span>
                        <span class="time-slot" onclick="selectTime('2:00 PM')">2:00 PM</span>
                        <span class="time-slot booked">3:00 PM</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    elements.calendarContainer.innerHTML = calendarHTML;
}

function selectTime(time) {
    appData.currentBooking.time = time;
    renderBookingSummary();
    nextStep();
}

function renderBookingSummary() {
    elements.bookingSummary.innerHTML = `
        <div class="summary-card">
            <h3>Booking Summary</h3>
            <div class="summary-item">
                <span>Doctor:</span>
                <span>${appData.currentBooking.doctor.name}</span>
            </div>
            <div class="summary-item">
                <span>Specialty:</span>
                <span>${appData.currentBooking.specialty}</span>
            </div>
            <div class="summary-item">
                <span>Date:</span>
                <span>December 25, 2025</span>
            </div>
            <div class="summary-item">
                <span>Time:</span>
                <span>${appData.currentBooking.time}</span>
            </div>
            <div class="summary-item bold">
                <span>Fee:</span>
                <span>₹800</span>
            </div>
        </div>
    `;
}

function confirmBooking() {
    appData.appointments.unshift({
        id: Date.now(),
        doctor: appData.currentBooking.doctor.name,
        date: '2025-12-25',
        time: appData.currentBooking.time,
        status: 'confirmed'
    });
    showNotification('Appointment booked successfully!', 'success');
    showSection('appointments');
    // Reset booking
    appData.currentBooking = {};
    currentStep = 1;
}

function renderAppointments() {
    elements.appointmentsList.innerHTML = appData.appointments.map(apt => `
        <div class="appointment-card">
            <div class="apt-header">
                <h3>${apt.doctor}</h3>
                <div class="status-badge confirmed">Confirmed</div>
            </div>
            <div class="apt-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${apt.date}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${apt.time}</span>
                </div>
            </div>
            <div class="apt-actions">
                <button class="btn-small secondary">Reschedule</button>
                <button class="btn-small danger">Cancel</button>
            </div>
        </div>
    `).join('') || '<p style="text-align: center; padding: 2rem; color: #718096;">No upcoming appointments.</p>';
}

function renderPrescriptions() {
    elements.prescriptionsGrid.innerHTML = appData.prescriptions.map(pres => `
        <div class="prescription-card">
            <div class="pres-header">
                <h4>${pres.medication}</h4>
                <div class="pres-status ${pres.status}">${pres.status.toUpperCase()}</div>
            </div>
            <div class="pres-doctor">Dr. ${pres.doctor}</div>
            <div class="pres-date">${pres.date}</div>
            <button class="refill-btn">Refill</button>
        </div>
    `).join('');
}

// Notification System
function toggleNotifications() {
    elements.notificationPanel.classList.toggle('open');
}

function closeNotifications() {
    elements.notificationPanel.classList.remove('open');
}

function renderNotifications() {
    elements.notificationsList.innerHTML = appData.notifications.map(notif => `
        <div class="notification-item">
            <div class="notif-content">${notif.message}</div>
            <div class="notif-time">${notif.time}</div>
        </div>
    `).join('');
}

function showNotification(message, type = 'info') {
    // Add to notifications array
    appData.notifications.unshift({
        id: Date.now(),
        message,
        time: 'Just now',
        type
    });
    renderNotifications();
    elements.notificationBadge.textContent = appData.notifications.length;
}

// Profile Menu
function toggleProfileMenu() {
    elements.profileOverlay.classList.toggle('active');
    // Toggle profile menu dropdown (can be expanded)
}

function closeProfileMenu() {
    elements.profileOverlay.classList.remove('active');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function startRealTimeUpdates() {
    // Simulate real-time notifications
    setInterval(() => {
        if (Math.random() > 0.7) {
            showNotification('New message from your doctor', 'message');
        }
    }, 30000);
}

// Responsive sidebar toggle for mobile
function toggleSidebar() {
    elements.sidebar.classList.toggle('open');
}

// Export functions for HTML onclick handlers
window.showSection = showSection;
window.selectDoctor = (id) => {
    appData.currentBooking.doctor = appData.doctors.find(d => d.id === id);
    showSection('bookings');
};
window.confirmBooking = confirmBooking;
window.toggleNotifications = toggleNotifications;
window.closeNotifications = closeNotifications;

