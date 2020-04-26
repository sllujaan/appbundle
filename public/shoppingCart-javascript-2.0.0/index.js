const products = [
    {"id": 1, "name": "Wheat", "price": 2.35, "quantity": 5, imgSrc:"Heads-wheat-grains.jpg"},
    {"id": 2, "name": "Mango", "price": 3.5, "quantity": 10, imgSrc:"mangoes-chopped-and-fresh.jpg"},
    {"id": 3, "name": "Bread", "price": 5.5, "quantity": 10, imgSrc:"yeast bread.jpg"},
    {"id": 4, "name": "vegetables", "price": 7.4, "quantity": 10, imgSrc:"intro_cream_of_crop.jpg"},
    {"id": 6, "name": "oranges", "price": 1.7, "quantity": 10, imgSrc:"darling-oranges-1.png"},
    {"id": 7, "name": "Apples", "price": 10.7, "quantity": 50, imgSrc:"China-fresh-gala-fruit-apple-exporter.jpg"},
    {"id": 8, "name": "Avocados", "price": 2.0, "quantity": 10, imgSrc:"Avocad0-CD.jpg"},
    {"id": 9, "name": "Bananas", "price": 1.0, "quantity": 10, imgSrc:"61fZ+YAYGaL._SL1500_.jpg"},
    {"id": 10, "name": "Blueberries", "price": 11, "quantity": 10, imgSrc:"blueberries-1296x728-feature.jpg"},
    {"id": 11, "name": "Strawberries", "price": 4, "quantity": 10, imgSrc:"strawberry-.jpg"},
    {"id": 12, "name": "Eggs", "price": 20, "quantity": 10, imgSrc:"health-benefits-of-eggs-1296x728-feature.jpg"},
    {"id": 13, "name": "Lean beef", "price": 50, "quantity": 10, imgSrc:"Tri-Tip_Denuded.jpg"},
    {"id": 14, "name": "Chicken breasts", "price": 25, "quantity": 10, imgSrc:"raw-boneless-chicken-breasts-500x500.jpg"},
    {"id": 15, "name": "Almonds", "price": 85, "quantity": 10, imgSrc:"full-frame-shot-of-raw-almonds-royalty-free-image-683814187-1537885519.jpg"}
];

var selected_items = [];
var Order = [];
const ITEMS_KEY = "products.key";

//On Page or document Load Statements----------------------------------------------------

//Displaying products in document load-----------------------------------
var container = document.getElementsByClassName('container')[0]

products.forEach(product => {
    if(product.quantity > 0){
        container.append(getItemsContainer(product))
    }
})

function getItemsContainer({id, name, price, imgSrc}){

    var selectedProduct
    if(isSelected(id)){
        selectedProduct = "moveCover"
    }

    var items_container = document.createElement('div')
    items_container.classList.add('items-Container')
    
    var content = `<div class="image-container">
                    <img class="avatar" src="images/${imgSrc}" alt="photo">
                    </div>
                    <div class="info-container" id="${id}">
                    <div class="info productName">Name: ${name}</div>
                    <div class="info productPrice">price: ${price}$</div>
                    <div class="info">
                        <div id="${id}" class="add_to_cart" onClick="onClickAddToCart(event)" >
                            <img class="imageOK" src="images/okEdited.png" alt="ok">
                            <div class="cover ${selectedProduct}">Add To Cart!</div>
                        </div>
                    </div>
                    </div>`
    items_container.innerHTML = content
    return items_container
}
//-------------------------------------------
updateBabage(getItemsLocalStorage())
//-----------------------------------------------------------------------------------------

//serving the localStorage functions---------------
function addItem({id, name, price, imgSrc}){
    if(selected_items == null){
        selected_items = []
    }
    selected_items.push({id:id, name:name, price:price, quantity:1, imgSrc:imgSrc})
}

function removeItem(id){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items != null){
        selected_items.find((item, index) => {
            if(item.id == id){
                selected_items.splice(index, 1)
                return item
            }
        })
    }
}

function save(){
    localStorage.setItem(ITEMS_KEY, JSON.stringify(selected_items))
}
//------------------------------------------

