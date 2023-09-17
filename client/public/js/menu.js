const popup = document.querySelector(".popup");
const popupTitle = popup.querySelector("h1");
const popupMessage = popup.querySelector("span");

/*function displayMission() {
    popup.style.display = "block";
    popupTitle.textContent = "The Mission/Purpose of This:";
    popupMessage.textContent = "This revival project is the result of many people wanting a game to play, but it being deleted. This isn't woomy.io, and will never measure up to that level. However, it is supposed to be a space where people can hang out and play the game.";
}

function displayDisclaimer() {
    popup.style.display = "block";
    popupTitle.textContent = "DISCLAIMER:";
    popupMessage.textContent = "I do not own the code. I did not make it. The code is a result of core files from August 2020 combined with files from the arras.io source in order to make this. Hellcat and Clarise (The original devs) made the game. Not me. I just got it to run so you can play it.";
}*/

function displayFirefoxSwitch() {
    popup.style.display = "block";
    popupTitle.textContent = "Dear Firefox User:";
    popupMessage.textContent = "We highly recommend that you do not play this game with the firefox browser. The game functions and performs much better on a Chromium based browser, such as Google Chrome, Opera GX or Microsoft Edge. You may play using Firefox, just be aware that multiple issues may manifest themselves.";
}

function displayCanvasNotSupported() {
    popup.style.display = "block";
    popupTitle.textContent = "Warning:";
    popupMessage.textContent = "Your browser does not support canvas. Please switch to a Chromium based browser, such as Google Chrome, Opera GX or Microsoft Edge.";
}
if (navigator.userAgent.search("Firefox") !== -1) displayFirefoxSwitch();

/* TIERS // fyi names atm mean jack
* Copper: 1
* Silver: 2
* Gold: 3
* Diamond: 4
* Mythic: 5 // REMOVED 
*/

//oh my god get blah blah blah blah blah blah blah blah blah balh blahikoswgrikoudejghnudergioujreiunjhgsewikuynjhrsdegikunjhsdrfigkoufhjnsewrikounjhlgfsewrikounjhgfsdikoujgiousdjgw

/*fetch(getFullURL(servers[selectedServer], false) + "json/achievements.json").then(response => response.json()).then(json => {
    for (let achievement of json) {
        let holder = document.createElement('div');
        let title = document.createElement("h1");
        let description = document.createElement("span");

        title.innerText = achievement.title;
        description.innerText = achievement.description;

        holder.classList.add('achievementsItem');
        holder.appendChild(title);
        holder.appendChild(description);

        holder.style.backgroundColor = "#c38a50";
        holder.style.borderColor = "#9b6c3e";

        document.getElementById("achievementsDisplay").appendChild(holder);
    };
});*/

function displayHowToPlay() {
    popup.style.display = "block";
    popupTitle.textContent = "How to play:";
    popupMessage.textContent = "Woomy has a wide range of different features and mechanics. The basics of movement involve using the WASD keys, which make your tank move around. You use your mouse to control where your target location is, which your tank will face torwards. To fire your tank, you can press down on the left button of your mouse. You can use E and C keys for AutoFire and AutoSpin. Your goal is to kill other players and AIs, while trying to keep your own tank alive. Killing entities in Woomy gives you score. People with the most score are shown on the leaderboard. Polygons (or Food) give score aswell. Most tanks that branch from the director branch work differently, as they have drones instead of bullets. Drones are controlled by holding down your mouse and using your cursor to controll where they go to on your screen. You can also not hold down on the mouse button, to allow them to roam freely around you and protect you. Not all drones are controllable. There is alot more to this game, but I am running out of screenspace. Go ahead and play the game yourself and lets see what you discover.";
}

function displayAbout() {
    popup.style.display = "block";
    popupTitle.textContent = "About Woomy";
    popupMessage.textContent = "Woomy is A fan-made clone of diep.io, and an unofficial sequel to arras.io! Along with over 1.7k tanks, this server contains some very interesting additions...";
}

function displayAchievements() {
    document.getElementsByClassName('achievementsHolder')[0].style.display = 'block';
};

let canvas = document.createElement("canvas");
if (!canvas || !canvas.getContext) displayCanvasNotSupported();
if (canvas) canvas.remove();

let clicked = 0;
let div = document.getElementById("startMenuSlidingTrigger");
let slide = document.getElementsByClassName("slider");
div.addEventListener('click', function () {
    clicked = !clicked;
    for (let i = 0; i < slide.length; i++) slide[i].style.top = `${-280 * clicked}px`;
    if (clicked === 3) {
        div.innerHTML = '<h3 class="nopadding">🡿 Extra Stuff 🡾</h3>';
    } else if (!clicked) {
        div.innerHTML = '<h3 class="nopadding">🡿 Extra Stuff 🡾</h3>';
    } else {
        div.innerHTML = '<h3 class="nopadding">🢄 Extra Stuff 🡽</h3>';
    };
});

// Cookie manager
/*class cookiemanager {
    constructor() {

    }

    get(key) {
        document.cookie.split(";").filter(e=>e.includes(key))[0].split("=")[1]
    }

    set(key, value) {
        document.cookie = `${key}:${value.split(";").join("\\;")}`;
    }

    remove(key) {

    }

    getAll() {
        return document.cookie;
    }

    clear() {
        document.cookie = "";
        return true;
    }
}*/