/*
* Kod för webbshop, av Mattias Dahlgren, MIUN
* E-post: mattias.dahlgren@miun.se
* OBS: Denna kod får ej användas utanför projektuppgifter för kursen DT163G, Digital bildbehandling för webb
* Denna information måste lämnas oförändrad
* Har du gjort ändringar i denna fil ska detta beskrivas här i sidhuvudet.
* 
* Ändringar gjorda: 
*
*/

const basketEl = document.getElementById("basket"); // Varukorgen i DOM
const smallBasketEl = document.getElementById("small-basket"); // Liten varukorg med endast antal och summa
const checkoutEl = document.getElementById("checkout"); // Kassan
const checkoutInlineEl = document.getElementsByClassName("checkout-inline"); // Checka-ut-inline (array)
const checkoutButtonEl = document.getElementsByClassName("checkout-button"); // Checka-ut-knappar (array)
const itemsInBasketEl = document.getElementsByClassName("items-in-basket"); // Antal varor i varukorgen
const totalSumEl = document.getElementsByClassName("total-sum"); // Total-summa
const notifyEl = document.getElementById("notify"); // Meddelande-element då vara lagts i varukorgen

window.addEventListener("load", showBasket, false);         // Visa varukorg vid start
window.addEventListener("load", showSmallBasket, false);    // Visa liten varukorg
window.addEventListener("load", showCheckout, false);       // Gå till betalning/utcheckning

/* Lägg till i varukorg */
function addToBasket(el, id, name, cost, image, notify = false) {

    // Börja med en vara
    let numOfItems = 1;

    // Sätt en klass på anropande class
    el.classList.add("clicked");

    // Läs in listan
    let currentBasket = JSON.parse(localStorage.getItem("basket"));

    if (currentBasket == null) { currentBasket = []; }

    // Kontrollera om varan redan finns
    for (let i = 0; i < currentBasket.length; i++) {
        if (id == currentBasket[i].artId) {
            numOfItems = currentBasket[i].nums + 1;
            currentBasket.splice(i, 1);
        }
    }

    // Lägg till
    currentBasket.push({ artId: id, artName: name, artCost: cost, artImage: image, nums: numOfItems });

    // Konvertera till JSON
    let jsonStr = JSON.stringify(currentBasket);
    // Lagra
    localStorage.setItem("basket", jsonStr);

    // Meddela användare, om notify = true
    if (notify == true) {
        let timer = null;

        if (document.getElementById("notify")) {
            let notifyText = "<p>Varan <b>" + name + "</b> lagd i varukorgen</p>";
            // Sätt klass för att visa
            notifyEl.classList.add("visible");
            notifyEl.innerHTML = notifyText;
            // Skapa en timer
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                // Sätt klass för att visa
                notifyEl.classList.remove("visible");
            }, 3000);
        }
    }

    // Uppdatera DOM
    showBasket();
    showSmallBasket();
    showCheckout();
}