//Handling checkouts container on click ckeckout button----------------
function onCheckoutClick(){
    
    if(isCartEmpty()){
        alert("No items found.")
    }
    else{
        var picked_items = document.getElementsByClassName("picked-items")[0]
        picked_items.innerHTML = null
        fetchCartItems()
        var popup_container = document.getElementsByClassName("popup-container")[0]
        var popup_container_background = document.getElementById("background")
        var compStyle_popup_container = window.getComputedStyle(popup_container)

        if(compStyle_popup_container.getPropertyValue("visibility") == "hidden") {
            popup_container.style.setProperty("opacity", 1)
            popup_container.style.setProperty("visibility", "visible")
            popup_container_background.style.visibility = "visible"
            updateTotalItems()
            updateTotalPrice()
            updateBabage(getItemsLocalStorage())
        }
        else{
            popup_container.style.setProperty("opacity", "0")
            popup_container.style.setProperty("visibility", "hidden")
        }
    }
}

//gets called only when user clicks checkout button-------------
function fetchCartItems() {
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    var picked_items = document.getElementsByClassName("picked-items")[0]
    var picked_item = document.createElement('div')

    picked_item.classList.add('picked_item')
    picked_item.innerHTML = `<table class="items-table"></table>`
    
    if(selected_items != null){
        selected_items.forEach((item, index) => {
            picked_item.children[0].append(generatePickedItemElement(++index, item))
        })
        picked_items.append(picked_item)
    }
}
//------------------------------------------------------

function generatePickedItemElement(index, {id, name , price, quantity, imgSrc}){
    var table_row = document.createElement('tr')
    table_row.classList.add("active")
    var content = `<td><div>${index}</div></td>
                            <td><div> <img class="cartProductImg" src="images/${imgSrc}" alt="photo"> ${name}</div></td>
                            <td><div>${price}$</div></td>
                            <td><div><input id="${id}" class="quantity" name="quantity" type="number" value="${quantity}" min="1" max="${getProductById(id).quantity}" onChange="onQuantityChange(event)" style="width: 40px;"></td>
                            </div><td>
                            <div><button id="${id}" class="remove-item">remove</button></div>
                            </td>
                    `
    table_row.innerHTML = content
    return table_row
}
//----------------------------------------------------------------------

//Event Linstener functions-------------------------------------------------------------------
document.addEventListener('click', (event) => {

    //Add To Cart Event Listener-------------------------------
    if(event.target.parentElement.className == "add_to_cart" || event.target.className == "add_to_cart" ) {
        var parent;
        if(event.target.className == "add_to_cart"){
            parent = event.target.parentElement.parentElement
        }
        else{
            parent = event.target.parentElement.parentElement.parentElement
        }

        var id = parseInt(parent.getAttribute("id"))
        var product = getProductById(id)

        if(!isSelected(product.id)){
            
            addItem(product)
            save()
            updateBabage(getItemsLocalStorage())
        }
        else{
            alert("The item is in Cart already.")
        }
    }
    //-------------------------------------------------------
    
    //Event Listener When removing items from chart-----------
    if(event.target.className == "remove-item") {
        var id = parseInt(event.target.getAttribute("id"))
        var productRow = event.target.parentElement.parentElement.parentElement
        productRow.classList.remove("active")

        removeItem(id)
        save()
        setTimeout(() => {
            productRow.remove()
            if(isCartEmpty()){
                hideCheckOut()
            }
        }, 500);
        updateTotalItems(event)
        updateTotalPrice()
        updateBabage(getItemsLocalStorage())
        unCheckRemovedItem(id)
        
    }
    //----------------------------------------------------------

    //Background container of chekcout container----------------
    if(event.target.className == "popup_back-Container"){
        var popup_container = document.getElementsByClassName("popup-container")[0]
        var popup_container_background = document.getElementById("background")
        popup_container.style.setProperty("opacity", "0")
        popup_container.style.setProperty("visibility", "hidden")
        popup_container_background.style.visibility = "hidden"
    }
    //------------------------------------------------------------
})
//------------------------------------------------------------------------------------------

