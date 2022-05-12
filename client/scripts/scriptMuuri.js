//initGrid();
// https://codepen.io/ljgilm/pen/oNEbKKE?editors=0010

var grid = null;

var docElem = document.documentElement;
//var sortField = document.querySelector('.sort-field');
var gridElement = document.querySelector('.grid');
var filterField = document.querySelector('.filter-field');
var searchField = document.querySelector('.search-field');
var layoutField = document.querySelector('.layout-field');
var addItemsElement = document.querySelector('.add-more-items');

var filterFieldValue;
var sortFieldValue;
var layoutFieldValue;
var searchFieldValue;

var dragOrder = [];
var uuid = 0;
var filterOptions = ['red', 'blue', 'green'];
var characters = 'abcdefghijklmnopqrstuvwxyz';


/*function sort() {
    // Do nothing if sort value did not change.
    //var currentSort = sortField.value;
    currentSort = "order"
    //if (sortFieldValue === currentSort) {
    //    return;
    //}
    // If we are changing from "order" sorting to something else
    // let's store the drag order.
    if (sortFieldValue === 'order') {
        dragOrder = grid.getItems();
    }
    // Sort the items.
    /*grid.sort(
        currentSort === 'title' ? compareItemTitle :
            currentSort === 'color' ? compareItemColor :
                dragOrder
    ); //
    // Update indices and active sort value.
    updateIndices();
    sortFieldValue = currentSort;
}*/

function addNewProduct(data) {
    //console.log("START ADDING");
    //console.log(gridElement);
    // Generate new elements.
    var newElems = generateElements(data, 1);
    // Set the display of the new elements to "none" so it will be hidden by
    // default.
    newElems.forEach(function (item) {
        //item.style.display = 'none';
    });
    // Add the elements to the grid.
    var newItems = grid.add(newElems);
    // Update UI indices.
    updateIndices();
    // Sort the items only if the drag sorting is not active.
    if (sortFieldValue !== 'order') {
    grid.sort(sortFieldValue === 'title' ? compareItemTitle : compareItemColor);
    dragOrder = dragOrder.concat(newItems);
    }

    // Finally filter the items.
    //filter();
    saveLayout(grid);
    grid.refreshItems();
    //console.log(grid);
    //console.log("Finish Adding");

}

function removeOldProduct(e) {
    
    var elem = elementClosest(e.target, '.item');
    //sortFieldValue = 'drag';
    console.log("PRODUCT ID TO REMOVE : " + elem.getAttribute('data-prodid'));
    grid.hide(elem, {
        onFinish: function (items) {
            //var item = items[0];
            grid.remove(items, { removeElements: true });
            if (sortFieldValue !== 'order') {
                var itemIndex = dragOrder.indexOf(item);
                if (itemIndex > -1) {
                    dragOrder.splice(itemIndex, 1);
                }
            }
        }
    });
    updateIndices();
    console.log("inside remove");
    //console.log(elem.getAttribute("data-id"))
    //console.log(document.querySelectorAll('[data-id="' + elem.getAttribute("data-id") + '"]'));
    //console.log(grid);

    return (elem.getAttribute('data-prodid'));
}

function updateIndices() {

    grid.getItems().forEach(function (item, i) {
        item.getElement().setAttribute('data-id', i + 1);
        item.getElement().querySelector('.card-id').innerHTML = i + 1;
    });

}

function generateElements(data, amount) {
    console.log("DATA");
    console.log(data[0]);

    // reloading the pages after changes
    uuid = 0;
    //

    var ret = [];

    for (var i = 0, len = amount || 1; i < amount; i++) {
        console.log("add card: "+ data[i].id);
        var id = ++uuid;
        var prodID = data[i].id;
        var title = data[i].title;
        var description = data[i].description;
        var price = data[i].price;
        var image = data[i].image;
        var color = 'green'; //getRandomItem(filterOptions);
        var width = Math.floor(Math.random() * 2) + 1;
        var height = Math.floor(Math.random() * 2) + 1;
        var itemElem = document.createElement('div');

        var itemTemplate = '' +
            '<div class="item" data-id="' + id + '" data-prodid ="' + prodID + '" data-title="' + title + '" style= "filter: drop-shadow(7px 7px 0px #597658); width: 18rem; height:35 rem; border-width: thick; border-style: solid; border-color: #709a71; background-color: #709a71;">' +
            '<div class="item-content">' +
            '<div class="card mb-3" style="width: 16rem; height:35 rem; background-color: #709a71; border-style: none;">' +
            '<div class="card-id">' + id + '</div>' +
            '<a class="item-pic" target="_blank"><img class="card-img-top" id= "productImg" style="width: 17rem; height: 12rem; justify-content: center;" src="' + image + '" alt="' + image.match(/[\w-]+\.(jpg|png|gif)/g) + '"></a>' +
            '<div class="card-title"> <p class = "titleStyle">' + title + '</p></div>' +
            '<div class="desRule"> <p class="card-des">' + description + '</p> </div>' +
            '<p class="card-price"> $' + price + '</p>' +
            '<button class="btn editProduct" style="background-color:#709a71;" data-bs-toggle="modal" data-bs-target="#editProductModal" data-bs-whatever="@getbootstrap" product_number= "' + prodID+ '">Edit</button> </div>' +
            '<div class="card-remove" ><button class="btn removeProdBut"><i class="material-icons">&#xE5CD;</i></div></button>' +
            '</div>' +
            '</div>' +
            '</div>';

        itemElem.innerHTML = itemTemplate;
        ret.push(itemElem.firstChild);

    }

    return ret;

}

