let normal = {
    speed: 1.0,
    option: null
};
let speeds = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
let menu = document.querySelector("#vjs-pop-menu-3");
let options = [];

let observer = new MutationObserver(function(mutations) {
    if (menu = document.querySelector("#vjs-pop-menu-3")) {
        init();
        observer.disconnect();
        return;
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});

function init() {
    document.addEventListener("keypress", function (e) {
        if (e.code == "Space") {
            document.querySelector(".vjs-play-control").click();
        }
    });

    for (let speed of speeds) {
        let option = createLi(speed);
        options.push(option);
        if (speed == normal.speed) {
            normal.option = option;
        }
    }

    menu.replaceChildren(...options);
    changeSpeed(normal.speed, normal.option);
}

function createLi(speed) {
    let li = menu.querySelector("li").cloneNode(true);
    let text = document.createTextNode(speed == normal.speed ? "Normal" : `${speed}x`);

    li.removeAttribute("id");
    li.removeAttribute("aria-checked");
    li.querySelector("span").replaceChildren(text);

    li.addEventListener("click", function () {
        changeSpeed(speed, this);
    });

    return li;
}

function changeSpeed(speed, li) {
    document.querySelector("video").playbackRate = speed;

    for (let option of menu.children) {
        option.className = "";
        option.querySelector("i").style.display = "none";
    }

    li.className = "selected";
    li.querySelector("i").style.display = "block";

    let text = document.createTextNode(speed == normal.speed ? "Speed" : `${speed}x`);
    document.querySelector(".vjs-speed-control button").replaceChildren(text);

    menu.parentElement.style.display = "none";
}