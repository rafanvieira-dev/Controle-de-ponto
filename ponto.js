const user = JSON.parse(localStorage.getItem('loggedUser'));
if (!user) window.location.href = 'index.html';

document.getElementById('user-name').textContent = user.name;

const clockInBtn = document.getElementById('clock-in-btn');
const clockOutBtn = document.getElementById('clock-out-btn');
const logoutBtn = document.getElementById('logout-btn');

const currentTime = document.getElementById('current-time');
const currentDate = document.getElementById('current-date');
const workedHours = document.getElementById('worked-hours');
const dailyBalance = document.getElementById('daily-balance');
const historyTable = document.getElementById('history-table');
const workdayHours = document.getElementById('workday-hours');

let pontos = user.pontos || [];
const WORKDAY_MS = 12*60*60*1000; // 12h descontando 1h almoço

function updateClock() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit', second:'2-digit'});
    currentDate.textContent = now.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', year:'numeric'});
    setTimeout(updateClock, 1000);
}

function savePonto(type) {
    const now = new Date();
    pontos.push({ type, time: now.getTime() });
    user.pontos = pontos;
    updateUserStorage();
    renderHistory();
}

function updateUserStorage() {
    let users = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    users = users.map(u => u.email === user.email ? user : u);
    localStorage.setItem('funcionarios', JSON.stringify(users));
}

function renderHistory() {
    const today = new Date().toLocaleDateString('pt-BR');
    const todayPoints = pontos.filter(p => new Date(p.time).toLocaleDateString('pt-BR') === today);
    historyTable.innerHTML = '';
    let totalMs = 0;

    for (let i = 0; i < todayPoints.length; i++) {
        const p = todayPoints[i];
        const tr = document.createElement('tr');
        const time = new Date(p.time).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
        tr.innerHTML = `<td>${time}</td><td>${p.type === 'in' ? 'Entrada' : 'Saída'}</td>`;
        historyTable.appendChild(tr);

        if (i % 2 === 1 && todayPoints[i-1].type==='in' && p.type==='out') {
            totalMs += p.time - todayPoints[i-1].time;
        }
    }

    if (todayPoints.length >= 4) totalMs -= 60*60*1000;

    workedHours.textContent = formatTime(totalMs);
    const balanceMs = totalMs - WORKDAY_MS;
    dailyBalance.textContent = formatTime(balanceMs);
    dailyBalance.style.color = balanceMs >=0 ? 'green' : 'red';
}

function formatTime(ms){
    const s = ms < 0 ? '-' : '';
    ms = Math.abs(ms);
    const h = Math.floor(ms/3600000);
    const m = Math.floor((ms%3600000)/60000);
    return `${s}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

clockInBtn.addEventListener('click', ()=>savePonto('in'));
clockOutBtn.addEventListener('click', ()=>savePonto('out'));
logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
});

updateClock();
renderHistory();
