// App State
let currentUser = null;
let userData = {
mindfulnessCount: 0,
journalCount: 0,
activeDays: 1,
mood: null,
intentions: [],
journalEntries: [],
safetyPlan: ‘’
};

// Initialize app
document.addEventListener(‘DOMContentLoaded’, function() {
checkAuth();
initializeEventListeners();
loadQuotes();
});

// Authentication Functions
function initializeEventListeners() {
document.getElementById(‘login-form’).addEventListener(‘submit’, handleLogin);
document.getElementById(‘signup-form’).addEventListener(‘submit’, handleSignup);
}

function handleLogin(e) {
e.preventDefault();
const email = document.getElementById(‘login-email’).value;
const password = document.getElementById(‘login-password’).value;

```
// Simulate login (in production, this would call an API)
const users = JSON.parse(localStorage.getItem('users') || '[]');
const user = users.find(u => u.email === email && u.password === password);

if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    loadUserData();
    showApp();
    showNotification('Welcome back, ' + user.name + '!', 'success');
} else {
    showNotification('Invalid email or password', 'error');
}
```

}

function handleSignup(e) {
e.preventDefault();
const name = document.getElementById(‘signup-name’).value;
const email = document.getElementById(‘signup-email’).value;
const password = document.getElementById(‘signup-password’).value;
const confirm = document.getElementById(‘signup-confirm’).value;

```
if (password !== confirm) {
    showNotification('Passwords do not match', 'error');
    return;
}

// Check if user already exists
const users = JSON.parse(localStorage.getItem('users') || '[]');
if (users.find(u => u.email === email)) {
    showNotification('Email already registered', 'error');
    return;
}

// Create new user
const newUser = { 
    id: Date.now(), 
    name, 
    email, 
    password,
    createdAt: new Date().toISOString()
};
users.push(newUser);
localStorage.setItem('users', JSON.stringify(users));

currentUser = newUser;
localStorage.setItem('currentUser', JSON.stringify(newUser));
initializeUserData();
showApp();
showNotification('Account created successfully!', 'success');
```

}

function toggleAuth() {
const loginForm = document.getElementById(‘login-form’);
const signupForm = document.getElementById(‘signup-form’);
const authTitle = document.getElementById(‘auth-title’);

```
if (loginForm.classList.contains('hidden')) {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    authTitle.textContent = 'Welcome Back';
} else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    authTitle.textContent = 'Create Account';
}
```

}

function checkAuth() {
const user = JSON.parse(localStorage.getItem(‘currentUser’));
if (user) {
currentUser = user;
loadUserData();
showApp();
}
}

function showApp() {
document.getElementById(‘auth-container’).classList.add(‘hidden’);
document.getElementById(‘app-container’).classList.remove(‘hidden’);
document.getElementById(‘user-name’).textContent = ’Hello, ’ + currentUser.name;
displayDailyQuote();
displayMotivationalQuote();
displayAffirmation();
displayJournalPrompt();
loadJournalHistory();
updateStats();
}

function logout() {
localStorage.removeItem(‘currentUser’);
currentUser = null;
document.getElementById(‘auth-container’).classList.remove(‘hidden’);
document.getElementById(‘app-container’).classList.add(‘hidden’);
showNotification(‘Logged out successfully’, ‘success’);
}

// User Data Management
function initializeUserData() {
userData = {
mindfulnessCount: 0,
journalCount: 0,
activeDays: 1,
mood: null,
intentions: [],
journalEntries: [],
safetyPlan: ‘’
};
saveUserData();
}

function loadUserData() {
const key = ‘userData_’ + currentUser.id;
const stored = localStorage.getItem(key);
if (stored) {
userData = JSON.parse(stored);
} else {
initializeUserData();
}
}

function saveUserData() {
const key = ‘userData_’ + currentUser.id;
localStorage.setItem(key, JSON.stringify(userData));
}

function updateStats() {
document.getElementById(‘mindfulness-count’).textContent = userData.mindfulnessCount;
document.getElementById(‘journal-count’).textContent = userData.journalCount;
document.getElementById(‘active-days’).textContent = userData.activeDays;
}

// Tab Navigation
function showTab(tabName) {
// Hide all tabs
document.querySelectorAll(’.tab-content’).forEach(tab => {
tab.classList.remove(‘active’);
});

```
// Remove active class from all buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
});

// Show selected tab
document.getElementById(tabName + '-tab').classList.add('active');

// Add active class to clicked button
event.target.classList.add('active');
```

}

// Crisis Banner
function closeCrisisBanner() {
document.getElementById(‘crisis-banner’).classList.add(‘hidden’);
}

