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
    document.getElementById("signInButton").onclick = () => window.location.href = ("https://discord.com/api/oauth2/authorize?client_id=1116884853967814676&redirect_uri=https%3A%2F%2Fwoomy-api.glitch.me%2FdiscordOauth&response_type=code&scope=identify")
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


    window.servers = (() => {
        fetch("https://woomy-api.glitch.me/allServers").then(res => res.json()).then((data) => {
            data = data.data
            window.servers = data
            fetch("https://matchmaker.api.rivet.gg/v1/lobbies/list", {}).then(res => res.json()).then((data) => {
                window.lobbies = data.lobbies
                window.preloadsDoneCooking = true
            }).catch((err) => {
                console.error(err)
                alert("Failed to load servers, an update might have just released, you are getting rate limitted, or the rivet API is down. Please wait a bit and try reloading.")
            })
        }).catch((err) => {
            console.error(err)
            alert("Failed to find the servers, the woomy API might be down (let a developer know). But first, please try reloading the page!")
        })
    })()

    let interval = setInterval(async function () {
        if (window.gameStarted) {
            clearInterval(interval)
            return
        }
        try {
            await fetch("https://matchmaker.api.rivet.gg/v1/lobbies/list", {}).then(res => res.json()).then((data) => {
                window.lobbies = data.lobbies
            })
        } catch (err) {}
    }, 15000)
})();
async function getFullURL(data, ws) {
    let res = null
    if (ws) {
        try {
            if (!isLocal) {
                let {
                    RivetClient
                } = await import("./rivet-api.js")
                let client = new RivetClient({})
                if (data[0]) {
                    res = await client.matchmaker.lobbies.join({
                        lobbyId: data[0]
                    })
                } else if (data[1].rivetGamemode !== undefined) {
                    res = await client.matchmaker.lobbies.find({
                        gameModes: [data[1].rivetGamemode]
                    })
                } else {
                    alert("Error with preloading fullURL, rivet connection")
                }
            }
            window.rivetLobby = isLocal ? "0" : res.lobby.lobbyId
            window.rivetPlayerToken = isLocal ? "0" : res.player.token
            window.rivetServerFound = true
        } catch (err) {
            console.error(err)
            alert("The server you are trying to join is most likely full, you are at the ip limit, or an error occured, sorry! Please wait a bit then try again.")
        }
        return isLocal ? "ws://localhost:3001/?" : (`ws${window.location.protocol==="https:" ? "s" : ""}://${res.ports["default"].host}/?`)
    } else {
        return isLocal ? "http://localhost:3001/" : (`http${window.location.protocol==="https:" ? "s" : ""}://${window.location.hostname}${!window.location.port ? "/" : `:${window.location.port}/`}`);
    }
}
