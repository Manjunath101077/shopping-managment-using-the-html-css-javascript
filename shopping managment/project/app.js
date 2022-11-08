
const client=contentful.createClient({
    space:"l1nvkinfofgf",
    accessToken:"M43Qplh_K2-pUvP6OpYelcG3a5y7g9t4qsK1SidAh_o"
});
// console.log(client);


// it had been from the logo of the basket
const cartBtn=document.querySelector(".cart-btn");
// it had been from the closing the icons that will come whne you add to the icons 
const closeCartBtn=document.querySelector(".close-cart");
// it had been from the clearin the button 
const clearCartBtn=document.querySelector(".clear-cart");
// it had been about the closing  cart which conttent all the information 
const cartDOm=document.querySelector(".cart");

// it had been about the full cart 
const cartOverlay=document.querySelector(".cart-overlay");

// it had been about the card items which had been used for the counting the number items in the card 
const cartItem=document.querySelector(".cart-items");
// it had been about the counting the number of items you need 
const cartTotal=document.querySelector(".cart-total");
// it had been about the full content of the card 
const cartContent=document.querySelector(".cart-content");
// it had been about the adding the images to the default
const productsDOM=document.querySelector(".products-center");

//getting the button

// cart
// it had been all about the getting the product from the local host 
let cart=[];
// button 
let buttonDOM=[];

// it had been about the getting the product
class Products{ 

    async getProducts(){
        try{

            let contactfull=await client.getEntries({
                content_type:"manjunath"
            });
            // .then((response)=>console.log(response.item))
            // .catch(console.error)
            // console.log(contactfull);
            

            // in the result we fetched the data from the json 
        let result=await fetch("products.json");
        // hear we store in the data of the result 
        let data=await result.json();
        // hear we can store the data of the json in the array format 
        let products=data.items;
        products=products.map(item =>{
            // where we are getting from the fileds 
            const {title,price} =item.fields;
            const {id}=item.sys ;
            const image=item.fields.image.fields.file.url;
        return {title,price,id,image};
        })
        return products;
        }catch(error)
        {
            console.log(error);
        }
    }
}
// display the product 
class UI{
    dsiplayProducts(products)
    {
        let result=' ';
        products.forEach(products => {
            result+=`<article class="product">
            <div class="img-container">
                <img src=${products.image} alt="">
                <button class="bag-btn" data-id=${products.id}>
                    <i class="fa fa-shopping-cart"></i>
                    add to bag
                </button>
            </div>
            <h3>${products.title}</h3>
            <h4>${products.price}</h4>
        </article>`;
        });
        productsDOM.innerHTML=result;
    }
    getBagButtons(){
       /* ...is the one which had been helo us to cobvert what ever we are passing it to the array format*/
        const buttons=[...document.querySelectorAll(".bag-btn")];
            // console.log(buttons);    
        buttonDOM=buttons;
        //  console.log(buttons);

        buttons.forEach(button => {
            let id=button.dataset.id;     
                // console.log(id);    
            let inCart=cart.find(item=>item.id===id); 
            if(inCart)
            {
                    button.innerHTML="in cart";
                    button.disabled=true;
            }
            
                button.addEventListener('click',(event)=>{
                    event.target.innerHTML="in cart";
                    event.target.disabled=true;
                    //get product from products
                    let cartItem={...Storage.getProducts(id),amount:1};
                    // console.log(cartItem);
                    //add the product to the cart
                    cart=[...cart,cartItem];
                    // console.log(cart);
                    //save the cart in the local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //dislay cart items
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart()
                });
            
        });
    }
    setCartValues(cart){
        let tempTotal=0;
        let itemTotal=0;
        cart.map(item=>{
            tempTotal+=item.price*item.amount;
            itemTotal+=item.amount;
        })
     cartTotal.innerText=parseFloat(tempTotal.toFixed(2));
     cartItem.innerText=itemTotal;
    //  console.log(cartTotal,cartItem);
    }
    addCartItem(item){
        const div=document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML=`<img src=${item.image} alt="product" />

                <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.price}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                    <i class="fa fa-chevron-up" data-id=${item.id}></i>
                    <p class="item-amount" >${item.amount}</p>
                    <i class="fa fa-chevron-down" data-id=${item.id}></i>
                </div>`;
                cartContent.appendChild(div);
                
    }
   showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOm.classList.add('showCart');
   }
   setupAPP(){
    cart=Storage.getCart();
    this.setCartValues(cart);
    this.populate(cart);
    cartBtn.addEventListener('click',this.showCart);
    closeCartBtn.addEventListener('click',this.hidecart);
   }
   populate(cart){
    cart.forEach(item =>this.addCartItem(item));

   }
   hidecart(){
     cartOverlay.classList.remove('transparentBcg');
    cartDOm.classList.remove('showCart');
   }
   cartLogic(){
    //clear cart button
        clearCartBtn.addEventListener('click',()=>{
            this.clearCard();

        });
    cartContent.addEventListener('click',event=>{
        if(event.target.classList.contains('remove-item'))
        {
            let removeItem=event.target;
            // console.log(removeItem);
            let id=removeItem.dataset.id;
            cartContent.removeChild(removeItem.parentElement.parentElement);
            this.removeItem(id);
        }
        else if(event.target.classList.contains("fa-chevron-up")){
            let addAmount=event.target;
            let id=addAmount.dataset.id;
            let tempItem=cart.find(item => item.id===id);
            tempItem.amount=tempItem.amount+1;
            Storage.saveCart(cart);
            this.setCartValues(cart);
            addAmount.nextElementSibling.innerText=tempItem.amount;
        }else if(event.target.classList.contains("fa-chevron-down")){
            let lowerAmount=event.target;
            let id=lowerAmount.dataset.id;
            let tempItem=cart.find(item => item.id===id);
            tempItem.amount=tempItem.amount-1;
            if(tempItem.amount>0){
                Storage.saveCart(cart);
                this.setCartValues(cart);
                lowerAmount.previousElementSibling.innerText=tempItem.amount;
            }
            else{
                cartContent.removeChild(lowerAmount.parentElement.parentElement);
                this.removeItem(id);
            }

        }

    })
   }
   clearCard(){
        let cardItems=cart.map(item=>item.id);
        // console.log(cardItems);
        cardItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hidecart();
   }
   removeItem(id){
    cart = cart.filter(item => item.id!==id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button=this.getSingleButton(id);
    button.disabled=false;
    button.innerHTML=`<i class="fa fa-shopping-cart"></i>add to cart`;

   }
   getSingleButton(id){
    return buttonDOM.find(button => button.dataset.id===id);
   }

}

// local storage class
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProducts(id){
    
        let products=JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
        // console.log(products.id);
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
}
document.addEventListener("DOMContentLoaded",()=>{

    const ui=new UI();
    const products=new Products();
    //Set up the application
    ui.setupAPP();
    products.getProducts().then(products=>{ui.dsiplayProducts(products)

    Storage.saveProducts(products)

}).then(()=>{
    ui.getBagButtons();
    ui.cartLogic();
});
});