/* Visa varukorg */
function showBasket() {
    // Läs in varukorg
    let basketItems = JSON.parse(localStorage.getItem("basket"));
    if (basketItems == null) { basketItems = []; }

    // Visa "Visa kassan"-inline-element
    if (basketItems.length > 0) {
        if (document.getElementsByClassName("checkout-inline")) {
            for (let i = 0; i < checkoutInlineEl.length; i++) {
                checkoutInlineEl[i].style.display = "inline";
            }
        }
    }

    let sum = 0;
    let numOfItems = 0;
    // Utskrift av totalsumma och antal
    if (basketItems.length > 0) {

        // Loopa genom varor
        for (let i = 0; i < basketItems.length; i++) {
            // Räkna ut kostnad och lägg till summa
            let itemCost = parseInt(basketItems[i].artCost);

            // Flera varor av samma typ - addera kostnaden * antal
            if (basketItems[i].nums > 1) {
                let count = parseInt(basketItems[i].nums);
                for (let j = 0; j < count; j++) {
                    sum += itemCost;
                    numOfItems++;
                }
            } else {
                sum += itemCost;
                numOfItems++;
            }
        }
    } else {
        // Dölj "Visa kassan"-knappar
        if (document.getElementsByClassName("checkout-button")) {
            for (let i = 0; i < checkoutButtonEl.length; i++) {
                checkoutButtonEl[i].style.display = "none";
            }
        }
    }
    // Visa antal
    if (document.getElementsByClassName("items-in-basket")) {
        for (let i = 0; i < itemsInBasketEl.length; i++) {
            itemsInBasketEl[i].innerHTML = numOfItems;
        }
    }

    // Visa totalsumma
    if (document.getElementsByClassName("total-sum")) {
        for (let i = 0; i < totalSumEl.length; i++) {
            totalSumEl[i].innerHTML = sum + ":-";
        }
    }

    if (document.getElementById("basket")) {

        // Nollställ
        basketEl.innerHTML = "";

        if (basketItems.length > 0) {
            let sum = 0;
            let numOfItems = 0;

            // Loopa genom varor
            for (let i = 0; i < basketItems.length; i++) {
                // Räkna ut kostnad och lägg till summa
                let itemCost = parseInt(basketItems[i].artCost);

                // Flera varor av samma typ - addera kostnaden * antal
                if (basketItems[i].nums > 1) {
                    let count = parseInt(basketItems[i].nums);
                    for (let j = 0; j < count; j++) {
                        sum += itemCost;
                        numOfItems++;
                    }
                } else {
                    sum += itemCost;
                    numOfItems++;
                }

                // Skapa nytt element
                let newItem = document.createElement("li");

                // Varunamn
                let newItemName = document.createElement("span");
                newItemName.className = "item-text";
                let newItemNameText = document.createTextNode(basketItems[i].artName + ", ");
                newItemName.appendChild(newItemNameText);
                newItem.appendChild(newItemName);

                // Antal
                let newItemCount = document.createElement("span");
                newItemCount.className = "item-count";
                let newItemCountText = document.createTextNode(basketItems[i].nums + " st ");
                newItemCount.appendChild(newItemCountText);
                newItem.appendChild(newItemCount);

                // Varupris
                let newItemCost = document.createElement("span");
                newItemCost.className = "item-cost";
                let newItemCostText = document.createTextNode(itemCost + ":-");
                newItemCost.appendChild(newItemCostText);
                newItem.appendChild(newItemCost);

                // Lägg till i DOM
                basketEl.appendChild(newItem);
            }
            // Lägg till summan sist
            let newItem = document.createElement("li");
            newItem.className = "sum";
            let newItemText = document.createTextNode("Summa: " + sum + ":-");
            newItem.appendChild(newItemText);

            // Lägg till i DOM
            basketEl.appendChild(newItem);

            // Visa "Visa kassan"-knappar
            if (document.getElementsByClassName("checkout-button")) {
                for (let i = 0; i < checkoutButtonEl.length; i++) {
                    checkoutButtonEl[i].style.display = "block";
                }
            }
        } else {
            // Tomt i listan
            basket.innerHTML = "<li>Varukorgen är tom</li>";

            // Dölj "Visa kassan"-knappar
            if (document.getElementsByClassName("checkout-button")) {
                for (let i = 0; i < checkoutButtonEl.length; i++) {
                    checkoutButtonEl[i].style.display = "none";
                }
            }
        }
    }
}

