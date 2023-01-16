const print = console.log
const gid = (id) => document.getElementById(id)
const log = (text, color)=>print(`%c${text}`, `color: black; background-color: ${color}`)
let DEFERRED_INSTALL_PROMPT = null

let selected_day = 0

function setup() {
    // new Date().getDay() returns 1 for Monday, 0/7 for Sunday
    selected_day = (new Date().getDay() + 6) % 7
    
    // Set the current day and select it
    document.querySelector(".day-picker").children[selected_day].classList.add("day-choice--today", "day-choice--selected")
    initialize_menu()

    // Jump to the current time in the day
    const current_hours = new Date().getHours()
    let cumulative = 0
    if(current_hours < 10) {
        // Already at #B
    }
    else if(current_hours < 14) {
        // Jump to #L
        cumulative += document.querySelector("#B").offsetHeight
    }
    else if(current_hours < 18) {
        // Jump to #S
        cumulative += document.querySelector("#B").offsetHeight
        cumulative += document.querySelector("#L").offsetHeight
    }
    else if(current_hours < 22) {
        // Jump to #D
        cumulative += document.querySelector("#B").offsetHeight
        cumulative += document.querySelector("#L").offsetHeight
        cumulative += document.querySelector("#S").offsetHeight
    }
    document.querySelector("#actual-menu").scrollTo(0, cumulative)

    // Setup the day choice buttons
    document.querySelectorAll(".day-choice").forEach((day_choice, index) => {
        day_choice.onclick = event => {
            if("vibrate" in navigator) navigator.vibrate(50)

            document.querySelector(".day-choice--selected").classList.remove("day-choice--selected")
            day_choice.classList.add("day-choice--selected")
            selected_day = index
            initialize_menu()
        }
    })

    if(!!navigator.share) {
        [...document.querySelectorAll(".share_toolbar")].forEach(toolbar => {
            toolbar.querySelector(".share--text").onclick = function(event) {
                initiateShareText(toolbar.getAttribute("data-meal-category-id"))
            }
        })
    }
    else {
        console.error("Device does not support sharing")
    }
}

/**
 * Initiates sharing of the SS of the given meal category
 * @param {string} mealCategoryID 
 */
function initiateShareText(mealCategoryID) {
    let mealCategoryName = {
        "B": "Breakfast",
        "L": "Lunch",
        "S": "Snacks",
        "D": "Dinner"
    }[mealCategoryID.toUpperCase()]

    navigator.share({
        text: generateReadableMenu(mealCategoryID),
        title: `${mealCategoryName} ${new Date().toDateString()}`,
    })
}

function generateReadableMenu(mealCategoryID) {
    let mealCategoryName = {
        "B": "Breakfast",
        "L": "Lunch",
        "S": "Snacks",
        "D": "Dinner"
    }[mealCategoryID]

    let items = []

    let mealCategoryElement = document.querySelector("#" + mealCategoryID)
    mealCategoryElement.querySelectorAll(".menu__item").forEach(item => {
        items.push(item.innerText)
    })

    return `*🍴 ${mealCategoryName.toUpperCase()} 🍴*\n\n` + items.join("\n")
}

function initialize_menu() {
    let items = Object.entries(menu)[selected_day][1]
    for (let [category, list] of Object.entries(items)) {
        document.getElementById(category).querySelector(".menu__items").innerHTML = [...list[0].map(variable_item_html), ...list[1].map(everyday_item_html)].join("")
    }
}

function variable_item_html(item_name) {
    return `<div class="menu__item menu__item--variable">${item_name}</div>`
}

function everyday_item_html(item_name) {
    return `<div class="menu__item menu__item--everyday">${item_name}</div>`
}