// --------------------------------------------------------------
function destroyGrid() {
    grid.destroy(true);
}

function initGrid(data) {
    var dragCounter = 0;

    //console.log("DATA");
    //console.log(data);
    // for reload
    const elemNum = Object.keys(data).length;
    console.log("ELEM_NUM: "+elemNum);
    gridElement = document.querySelector('.grid');
    grid = new Muuri(gridElement, {
        items: generateElements(data, elemNum),
        layoutDuration: 400,
        layoutEasing: 'ease',
        dragEnabled: true,
        dragSortInterval: 50,
        dragContainer: document.querySelector('.card-body'),
        dragReleaseDuration: 400,
        dragReleseEasing: 'ease',
        dragStartPredicate: function (item, event) {
            var isDraggable = sortFieldValue === 'order';
            var isRemoveAction = elementMatches(event.target, '.card-remove, .card-remove i');
            console.log("isRemove: " + isRemoveAction);
            console.log("draggable: " + isDraggable)
            return isDraggable && !isRemoveAction ? Muuri.ItemDrag.defaultStartPredicate(item, event) : false;
        },


        layoutOnInit: false
    })
    .on('move', function () {
        saveLayout(grid);
    })

    .on('dragStart', function () {
        ++dragCounter;
        docElem.classList.add('dragging');
    })
    .on('dragEnd', function () {
        if (--dragCounter < 1) {
            docElem.classList.remove('dragging');
        }
    })

    console.log(grid);
    console.log("RELOAD: " + Object.values(grid));
    //console.log(grid.getID());

    sortFieldValue = 'order';

    var layout = window.localStorage.getItem('layout');
    if (layout) {
        //console.log("LOOOOOOOOOOOOOAAAAAAAAAAAAAAAD");
        //console.log(grid)
        //console.log("LOCAL: " + window.localStorage.layout);
        
        // figuring out reloading page issue when going to clear and reload page
        //loadLayout(grid, layout);
    } else {
        grid.layout(true);
    }
    //console.log("START");
    //console.log(grid);

}

function serializeLayout(grid) {
    var itemIds = grid.getItems().map(function (item) {
        return item.getElement().getAttribute('data-id');
    });
    //console.log("SERIALIZEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
    //console.log(grid)
    return JSON.stringify(itemIds);
}

function serializeProdIdLayout(grid) {
    var prods = grid.getItems().map(function (item) {
        return item.getElement().getAttribute('data-prodid');
    });
    //console.log("SERIALIZEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
    //console.log(grid)
    return JSON.stringify(prods);
}

// REARRANGE LAYOUT!!!! MANGO
function saveLayout(grid) {

    //var layout = serializeLayout(grid);
    //window.localStorage.setItem('layout', layout);

    var prodIdLayout = serializeProdIdLayout(grid);
    window.localStorage.setItem('prodIdlayout', prodIdLayout);

    console.log(prodIdLayout);

    console.log("SAAAAAAAAAAAAAAAAAAAAAVE");
    console.log(grid);
}

function loadLayout(grid, serializedLayout) {
    var layout = JSON.parse(serializedLayout);
    var currentItems = grid.getItems();
    var currentItemIds = currentItems.map(function (item) {
        return item.getElement().getAttribute('data-id')
    });
    var newItems = [];
    var itemId;
    var itemIndex;

    for (var i = 0; i < layout.length; i++) {
        itemId = layout[i];
        itemIndex = currentItemIds.indexOf(itemId);
        if (itemIndex > -1) {
            newItems.push(currentItems[itemIndex])
        }
    }
    //console.log("NEW ITEM FINAL: " + newItems);
    grid.sort(newItems, { layout: 'instant' });
}

