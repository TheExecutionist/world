const isLocal = window.location.hostname === "localhost";
const isBeta = window.location.hostname === "beta.woomy.app";
const isEvent = window.location.hostname === "event.woomy.app";
(function () {
    try {
        if (!["localhost", "", "woomy-arras.netlify.app", "woomy-arras.xyz", "www.woomy-arras.xyz", "development.woomy-arras.xyz", ".rivet.gg"].includes(location.hostname)) {
            //    location.href = "https://woomy-arras.xyz/";
        }

        function loadFromStorage() {
            return (localStorage.getItem("popups") || "").split(",");
        }

        window.markAsRead = function markAsRead(item) {
            localStorage.setItem("popups", [...loadFromStorage(), item].join(","));
        }

        window.closePopup = function closePopup(item) {
            document.getElementById("mainWrapper").removeChild(document.getElementById(item));
        }

        function postAlert(alert) {
            if (loadFromStorage().includes(alert.name)) {
                return;
            }
            console.log(alert);
            const popup = document.createElement("div");
            popup.classList.add("popup");
            popup.id = alert.name;
            popup.innerHTML += `<span>${alert.title}</span><br/>${alert.text}<br/><button onclick="closePopup('${alert.name}');">Close</button><button onclick="markAsRead('${alert.name}');closePopup('${alert.name}');">Mark As Read</button><br/><span class="small">${new Date(alert.timeStamp)}</span>`;
            document.getElementById("mainWrapper").appendChild(popup);
        }
        //fetch("//pine-mint-smartphone.glitch.me/announcements.json").then(r => r.json()).then(json => json.announcements.forEach(postAlert));

        // Do screen size adjustment
        let element = document.getElementById("mainWrapper");
        let scalval = 130; ///Android|webOS|iPhone|iPad|iPod|BlackBerry|android|mobi/i.test(navigator.userAgent) ? 150 : 120;
        function adjust() {
            if (navigator.userAgent.search("Firefox") === -1) element.style.zoom = `${Math.round(Math.min(window.innerWidth / 1920, window.innerHeight / 1080) * scalval)}%`;
        }
        setInterval(adjust, 25);
        adjust();

        // Load ads
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.log("Error with preloads!");
        console.error(e)
    }

    // Load ad
    const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    try {
        fetch(new Request(googleAdUrl)).catch(_ => window.adBlockEnabled = true)
    } catch (e) {
        window.adBlockEnabled = true
    }

    let adInterval = setInterval(() => {
        let adBox = document.getElementById("bottomPageAd")
        if (!adBox) {
            clearInterval(adInterval)
            return
        }
        if (adBox.getAttribute("data-ad-status") !== "filled" || adBox.getAttribute("data-ad-status") !== "done") {
            adBox.style.backgroundImage = "url('./resources/ULTRAKILL.gif')"
            adBox.title = "Advertisement"
            adBox.onclick = () => {
                window.open("https://store.steampowered.com/app/1229490/ULTRAKILL/", "_blank")
            }
        } else {
            adBox.style.backgroundImage = ""
            adBox.style.onclick = () => {}
            clearInterval(adInterval)
            return
        }
    }, 300)

    /// Discord sign in ///
    // Register token
    let code = new URLSearchParams(window.location.search).get("code")
    if (code) {
        localStorage.setItem("discordCode", code);
        window.location.replace(isLocal ? "http://localhost:3001" : isBeta ? "https://beta.woomy.app" : isEvent ? "https://event.woomy.app" : "https://woomy.app/")
        return;
    }

    // Button onclicks
    document.getElementById("signInButton").onclick = () => window.location.href = ("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    document.getElementById("signInOut").onclick = () => {
        localStorage.removeItem("discordCode")
        window.location.reload()
    }

    // Do the sign in if its saved
    let savedCode = localStorage.getItem("discordCode")
    if (savedCode) {
        fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: "Bearer " + savedCode,
            },
        }).then((res) => res.json()).then((userData) => {
            if (userData.code != undefined) {
                localStorage.removeItem("discordCode")
                window.location.reload()
                return
            };
            document.getElementById("signInButton").onclick = () => {}
            document.getElementById("signInButtonImage").src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`
            document.getElementById("signInButtonText").innerHTML = userData.global_name
            document.getElementById("signInOut").style.display = "initial"
        }).catch(err => console.error(err))
    }

    window.servers = [
        { rivetGamemode: "a", serverGamemode: "Free For All", ip: window.location.hostname, loadData: !0, secure: !0, port: -1, game_mode_id: 0, region_id: "Glitch" }
    ]
    window.lobbies = [
        { rivetGamemode: "a", serverGamemode: "Free For All", ip: window.location.hostname, loadData: !0, secure: !0, port: -1, game_mode_id: 0, region_id: "Glitch" }
    ]
    window.lobbies.forEach(server => {
        //if (server.loadData) {
            let url = `${server.secure ? "https" : "http"}://${server.ip}${server.port === -1 ? "" : `:${server.port}`}/pingData.json`
            fetch(url).then(response => response.json().then(json => {
                server.id = "server_" + server.name;
                server.serverGamemode = json.mode;
                server.total_player_count = json.players;
                server.maxPlayers = json.connectionLimit;
                window.loadedServerData = true;
            }).catch(error => {
                console.error(error);
                //servers = servers.filter(server => server.name !== this.name);
            }));
    })
    window.servers.forEach(server => {
        if (server.loadData) {
            let url = `${server.secure ? "https" : "http"}://${server.ip}${server.port === -1 ? "" : `:${server.port}`}/pingData.json`
            fetch(url).then(response => response.json().then(json => {
                server.id = "server_" + server.name;
                server.serverGamemode = json.mode;
                server.total_player_count = json.players;
                server.maxPlayers = json.connectionLimit;
                window.loadedServerData = true;
            }).catch(error => {
                console.error(error);
                //servers = servers.filter(server => server.name !== this.name);
            }));
        }
         
    })

})();
async function getFullURL(data, ws) {
    return `wss://${window.location.hostname}/?`
}
async function getTheURL(url) {
    return `wss://${url}/?`
}