// Mood Tracking
function setMood(mood) {
userData.mood = mood;
saveUserData();

```
// Visual feedback
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.remove('selected');
});
event.target.classList.add('selected');

// Feedback messages
const messages = {
    great: "That's wonderful! Keep riding that positive wave! 🌊",
    good: "Great to hear! Hope your day continues well! ✨",
    okay: "Every day has its ups and downs. You're doing fine. 💙",
    sad: "It's okay to feel sad. Remember, this feeling is temporary. 💜",
    stressed: "Take a deep breath. Check out our mindfulness exercises. 🌬️"
};

document.getElementById('mood-feedback').textContent = messages[mood];
```

}

// Quotes and Affirmations
const motivationalQuotes = [
“Taking care of your mental health is an act of courage, not weakness.”,
“You don’t have to control your thoughts. You just have to stop letting them control you.”,
“Healing doesn’t mean the damage never existed. It means it no longer controls your life.”,
“Your mental health is a priority, not a luxury.”,
“It’s okay to not be okay. What’s important is that you’re trying.”,
“Small steps are still progress.”,
“You are stronger than you know, braver than you feel, and more loved than you think.”,
“Mental health is just as important as physical health. Take care of both.”,
“Recovery is not a race. You don’t have to feel guilty if it takes you longer than you thought.”,
“Your story isn’t over yet. Keep going.”
];

const affirmations = [
“I am worthy of love, peace, and happiness.”,
“I choose to focus on what I can control.”,
“I am strong enough to handle whatever comes my way.”,
“My feelings are valid, and it’s okay to express them.”,
“I am making progress, even when it doesn’t feel like it.”,
“I deserve to take time for self-care.”,
“I am not defined by my struggles.”,
“I have the power to create positive change in my life.”,
“I am resilient and capable.”,
“I trust myself to make good decisions for my wellbeing.”
];

const journalPrompts = [
“What are three things you’re grateful for today?”,
“How did you show yourself kindness today?”,
“What’s one challenge you faced and how did you handle it?”,
“Write about a moment when you felt proud of yourself.”,
“What does self-care mean to you?”,
“Describe a place where you feel completely at peace.”,
“What are your goals for this week?”,
“Who in your life makes you feel supported? How?”,
“What’s one thing you learned about yourself recently?”,
“How do you want to feel tomorrow?”
];

function displayDailyQuote() {
const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
document.getElementById(‘daily-quote’).textContent = randomQuote;
}

function displayMotivationalQuote() {
const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
document.getElementById(‘motivational-quote’).textContent = randomQuote;
}

function generateAffirmation() {
const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
document.getElementById(‘affirmations-list’).textContent = randomAffirmation;
}

function displayAffirmation() {
generateAffirmation();
}

function displayJournalPrompt() {
const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
document.getElementById(‘journal-prompts’).textContent = randomPrompt;
}

function getNewPrompt() {
displayJournalPrompt();
}

function loadQuotes() {
displayDailyQuote();
displayMotivationalQuote();
displayAffirmation();
}

// Mindfulness Exercises
const exercises = {
breathing: {
title: “Deep Breathing Exercise”,
duration: 300, // 5 minutes in seconds
content: `<p><strong>Let's practice deep breathing together.</strong></p> <ol style="text-align: left; line-height: 2;"> <li>Find a comfortable seated position</li> <li>Close your eyes or soften your gaze</li> <li>Breathe in slowly through your nose for 4 counts</li> <li>Hold your breath for 4 counts</li> <li>Exhale slowly through your mouth for 6 counts</li> <li>Repeat this cycle</li> </ol> <p>Focus on the sensation of breath entering and leaving your body. If your mind wanders, gently bring it back to your breath.</p>`
},
‘body-scan’: {
title: “Body Scan Meditation”,
duration: 600, // 10 minutes
content: `<p><strong>Progressive body relaxation</strong></p> <ol style="text-align: left; line-height: 2;"> <li>Lie down or sit comfortably</li> <li>Close your eyes and take three deep breaths</li> <li>Starting with your toes, notice any sensations</li> <li>Slowly move your attention up through your body</li> <li>Notice each part: feet, legs, hips, stomach, chest, arms, neck, head</li> <li>If you notice tension, breathe into that area</li> <li>Imagine releasing tension with each exhale</li> </ol> <p>Take your time with each body part. There's no rush.</p>`
},
gratitude: {
title: “Gratitude Practice”,
duration: 180, // 3 minutes
content: `<p><strong>Cultivating appreciation</strong></p> <p style="text-align: left; line-height: 2;"> Take a moment to think about:<br><br> • Three things you're grateful for today<br> • A person who has positively impacted your life<br> • A challenge that helped you grow<br> • Something in nature that brings you peace<br> • A simple pleasure you often overlook<br><br> Write these down or simply hold them in your mind. Feel the warmth of gratitude in your heart. </p>`
},
visualization: {
title: “Peaceful Place Visualization”,
duration: 420, // 7 minutes
content: `<p><strong>Creating your mental sanctuary</strong></p> <p style="text-align: left; line-height: 2;"> Close your eyes and imagine a place where you feel completely safe and at peace. It could be:<br><br> • A beach with gentle waves<br> • A quiet forest<br> • A cozy room<br> • Anywhere that brings you calm<br><br> Now imagine yourself there:<br> • What do you see?<br> • What do you hear?<br> • What do you smell?<br> • How does it feel?<br><br> Stay in this peaceful place for a few minutes. Know that you can return here anytime you need to. </p>`
}
};

