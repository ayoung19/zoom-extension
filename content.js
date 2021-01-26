// default speed and the corresponding option element that will be set later
let normal = {
    speed: 1.0,
    option: null
};
// list of playback speeds
let speeds = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
// video element
let video = document.querySelector("video");
// zoom playback speed menu ul element
let menu = document.querySelector("#vjs-pop-menu-3");
// array to store the created option elements that will be injected to the menu later
let options = [];

// mutation observer that checks if zoom playback speed menu ul element is loaded
let observer = new MutationObserver(function(mutations) {
    // once it is
    if ((menu = document.querySelector("#vjs-pop-menu-3")) && (video = document.querySelector("video"))) {
        // start the main script
        init();
        // stop the observer
        observer.disconnect();
        return;
    }
});

// start the observer previously defined
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});

// main script
function init() {
    // create a keydown listener on entire document
    document.addEventListener("keydown", function (e) {
        // if ctrl and alt aren't pressed, trigger hotkeys
        if (!e.ctrlKey && !e.altKey) {
            triggerHotkey(e.code);
        }
    });

    // iterate through list of playback speeds to inject
    for (let speed of speeds) {
        // create the option element
        let option = createLi(speed);
        // push to options list
        options.push(option);
        // if default speed, set the normal option
        if (speed == normal.speed) {
            normal.option = option;
        }
    }

    // replace all children in menu with elements in options list
    menu.replaceChildren(...options);
    // change the speed to the normal speed
    changeSpeed(normal.speed, normal.option);
}

// trigger hotkey based on incoming keycode
function triggerHotkey(code) {
    switch (code) {
        // if the key is spacebar or k, press the play button
        case "Space":
        case "KeyK":
            document.querySelector(".vjs-play-control").click();
            break;
        // if key is f, press the fullscreen button
        case "KeyF":
            document.querySelector(".vjs-fullscreen-toggle-control-button").click();
            break;
        // if key is f, press the mute button
        case "KeyM":
            document.querySelector(".vjs-mute-control").click();
            break;
        // else, j/l for -/+ 10s and left/right for -/+ 5s
        case "KeyJ":
            video.currentTime -= 10;
            break;
        case "KeyL":
            video.currentTime += 10;
            break;
        case "ArrowLeft":
            video.currentTime -= 5;
            break;
        case "ArrowRight":
            video.currentTime += 5;
            break;
    }
}

// create an option element given a speed
function createLi(speed) {
    // clone the first li tag in menu
    let li = menu.querySelector("li").cloneNode(true);
    // create the text of the span
    let text = document.createTextNode(speed == normal.speed ? "Normal" : `${speed}x`);

    // remove id attribute of the clone, as having same id is bad
    li.removeAttribute("id");
    // remove aria-checked attribute since i don't want to update this every time
    li.removeAttribute("aria-checked");
    // replace span text with previously defined text
    li.querySelector("span").replaceChildren(text);

    // add click listener to li tag to change the speed accordingly
    li.addEventListener("click", function () {
        changeSpeed(speed, this);
    });

    return li;
}

// change the playback speed and update styling of option element
function changeSpeed(speed, li) {
    // set the playback speed of video
    video.playbackRate = speed;

    // iterate through options of menu and unselect all
    for (let option of menu.children) {
        option.className = "";
        option.querySelector("i").style.display = "none";
    }

    // select the correct option element
    li.className = "selected";
    li.querySelector("i").style.display = "block";

    // update the button text
    let text = document.createTextNode(speed == normal.speed ? "Speed" : `${speed}x`);
    document.querySelector(".vjs-speed-control button").replaceChildren(text);

    // hide menu
    menu.parentElement.style.display = "none";
}