/* Liten varukorg */
function showSmallBasket() {
    if (document.getElementById("small-basket")) {
        var basketItems = JSON.parse(localStorage.getItem("basket"));

        if (basketItems == null) { basketItems = []; }

        if (basketItems.length > 0) {
            // Räkna ut totalsumma
            let sum = 0;
            let numOfItems = 0;

            // Loopa genom varor
            for (let i = 0; i < basketItems.length; i++) {
                // Räkna ut kostnad och lägg till summa
                let itemCost = parseInt(basketItems[i].artCost);

                // Flera varor av samma typ - addera kostnaden * antal
                if (basketItems[i].nums > 1) {
                    let count = parseInt(basketItems[i].nums);
                    for (let j = 0; j < count; j++) {
                        sum += itemCost;
                        numOfItems++;
                    }
                } else {
                    sum += itemCost;
                    numOfItems++;
                }
            }
            smallBasketEl.innerHTML = numOfItems + "st, " + sum + ":-";

            // Visa antal
            if (document.getElementsByClassName("items-in-basket")) {
                for (let i = 0; i < itemsInBasketEl.length; i++) {
                    itemsInBasketEl[i].innerHTML = numOfItems;
                }
            }
        } else {
            smallBasketEl.innerHTML = "";
        }
    }
}

/* Visa kassan */
function showCheckout() {
    if (document.getElementById("checkout")) {
        let basketItems = JSON.parse(localStorage.getItem("basket"));
        if (basketItems == null) { basketItems = []; }

        // Nollställ
        checkoutEl.innerHTML = "";

        if (basketItems.length > 0) {
            // Räkna ut totalsumma
            let sum = 0;

            // Loopa genom varor
            for (let i = 0; i < basketItems.length; i++) {
                // Räkna ut kostnad och lägg till summa
                let itemCost = parseInt(basketItems[i].artCost);
                let itemSumCost = 0;

                // Flera varor av samma typ - addera kostnaden * antal
                if (basketItems[i].nums > 1) {
                    let count = parseInt(basketItems[i].nums);
                    for (let j = 0; j < count; j++) {
                        sum += itemCost;
                        itemSumCost += itemCost;
                    }
                } else {
                    sum += itemCost;
                    itemSumCost = itemCost;
                }

                let artId = basketItems[i].artId;
                let artName = basketItems[i].artName;
                let numItems = basketItems[i].nums;
                let artImage = basketItems[i].artImage;

                // Skapa nytt element
                checkoutEl.innerHTML += "<tr>" +
                    "<td><img src='" + artImage + "' alt='Produktbild för " + artName + "' />" +
                    "<td>" + artId + "</td>" +
                    "<td>" + artName + "</td>" +
                    "<td>" + numItems + " st.</td>" +
                    "<td>" + itemSumCost + ":-</td>" +
                    "</tr>";
            }

            // Lägg till summan sist
            checkoutEl.innerHTML += "<tr>" +
                "<td colspan='5' class='checkout-sum'>Summa: " + sum + ":-</td>";

        } else {
            // Tomt i listan
            checkoutEl.innerHTML = "<tr><td colspan='5'>Varukorgen är tom</td></tr>";
        }
    }
}

/* Till kassan */
function checkoutBasket() {
    let basketItems = JSON.parse(localStorage.getItem("basket"));
    if (basketItems != null) {
        let itemCount = 0;
        let totalSum = 0;

        for (let i = 0; i < basketItems.length; i++) {
            let count = parseInt(basketItems[i].nums);
            for (let j = 0; j < count; j++) {
                totalSum += parseInt(basketItems[i].artCost);
                itemCount++;
            }
        }

        if (itemCount == 1) {
            alert("Din order är mottagen! En vara - totalsumma: " + totalSum + ":-");
        } else {
            alert("Din order är mottagen! " + itemCount + " stycken varor - totalsumma: " + totalSum + ":-");
        }

        // Tom varukorgen
        emptyBasket(false);

    } else {
        alert("Inga varor i din varukorg!");
    }
}

/* Töm varukorg */
function emptyBasket(conf = true) {
    if (conf == true) {
        if (confirm("Är du säker att du vill radera alla varor?")) {
            localStorage.removeItem("basket");
            showBasket();
            showSmallBasket();
            showCheckout();
        } else {
            return;
        }
    } else {
        localStorage.removeItem("basket");
        showBasket();
        showSmallBasket();
        showCheckout();
    }
}