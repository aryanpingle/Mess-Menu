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
        list = list[0].split(", ")
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
        "B": ["Masala Poha, Tea + Coffee, Bread Jam"],
        "L": ["Bhendi, Sprout Matki, Dal Tadka, Rice, Pickle, Chapati, Sweet Lassi, Papad"],
        "S": ["Vada Pav, Tea + Coffee"],
        "D": ["Aloo Gobi, Black Chana, Rice + Dal, Chapati, Pickle, Papad"]
    },
    "Tuesday": {
        "B": ["Idli Sambar, Tea + Coffee, Bread Jam"],
        "L": ["Punjabi Chole, Aloo Jeera, Lasuni Dal, Rice, Pickle, Puri, Lime Juice, Mix Salad"],
        "S": ["Bhelpuri, Tea + Coffee"],
        "D": ["Mix Veg Dry, Chawali Masala, Dal Khichdi, Chapati, Pickle, Mong Salad"]
    },
    "Wednesday": {
        "B": ["Aloo Paratha, Tea + Coffee, Bread Jam"],
        "L": ["Dum Aloo Gravy, Cabbage, Dal Fry, Rice, Chapati, Pickle, Butter Milk, Papad"],
        "S": ["Masala Sandwich, Tea + Coffee"],
        "D": ["Paneer Gravy, Chicken Gravy, Lauki / Kaddu Masala, Dal Lasuni, Rice, Chapati, Pickle, Papad"]
    },
    "Thursday": {
        "B": ["Upma / Pav Bhaji, Tea + Coffee, Bread Jam"],
        "L": ["Soya Masala Gravy, Beans Fugat (Dry), Dal Makhani, Rice, Pickle, Chapati, Tang, Fryums"],
        "S": ["Veg Maggi, Tea + Coffee"],
        "D": ["Mix Sprout Gravy, Aloo Palak, Dal Adraki, Veg Pulao, Chapati, Pickle, Green Salad"]
    },
    "Friday": {
        "B": ["Uttappa / Medhu Wada, Tea + Coffee, Bread Jam"],
        "L": ["Veg Diwani Handi, Rajma Masala, Dal Fry, Rice, Pickle, Chapati, Dahi, Salad"],
        "S": ["Samosa, Tea + Coffee"],
        "D": ["White Watana Gravy, Bhendi Masala, Dal Tadka, Rice, Pickle, Chapati, Papad"]
    },
    "Saturday": {
        "B": ["Masala Dosa, Tea + Coffee, Bread Jam"],
        "L": ["Aloo Capsicum, Kadi Pakoda, Mix Dal, Rice, Pickle, Chapati, Tang, Papad"],
        "S": ["Veg Sandwich, Tea + Coffee"],
        "D": ["Dry Soya, Moong Usal, Rassam, Lemon Rice, Pickle, Chapati, Green Salad"]
    },
    "Sunday": {
        "B": ["Chole Bhature, Tea + Coffee, Bread Jam"],
        "L": ["Veg Kuram GRavy, Veg Biryani, Dal Fry, Rice, Pickle, Chapati, Veg Raita, Green Salad"],
        "S": ["Bread Pakoda, Tea + Coffee"],
        "D": ["Veg Manchurian, Green Peas Gravy, Dal, Veg Fried Rice, Pickle, Chapati, Papad"]
    }
}