//hides checkout container when user click outside of it-----
function hideCheckOut(){
    document.getElementById("background").click()
}
//-----------------------------------------------------------

//Returns Total items------------------------
function getTotalItemsLocalStorage() {
    var totalItems = 0 
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items){
        selected_items.forEach(product => {
            totalItems += product.quantity
        })
        return totalItems
    }
}
//-------------------------------------------

//Returns selected items number-------------
function getItemsLocalStorage() {
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items){
        return selected_items.length
    }   
}
//-------------------------------------------

//this function gets Fired when quantity is changed in cart by user-----------------
function onQuantityChange(event) {
    var id = parseInt(event.target.getAttribute("id"))
    var quantity = parseInt(event.target.value)

    updateQuantityLocalStorage(id, getQuantityFromInvalidQuantity(id, quantity))
    save()
    updateTotalItems(event)
    updateTotalPrice()
}
//------------------------------------------------------------------------

//Returns valid quantity when user changes the quantity in inconsistent state i.e. [ -1, 0, -+ infinity]-----
function getQuantityFromInvalidQuantity(id, quantity) {
    var maxQuantity = getProductById(id).quantity

    if(quantity < 1){
        return 1
    }
    else if(quantity > getProductById(id).quantity) {
        return maxQuantity
    }
    else{
        return quantity
    }
}
//----------------------------------------------------------------

//document updating functions--------------------------------------------
function updateTotalPrice(){
    var total_price = document.getElementsByName("total-price")[0]
    var totalPrice = 0
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items != null) {
        selected_items.forEach(product => {
            totalPrice += (product.price * product.quantity)
        })
    }
    totalPrice = Math.round(totalPrice * 100) / 100
    total_price.innerText = totalPrice + "$"
}

function updateBabage(number = 0){
    if(typeof(number) == "number"){
        var babage = document.getElementsByClassName("babage")[0]
        babage.innerText = number
    }
}

//Remembers user selected quantity in localstorage---------------
function updateQuantityLocalStorage(id, quantity){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items != null) {
        selected_items.find(item => {
            if(item.id === id){
                item.quantity = parseInt(quantity)
            }
        })
    }
}
//------------------------------------

//Updates total items in cart container--------------------
function updateTotalItems(event) {
    if(event) {
        var inputValue = parseInt(event.target.value)
        var productId = parseInt(event.target.getAttribute("id"))
        event.target.value = getQuantityFromInvalidQuantity(productId, inputValue)
    }

    var totalItems = getTotalItemsLocalStorage()
    var total_items = document.getElementsByName("total-items")[0]
    total_items.innerText = totalItems
}
//----------------------------------------------------------

//---------------------------------------------------------------------------------

//Logical Functions----------------------------------------------
function isSelected(id){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    if(selected_items) {
        var isSelected = selected_items.find(item => item.id === id)
        return isSelected
    }
}

function isCartEmpty(){
    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))

    if(selected_items){
        if(selected_items.length == 0){
            return true
        }else{
            return false
        }
    }
    else{
        return true
    } 
}
//-------------------------------------------------------

//When user clicks on add to cart button------------
function onClickAddToCart(event){
    if(event.target.classList.contains("cover")) {
        event.target.classList.add("moveCover")
    }
}
//-------------------------------------------

//When user removes items from cart it uncheckes the selected products from home page products----
function unCheckRemovedItem(id) {
    var addToCartBtn = document.getElementById(id).getElementsByClassName("cover")[0]
    addToCartBtn.classList.remove("moveCover")
}
//--------------------------------------------------------

//Returns product from id from products array----------
function getProductById(id){
    return products.find(product => product.id === id)
}
//----------------------------------------------

//Order function--------------------------------------------------------
function orderNow(){
    var totalItems = document.getElementsByName("total-items")[0].innerText
    var totalPrice = document.getElementsByName("total-price")[0].innerText

    selected_items = JSON.parse(localStorage.getItem(ITEMS_KEY))
    Order = selected_items
    alert("Order placed successfully \nTotal items: "+totalItems+"\nTotal price: "+totalPrice)
}
//-------------------------------------------------------------------------