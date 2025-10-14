

/* FOOTER TIME UPDATE */
function updateLundTime() {
    const options = { 
        timeZone: 'Europe/Stockholm',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const now = new Date();
    document.getElementById('lund-time').textContent = now.toLocaleTimeString('en-US', options);
}

updateLundTime();
setInterval(updateLundTime, 60000);