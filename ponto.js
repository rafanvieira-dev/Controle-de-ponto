const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
if(!loggedUser) window.location = 'index.html';

document.getElementById('user-name').textContent = loggedUser.username;

const currentTimeEl = document.getElementById('current-time');
const currentDateEl = document.getElementById('current-date');
const historyTable = document.getElementById('history-table');
const clockInBtn = document.getElementById('clock-in-btn');
const clockOutBtn = document.getElementById('clock-out-btn');

let history = JSON.parse(localStorage.getItem(`${loggedUser.username}-history`)) || [];

function updateClock(){
    const now = new Date();
    currentTimeEl.textContent = now.toLocaleTimeString('pt-BR');
    currentDateEl.textContent = now.toLocaleDateString('pt-BR');
}

setInterval(updateClock,1000);
updateClock();

function renderHistory(){
    historyTable.innerHTML = '';
    history.forEach(h=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${h.time}</td><td>${h.type}</td>`;
        historyTable.appendChild(tr);
    });
}

function register(type){
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR');
    history.push({type,time});
    localStorage.setItem(`${loggedUser.username}-history`, JSON.stringify(history));
    renderHistory();
}

clockInBtn.addEventListener('click',()=>register('Entrada'));
clockOutBtn.addEventListener('click',()=>register('Saída'));

renderHistory();
