username = document.getElementById("username");

async function login() {
    let res = await fetch('http://localhost:3000/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value
        })
    });
    res = await res.json();
    window.location.href = `http://localhost:5173/HTML/multiplayer.html?username=${username.value}`;
}