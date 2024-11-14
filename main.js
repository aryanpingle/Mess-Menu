"use strict";

// User configuration
var dailyItems = {
    B: [
        "Tea + Coffee",
        "Boiled Egg / Omelette",
        "Bread + Butter + Jam",
        "Bournvita",
        "Hot + Cold Milk",
        "Cornflakes",
    ],
    L: [],
    S: ["Tea + Coffee"],
    D: [],
};

// Global variables
let selected_day = 0;
let menu = null;

function setupPWABanner() {
    document.querySelector(".pwa-install-banner").style.display = "block";
    const ua = navigator.userAgent;
    let install_text = "";
    if (
        [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod",
        ].includes(navigator.platform)
    ) {
        // iOS + not Safari
        install_text = "[In Safari] Share → Add to Home Screen";
    } else if (ua.match(/edg/i)) {
        // Edge
        install_text = "Options (≡) → Add to phone";
    } else if (ua.match(/samsungbrowser/i)) {
        // Fkin Samsung Internet
        install_text = "Click on the download button (near the URL)";
    } else if (ua.match(/chrome|chromium|crios/i)) {
        // Chrome
        install_text = "Options (⋮) → Install App";
    } else if (ua.match(/firefox|fxios/i)) {
        // Firefox
        install_text = "Options (⋮) → Install App";
    } else if (ua.match(/opr\//i)) {
        // Opera
        install_text = "Options (⋮) → Install App";
    } else {
        // Unknown / Unsupported Browser
        install_text = "Options → Install App";
    }

    document.querySelector("#pwa-install-instructions").innerText =
        install_text;
}

/**
 * Make the document jump to a day's meal based on the current time.
 */
function jumpToMenuPosition() {
    // TODO: Meal times shouldn't be hardcoded

    // Jump to the current time in the day
    const current_hours = new Date().getHours();
    let scrollAmt = -document.querySelector(".day-picker").offsetHeight;
    if (current_hours < 10) {
        // Already at #B
    } else if (current_hours < 14) {
        // Jump to #L
        scrollAmt += document.querySelector("#L").offsetTop;
    } else if (current_hours < 18) {
        // Jump to #S
        scrollAmt += document.querySelector("#S").offsetTop;
    } else if (current_hours < 22) {
        // Jump to #D
        scrollAmt += document.querySelector("#D").offsetTop;
    }
    document.querySelector("#actual-menu").scrollTo(0, scrollAmt);
}

/**
 * Asynchronously load the menu, and update the UI accordingly.
 */
async function loadMenu() {
    menu = await fetch("./menu.json").then((res) => res.json());
    addDailyItemsToMenu();
    initializeMenuUI(selected_day);
    jumpToMenuPosition();
}

// Immediately invoked setup function
(async function setup() {
    loadMenu();

    // PWA Analytics
    if (
        navigator.standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches
    ) {
        gtag("event", "pwa_use", {
            event_category: "engagement",
            value: 1,
        });
    } else {
        setupPWABanner();
    }

    // getDay() returns 0 for Sunday
    // Shift it so that 0 represents Monday
    selected_day = (new Date().getDay() + 6) % 7;

    // Set the current day and select it
    document
        .querySelector(".day-picker")
        .children[selected_day].classList.add(
            "day-choice--today",
            "day-choice--selected"
        );

    // Setup the day choice buttons
    document.querySelectorAll(".day-choice").forEach((day_choice, index) => {
        day_choice.onclick = (event) => {
            if ("vibrate" in navigator) navigator.vibrate(50);

            document
                .querySelector(".day-choice--selected")
                .classList.remove("day-choice--selected");
            day_choice.classList.add("day-choice--selected");
            selected_day = index;
            initializeMenuUI(selected_day);
        };
    });
})()

/**
 * Update the menu shown on screen for the given day.
 *
 * @param {number} dayIndex
 */
function initializeMenuUI(dayIndex) {
    let items = Object.entries(menu)[dayIndex][1];
    for (let [mealName, list] of Object.entries(items)) {
        document
            .getElementById(mealName)
            .querySelector(".menu__items").innerHTML = [
            ...list[0].map(variableItemHTML),
            ...list[1].map(everydayItemHTML),
        ].join("");
    }
}

function variableItemHTML(item_name) {
    return `<div class="menu__item menu__item--variable">${item_name}</div>`;
}

function everydayItemHTML(item_name) {
    return `<div class="menu__item menu__item--everyday">${item_name}</div>`;
}

/**
 * Add daily items to each the meal items of each meal in the menu.
 * Modifies the menu in-place.
 */
function addDailyItemsToMenu() {
    for (let day of Object.keys(menu)) {
        for (let [mealName, items] of Object.entries(menu[day])) {
            let variable_items = items;
            let dailyItemsForMeal = dailyItems[mealName];

            menu[day][mealName] = [variable_items, dailyItemsForMeal];
        }
    }
}