function elementMatches(element, selector) {
    var p = Element.prototype;
    console.log("P: ----------------------------");
    console.log(p);
    //console.log(p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);
    // p.webkitMatchesSelector - deprecated
    return (p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(element, selector);

}

function elementClosest(element, selector) {
    if (window.Element && !Element.prototype.closest) {
        var isMatch = elementMatches(element, selector);
        while (!isMatch && element && element !== document) {
            element = element.parentNode;
            isMatch = element && element !== document && elementMatches(element, selector);
        }
        return element && element !== document ? element : null;
    }
    else {
        return element.closest(selector);
    }

}


[].slice.call(document.querySelectorAll('.item-pic'))
    .forEach(function (elem) {
        elem.addEventListener('click', function (e) {
            //e.preventDefault();
        });
    });


    const componentMuuri = (dataId, productURL, imagePath, titleName, desc, price, productNum) =>

    `
    <div class="item" data-id="${dataId}">
        <div class="item-content">
        <div class="card mb-3"
            style="filter: drop-shadow(7px 7px 0px #597658); width: 18rem; height:35 rem; border-width: thick; border-style: solid; border-color: #709a71; background-color: #709a71;">
            <a class="item-pic" href="${productURL}" target="_blank"><img class="card-img-top" style="width: 18rem" src="${imagePath}" alt="${title}"></a>
            <div class="card-body">
            <h5 class="card-title" ;>${titleName}</h5>
            <p class="card-text">${price}</p>
            <a class="btn" style="background-color:#709a71;" id="addtocart" product_number=${productNum}>Add to Cart</a>
            </div>
        </div>
        </div>
    </div> 
    `
    ;

    /*

        var itemTemplate = '' +
            '<div class="item h' + height + ' w' + width + ' ' + color + '" data-id="' + id + '" data-color="' + color + '" data-title="' + title + '">' +
            '<div class="item-content">' +
            '<div class="card">' +
            '<div class="card-id">' + id + '</div>' +
            '<div class="card-title">' + title + '</div>' +
            '<div class="card-remove"><i class="material-icons">&#xE5CD;</i></div>' +
            '</div>' +
            '</div>' +
            '</div>';

function generateElements(amount) {

    var ret = [];

    for (var i = 0, len = amount || 1; i < amount; i++) {
        
        //console.log("1st ID: " + id);
        var id = ++uuid;
        //console.log("2nd ID: " + id);
        var color = 'green'; //getRandomItem(filterOptions);
        var title = "Longbow"; //generateRandomWord(2);
        var width = Math.floor(Math.random() * 2) + 1;
        var height = Math.floor(Math.random() * 2) + 1;
        var itemElem = document.createElement('div');
        var description = "Muuri creates responsive, sortable, filterable and draggable layouts. Comparing to what's out there Muuri is a combination of Packery, Masonry, Isotope and Sortable.";
        /*var itemTemplate = '' +
            '<div class="item h' + height + ' w' + width + ' ' + color + '" data-id="' + id + '" data-color="' + color + '" data-title="' + title + '">' +
            '<div class="item-content">' +
            '<div class="card">' +
            '<div class="card-id">' + id + '</div>' +
            '<div class="card-title">' + title + '</div>' +
            '<div class="card-remove"><i class="material-icons">&#xE5CD;</i></div>' +
            '</div>' +
            '</div>' +
            '</div>';*/

//    var itemTemplate = '' +
//    '<div class="item" data-id="' + id + '" data-title="' + title + '" style= "filter: drop-shadow(7px 7px 0px #597658); width: 18rem; height:35 rem; border-width: thick; border-style: solid; border-color: #709a71; background-color: #709a71;">' +
//    '<div class="item-content">' +
//    '<div class="card mb-3" style="width: 16rem; height:35 rem; background-color: #709a71; border-style: none;">' +
//    '<div class="card-id">' + id + '</div>' +
//    '<a class="item-pic" href="https://www.google.com/" target="_blank"><img class="card-img-top" style="width: 16rem; justify-content: center;" src="assets/crossbow.png" alt="bow"></a>'+
//    '<a class="btn" style="background-color:#709a71;" id="addtocart" product_number=100>Add to Cart</a> </div>' +
//    '<div class="card-title">' + title + '</div>' +
//    '<p class="card-text">' + description + '</p>' + 
//    '<p class="card-text"> $5.00 </p>' + 
//    '<div class="card-remove" ><button class="btn removeProdBut"><i class="material-icons">&#xE5CD;</i></div></button>' +
//    '</div>' +
//    '</div>' +
//    '</div>';

//itemElem.innerHTML = itemTemplate;
//ret.push(itemElem.firstChild);

//}

//return ret;

//}*/