let timerInterval;
let timeRemaining;

function startExercise(exerciseType) {
const exercise = exercises[exerciseType];
document.getElementById(‘exercise-title’).textContent = exercise.title;
document.getElementById(‘exercise-content’).innerHTML = exercise.content;
document.getElementById(‘exercise-player’).classList.remove(‘hidden’);
timeRemaining = exercise.duration;
updateTimerDisplay();
}

function closeExercise() {
document.getElementById(‘exercise-player’).classList.add(‘hidden’);
if (timerInterval) {
clearInterval(timerInterval);
}
}

function startTimer() {
const button = document.getElementById(‘start-timer-btn’);

```
if (button.textContent === 'Start') {
    button.textContent = 'Pause';
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            button.textContent = 'Complete';
            userData.mindfulnessCount++;
            saveUserData();
            updateStats();
            showNotification('Exercise complete! Great job! 🎉', 'success');
        }
    }, 1000);
} else if (button.textContent === 'Pause') {
    clearInterval(timerInterval);
    button.textContent = 'Resume';
} else if (button.textContent === 'Resume') {
    button.textContent = 'Pause';
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            button.textContent = 'Complete';
            userData.mindfulnessCount++;
            saveUserData();
            updateStats();
            showNotification('Exercise complete! Great job! 🎉', 'success');
        }
    }, 1000);
}
```

}

function updateTimerDisplay() {
const minutes = Math.floor(timeRemaining / 60);
const seconds = timeRemaining % 60;
document.getElementById(‘timer-display’).textContent =
`${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Intentions
function saveIntention() {
const input = document.getElementById(‘intentions-input’);
const intention = input.value.trim();

```
if (intention) {
    const intentionObj = {
        text: intention,
        date: new Date().toLocaleDateString()
    };
    userData.intentions.push(intentionObj);
    saveUserData();
    displayIntentions();
    input.value = '';
    showNotification('Intention saved!', 'success');
}
```

}

function displayIntentions() {
const container = document.getElementById(‘saved-intentions’);
container.innerHTML = ‘’;

```
userData.intentions.slice(-5).reverse().forEach(intention => {
    const div = document.createElement('div');
    div.className = 'intention-item';
    div.innerHTML = `
        <div class="intention-date">${intention.date}</div>
        <div>${intention.text}</div>
    `;
    container.appendChild(div);
});
```

}

// Journal
function saveJournalEntry() {
const title = document.getElementById(‘journal-title’).value.trim();
const content = document.getElementById(‘journal-entry’).value.trim();

```
if (!title || !content) {
    showNotification('Please add both title and content', 'error');
    return;
}

const entry = {
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleString()
};

userData.journalEntries.unshift(entry);
userData.journalCount++;
saveUserData();
updateStats();
clearJournal();
loadJournalHistory();
showNotification('Journal entry saved!', 'success');
```

}

function clearJournal() {
document.getElementById(‘journal-title’).value = ‘’;
document.getElementById(‘journal-entry’).value = ‘’;
}

function loadJournalHistory() {
const container = document.getElementById(‘journal-history’);
container.innerHTML = ‘’;

```
if (userData.journalEntries.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #718096;">No journal entries yet. Start writing!</p>';
    return;
}

userData.journalEntries.slice(0, 10).forEach(entry => {
    const div = document.createElement('div');
    div.className = 'journal-entry-item';
    div.innerHTML = `
        <div class="journal-entry-header">
            <div class="journal-entry-title">${entry.title}</div>
            <div class="journal-entry-date">${entry.date}</div>
        </div>
        <div class="journal-entry-content">${entry.content}</div>
    `;
    container.appendChild(div);
});
```

}

// Safety Plan
function saveSafetyPlan() {
const plan = document.getElementById(‘safety-plan’).value.trim();
if (plan) {
userData.safetyPlan = plan;
saveUserData();
showNotification(‘Safety plan saved!’, ‘success’);
}
}

// Load safety plan if exists
document.addEventListener(‘DOMContentLoaded’, function() {
if (userData.safetyPlan) {
document.getElementById(‘safety-plan’).value = userData.safetyPlan;
}
});

// Notification System
function showNotification(message, type = ‘info’) {
const notification = document.createElement(‘div’);
notification.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px 25px; background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'}; color: white; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 9999; animation: slideIn 0.3s ease;`;
notification.textContent = message;
document.body.appendChild(notification);

```
setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
}, 3000);
```

}

// Add CSS for notifications
const style = document.createElement(‘style’);
style.textContent = `@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }`;
document.head.appendChild(style);
