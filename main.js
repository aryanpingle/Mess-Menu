const print = console.log
const gid = document.getElementById

function setup() {
    let day = (new Date().getDay()+6)%7 // Monday is 0
    let items = Object.entries(menu)[day][1]
    // print(items)
    for(let [category, list] of Object.entries(items)) {
        list = list[0].split(", ")
        document.getElementById(category).lastElementChild.innerHTML = list.map(ele=>`<div class="item">${ele}</div>`).join("")
    }
}

window.onload = ()=>{
    setup()
}

var menu = {"Monday": {"B": ["Masala Poha, Tea + Coffee"], "L": ["Bhendi, Sprout Matki, Rice + Dal, Pickle, Chapati, Butter Milk, Salad"], "D": ["Aloo Palak, Black Chana, Rice + Dal, Chapati, Pickle, Papad"]}, "Tuesday": {"B": ["Idli Sambar, Tea + Coffee"], "L": ["Chole, Aloo Jeera, Rice + Dal, Pickle, Puri, Tang, Papad"], "D": ["Turai Chana Dal (Dry), Chawali Masala, Rice + Dal, Chapati, Pickle, Salad"]}, "Wednesday": {"B": ["Aloo Paratha, Tea + Coffee"], "L": ["Cabbage, Aloo Mattar, Rice + Dal, Pickle, Chapati, Butter Milk, Salad"], "D": ["Palak, Raima Masala, Rice + Dal, Pickle, Chapati, Papad"]}, "Thursday": {"B": ["Puri Bhaji, Tea + Coffee"], "L": ["Turai Chana, Kadi Pakoda, Rice + Dal, Pickle, Chapati, Tang, Papad"], "D": ["Aloo Gobi, Mix Sprout, Rice + Dal, Pickle, Salad"]}, "Friday": {"B": ["Uttappa / Medhu Wada, Tea + Coffee"], "L": ["Veg Tawa, Rajma, Rice + Dal, Pickle, Chapati, Butter Milk, Salad"], "D": ["Baingan, White Watana, Rice + Dal, Pickle, Chapati, Papad"]}, "Saturday": {"B": ["Pav Bhaji, Tea + Coffee"], "L": ["Aloo Shimla, Chole Amrutsari, Rice + Dal, Pickle, Chapati, Tang, Papad"], "D": ["Dry Soya, Moong Usal, Rice + Dal, Pickle, Chapati, Salad"]}, "Sunday": {"B": ["Masala Dosa, Tea + Coffee"], "L": ["Veg Jalfrizi, Chawli, Rice + Dal, Pickle, Chapati, Salad"], "D": ["Veg Manchurian, Green Peas, Veg Fried Rice + Dal, Pickle, Chapati, Papad"]}}