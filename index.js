const add_btn = document.getElementById("nav-add-btn");
const overlay = document.getElementById("overlay");
const cancel_btn = document.getElementById("cancel-btn");
const form = document.getElementById("add-form");
const add_form_image = document.getElementById("add-form-img");
const submit_form = document.getElementById("submit-form");
const main = document.getElementById("main");
const sortList = document.getElementById("sort");
const warning = document.getElementById("add-warning");

storage = window.sessionStorage;

window.onload = function(){

    fillList();

}

fillList = function(){
    
    main.innerHTML = '';

    let list = storage.getItem('pizzas');
    if (list == null){
        pizza_list = [];
        pizza_list.length = 0;
    }else{
        pizza_list = JSON.parse(list);
    }  

    sortBy();

    pizza_list.forEach(pizza => {
        let div = document.createElement("div");
        div.className = "item-row";

        let image = document.createElement("img");
        image.className = "pizza-image";
        image.src = 'img/' + pizza.image + '.jpg';
        div.appendChild(image);
        
        let info = document.createElement("div");
        info.className = "item-info";

        let name = document.createElement("h2");
        name.innerHTML = pizza.name; 
        info.appendChild(name);
        
        let heat = document.createElement("div");
        for(let i = 0; i < pizza.heat;i++){
            let chili = document.createElement("img");
            chili.className = "chili-image";
            chili.src = 'img/chili.png';
            heat.appendChild(chili);
        }
        info.appendChild(heat);

        let toppings_title = document.createElement("h4");
        toppings_title.innerHTML = "Toppings:"
        info.appendChild(toppings_title);

        let toppings = document.createElement("p");
    
        toppings.innerHTML = pizza.toppings.join(", ");
        info.appendChild(toppings);

        let price = document.createElement("h5");
        price.innerHTML = pizza.price + " €"; 
        info.appendChild(price);

        div.appendChild(info);

        let close = document.createElement("button");
        close.className = "close"
        close.innerHTML = "X"
        close.onclick = function(){deleteItem(pizza);};
        div.appendChild(close);

        main.appendChild(div);

    });
}

cancel_btn.onclick = function (){
    overlay.style.display = "none";
}

add_btn.onclick = function(){

    overlay.style.display = "flex";
}

form.image.onchange = function (){

    add_form_image.src = "/img/" + form.image.value + ".jpg";

}

show_warning = function(text){

    warning.innerHTML = text;
    warning.style.display = "inline";

}

submit_form.onclick = function(event){

    event.preventDefault();

    if(form.name.value == null || form.name.value.trim(" ") == ""){
        console.log("Name is required");
        show_warning("Name is required");
        return;
    }

    if(checkName(form.name.value)){
        console.log("Name exists");
        show_warning("Name exists");
        return;
    }

    if(form.price.value == null || form.price.value == ""){
        console.log("Price is required")
        show_warning("Price is required");
        return;
    }

    let toppings = form.toppings.value.split(",")

    let new_pizza = {

        name: form.name.value,
        price: form.price.value,
        heat: form.heat.value,
        toppings: toppings,
        image: form.image.value,
    }

    pizza_list.push(new_pizza);
    storage.setItem('pizzas', JSON.stringify(pizza_list));

    console.log("pizza added")

    form.reset();
    warning.style.display = "none";
    fillList();
}

sortList.onchange = function(){

    fillList();

}

sortBy = function(){

    let type = sortList.value;

    if(type == "name"){
        pizza_list.sort((a, b) => (a.name < b.name) ? 1 : -1)
        return;
    }
    if(type == "heat"){
        pizza_list.sort((a, b) => (a.heat < b.heat) ? 1 : -1)
        return;
    }
    if(type == "price"){
        pizza_list.sort((a, b) => (a.price < b.price) ? 1 : -1)
        return;
    }
}

deleteItem = function(pizza){

    if (confirm("Do you want to delete the recipe?")) {
        const arr = pizza_list.filter(item => item.name !== pizza.name);
        storage.setItem('pizzas',JSON.stringify(arr));
        fillList();
    } else {
        return;
    }
}

checkName = function(name){

    for(let i = 0;i < pizza_list.length;i++){
        if(pizza_list[i].name == name){
            return true;
        }
    }
    return false;

}