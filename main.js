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
        "B": "Aloo Pyaz / Mix Veg Paratha",
		"L": "Veg Kurma, Black Chana Dry, Dal Makhani, Jeera Rice, Chapati, Rassam, Green Salad, Punjabi Lassi, Fryums, Gulab Jamun",
		"S": "Veg Cutlet",
		"D": "Baingan Bharta, Paner Butter Masala, Chicken / Egg Masala, Papaya / Banana, Dal Masala, Rice, Chapati + Paratha, Sambhar, Onion Salad, Curd"
    },
    "Tuesday": {
        "B": "Idli Sambhar",
		"L": "Aloo Jeera, Chhole Amritsari, Dal Fry, Rice, Puri + Chapati, Sambhar, Macaroni Salad, Fresh Lime Water, Roasted Papad, Dry Fruit Shrikhand",
		"S": "Vada Pav",
		"D": "Veg Jalfrezi Gravy, Bhindi Masala, Yellow Dal, Veg Pulao, Chapati, Rassam, Kimchi Salad, Boondi Raita"
    },
    "Wednesday": {
        "B": "Onion Poha + Sev",
		"L": "Dum Aloo Gravy, Soya Chilly Dry, Dal Masala, Jeera Rice, Chapati, Rassam, Mix Sprout Salad, Curd, Fryums, Dudhi Halwa / Moong Dal Halwa",
		"S": "Kachori",
		"D": "Green Chawli, Paneer Biryani, Chicken Biryani, Papaya / Banana, Dal Kolhapuri, Rice, Chapati, Sambhar, Tandoori Salad, Veg Raita"
    },
    "Thursday": {
        "B": "Medu Wada",
		"L": "Veg Kofta Gravy, Cabbage Sabzi Dry, Dal Makhani, Onion Rice, Chapati, Sambhar, Onion Cucumber Tomato Salad, Iced Tea, Roasted Papad, Rasmalai / Rasgulla",
		"S": "Samosa",
		"D": "Manchurian (semi-dry), Pindi Chana, Manchow / Lemon Coriander Soup, Veg Fried Rice / Schezwan Noodles, Chapati, Rassam, Mix Salad, Curd"
    },
    "Friday": {
        "B": "Pav Bhaji / Puri Bhaji",
		"L": "Punjabi Rajma, Aloo Methi, Dal Kohlapuri, Rice, Chapati, Rassam, Tossed Salad, Curd, Fryums, Balushahi",
		"S": "Onion Pakoda",
		"D": "Besan Gatta Gravy, Paneer Tikka Masala / Paneer Kadhai, Egg Curry, Papaya / Banana, Dal Tadka, Rice, Chapati, Sambhar, Green Salad, Boondi Raita"
    },
    "Saturday": {
        "B": "Masala Dosa",
		"L": "Malai Kofta Gravy, Soya Dry, Dal Jeera Fry, Rice, Chapati, Sambhar, Chana Tomato Onion Salad, Jaljeera, Roasted Papad, Jalebi Rabdi",
		"S": "French Fries",
		"D": "Sev Tamatar, Aloo Rasila, Dal Maharaja, Mint Rice, Chapati, Kokam Rassam, Moong Salad, Curd"
    },
    "Sunday": {
        "B": "Chole Bhature",
		"L": "Methi Matar Malai, Kurkuri Bhindi, Kadhi, Dum Veg Biryani, Chapati, Rassam, Papdi Chaat, Jeera Raita, Fried Papad",
		"S": "Schezwan Roll",
		"D": "Pani Puri, Misal Pav + Farsan, Veg Kurma, Masala Khichdi, Chapati, Choco Bite, Mix Salad, Curd"
    }
}

var everyday = {
    "B": "Tea + Coffee, Boiled Egg / Omelette, Bread + Jam, Bournvita, Hot + Cold Milk, Cornflakes",
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