let menu = {
    "Monday": {
        "B": "Mix Paratha",
		"L": "Veg Kohlapuri, Soya Chilly, Dal Makhani, Jeera Rice, Chapati, Rassam, Green Salad, Punjabi Lassi, Fryums, Gulab Jamun",
		"S": "Ragda Pattice",
		"D": "Baingan Bharta, Palak / Kadhai Paneer, Chicken / Egg Curry, Seasonal Fruit, Dal Masala, Rice, Chapati, Sambhar, Onion Salad, Veg Raita"
    },
    "Tuesday": {
        "B": "Idli Sambhar",
		"L": "Aloo Jeera, Chhole Amritsari, Dal Fry, Rice, Puri + Chapati, Sambhar, Sirka Onion, Fresh Lime Water, Roasted Papad, Sewai / Rice Kheer",
		"S": "Vada Pav",
		"D": "Veg Jalfrezi Gravy, Bhindi Masala, Yellow Dal, Veg Pulao, Chapati, Rassam, Mix Salad, Curd"
    },
    "Wednesday": {
        "B": "Onion Poha",
		"L": "Aloo Matar Gravy, Black Chana Dry, Dal Masala, Jeera Rice, Chapati, Rassam, Mix Sprout Salad, Curd, Fryums, Rasgulla / Rasmalai",
		"S": "Bhelpuri",
		"D": "Kaddu Masala Dry, Paneer Biryani, Chicken Biryani, Seasonal Fruit, Dal Kolhapuri, Rice, Chapati, Sambhar, Kimchi Salad, Boondi Raita"
    },
    "Thursday": {
        "B": "Puri Bhaji",
		"L": "Veg Kofta Gravy, Cabbage Sabzi Dry, Lasooni Dal, Onion Rice, Chapati, Sambhar, Mix Salad, Tang, Roasted Papad, Boondi",
		"S": "Maggi",
		"D": "Manchurian (semi-dry), Pindi Chana, Lemon Coriander Soup, Veg Fried Rice / Schezwan Noodles, Chapati, Rassam, Tandoori Salad, Curd"
    },
    "Friday": {
        "B": "Medu Wada",
		"L": "Punjabi Rajma, Aloo Methi, Dal Kohlapuri, Rice, Chapati, Rassam, Moong Salad, Curd, Fryums, Fruit Custard",
		"S": "Masala Sandwich",
		"D": "Doodhi Channa, Paneer Curry, Egg Curry, Seasonal Fruit, Dal Tadka, Rice, Chapati, Sambhar, Green Salad, Veg Raita"
    },
    "Saturday": {
        "B": "Misal Pav",
		"L": "Malai Kofta Gravy, Soya Dry, Dal Jeera Fry, Rice, Chapati, Sambhar, Chana Tomato Onion Salad, Buttermilk, Roasted Papad, Pineapple Sheera",
		"S": "Dabeli",
		"D": "Sev Tamatar, Aloo Rasila, Dal Tadka, Rice, Chapati, Kokam Rassam, Tossed Salad, Curd"
    },
    "Sunday": {
        "B": "Chole Bhature",
		"L": "Kurkuri Bhindi, Dal Fry, Dum Veg Biryani, Chapati, Rassam, Papdi Chaat, Boondi Raita, Fried Papad",
		"S": "Samosa",
		"D": "Pani Puri, Pav Bhaji, Kadhi Veg Kurma, Masala Khichdi, Chapati, Ice Cream, Mix Salad"
    }
}

var everyday = {
    "B": "Tea + Coffee, Boiled Egg / Omelette, Bread + Butter + Jam, Bournvita, Hot + Cold Milk, Cornflakes",
    "L": "",
    "S": "Tea + Coffee",
    "D": ""
}

for(let [day, list] of Object.entries(menu)) {
    for(let [category, items] of Object.entries(menu[day])) {
        let variable_items = items.split(", ")
        let everyday_items = []
        if(everyday[category] != '') everyday_items = everyday[category].split(", ")

        menu[day][category] = [variable_items, everyday_items]
    }
}

// Run setup
setup()
