username = document.getElementById("username");

async function login() {
    try {
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
        console.log(res)
        if (res.username === username.value)
            window.open(`http://localhost:5173/HTML/multiplayer.html?username=${username.value}`, "_target");
        else
            alert("Username already exists!");
    } catch (e) {
        console.error("Error in creating user: ", e);
    }
}