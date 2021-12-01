const print = console.log
const gid = (id) => document.getElementById(id)
const log = (text, color)=>print(`%c${text}`, `color: black; background-color: ${color}`)

var selected_day = 0
var current_day = 0

function setup() {
    let items = Object.entries(menu)[selected_day][1]
    // Show the selected day
    gid("date").children[1].innerHTML = Object.entries(menu)[selected_day][0]
    // Add a subtext maybe?
    if (selected_day == current_day) {
        gid("relative-date").innerHTML = "today"
    }
    else if (selected_day == (current_day + 1) % 7) {
        gid("relative-date").innerHTML = "tomorrow"
    }
    else {
        gid("relative-date").innerHTML = ""
    }
    print(items)
    for (let [category, list] of Object.entries(items)) {
        document.getElementById(category).lastElementChild.innerHTML = list.map(ele => `<div class="item">${ele}</div>`).join("")
    }
}

window.onload = () => {
    if("serviceWorker" in navigator) {
        navigator.serviceWorker.register("../sw.js").then(reg => log("Service Worker Registered", "yellow"))
    }
    selected_day = current_day = (new Date().getDay() + 6) % 7
    setup()
    gid("next-day").onclick = () => {
        selected_day = (selected_day + 1) % 7
        setup()
    }
    gid("previous-day").onclick = () => {
        selected_day = (selected_day + 6) % 7
        setup()
    }
}

var menu = {
    "Monday": {
        "B": "Onion Poha",
        "L": "Shahi Bhendi, Sprout Matki, Dal Tadka, Rice, Pickle, Chapati, Sweet Lassi, Papad",
        "S": "Vada Pav",
        "D": "Aloo Gobi, Black Chana, Dal, Jeera Rice, Chapati, Pickle, Papad"
    },
    "Tuesday": {
        "B": "Idli Sambar",
        "L": "Punjabi Chole, Aloo Jeera, Lasuni Dal, Rice, Pickle, Puri, Lime Juice, Mix Salad",
        "S": "Bhelpuri",
        "D": "Veg Diwani Handi, Chawali Masala, Dal Kholapuri, Chapati, Pickle, Mong Salad"
    },
    "Wednesday": {
        "B": "Aloo Paratha",
        "L": "Methi Malai Matar, Cabbage, Dal Makhani, Rice, Chapati, Rasam, Pickle, Butter Milk, Papad",
        "S": "Masala Sandwich",
        "D": "Paneer Biryani, Chicken Biryani, Lauki / Kaddu Masala, Dal Lasuni, Rice, Chapati, Pickle, Raita"
    },
    "Thursday": {
        "B": "Upma / Pav Bhaji",
        "L": "Soya Masala Gravy, Beans Fugat (Dry), Dal Masala, Rice, Pickle, Chapati, Curd, Fryums",
        "S": "Veg Maggi",
        "D": "Aloo Palak, Veg Jalfrizi, Dal Adraki, Veg Pulao, Chapati, Pickle, Green Salad"
    },
    "Friday": {
        "B": "Uttappa / Medhu Wada",
        "L": "Veg Diwani Handi, Rajma Masala, Kaali Masoori Dal, Rice, Pickle, Chapati, Rasam, Tang, Salad",
        "S": "Samosa",
        "D": "Chicken / Egg Masala, Bhendi Masala, Dal Tadka, Rice, Pickle, Chapati, Papad"
    },
    "Saturday": {
        "B": "Masala Dosa",
        "L": "Aloo Capsicum, Kadi Pakoda, Mix Dal, Rice, Pickle, Chapati, Papad",
        "S": "Dabeli",
        "D": "Dry Soya, Moong Usal, Rassam, Lemon Rice, Pickle, Chapati, Green Salad"
    },
    "Sunday": {
        "B": "Chole Bhature",
        "L": "Veg Kuram Gravy, Veg Biryani, Dal Fry, Rice, Pickle, Chapati, Veg Raita, Green Salad",
        "S": "Bread Pakoda",
        "D": "Veg Manchurian, Green Peas Gravy, Dal, Veg Fried Rice, Pickle, Chapati, Papad"
    }
}

var everyday = {
    "B": "Tea + Coffee, Boiled Egg / Omelette, Bread + Jam, Hot + Cold Milk",
    "L": "",
    "S": "Tea + Coffee",
    "D": ""
}

for(let [day, list] of Object.entries(menu)) {
    for(let [category, items] of Object.entries(menu[day])) {
        items = items.split(", ")
        if(everyday[category] != '') items.push(...everyday[category].split(", "))
        menu[day][category] = items
    }
}