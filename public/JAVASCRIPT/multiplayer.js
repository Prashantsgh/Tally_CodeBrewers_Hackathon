$("#join-lobby").click(()=>{
    // let url = "http://localhost:3000/;
    let mode = $('input[name="mode"]:checked').val();
    $('body').load("lobby.html", ()=>{
        let lobby = {};
        lobby.startTime = Date.now();
        setupLobby(lobby);
    });
});

function setupLobby(lobbyDetails){
    TIME_LIMIT = 60 + lobbyDetails.startTime - Date.now();
    setupTimer();
}
