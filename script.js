angular.module('shop', [])
	.controller('mainController', MainController)
  .factory('shop', Shop)
  .factory('shoppingCart', ShoppingCart)

/**
 * Shop factory
 * everything related to the app (e.g. getItems)
 */
function Shop() {
	return {
  	getItems: function() {
    	// shopItems can be stored in a sperate JSON file or in a db
      // to keep it simple here we're using a static js object
      // e.g. return $http.get('shopItems.json').then(function(json) { return json.data});
      return {
        sections: [{
          title: 'Please enter quantity:',
          items: [
            {
              title: 'Large Pizza',
              price: 19.99
            },
            {
              title: 'Large Poutine',
              price: 29.99
            },
            {
              title: 'Donair Pizza',
              price: 39.99
            }
          ]
        },
        {
          title: 'Your order:',
          items: [

          ]
        }
        ]
      };
    }
  }
}

/**
 * Manages the current shopping cart of user
 * (summing prices & currently selected items)
 */
function ShoppingCart() {

	var factory = {
  	total: 0,
    cartItems: [],
  	updateItem: updateItem,
    updateTotal: updateTotal,
    checkCart: checkCart,
    checkout: checkout
  };
  
  return factory;
  
  function updateItem(evt, item) {
  	var itemElement = evt.target;
    
    checkCart(item, itemElement.checked);
    factory.total = calcTotal();
  }
  
  function calcTotal() {
  	newTotal = 0;
    angular.forEach(factory.cartItems, function(item) {
    	//console.log('calc tot', item);
    	newTotal	+= item.checked ? ( item.quantity * item.price ) : 0;
    });
    
    return newTotal;
  }
  
  function checkCart(item, checked) {
  	var cartItems = factory.cartItems,
    		cartIndex = cartItems.indexOf(item);
        
  	if ( checked ) {
    	
    	if ( cartIndex == -1 ) {
      	cartItems.push(item);
        //console.log('added item', cartItems);
      }
      
      cartIndex = cartItems.indexOf(item);
      angular.extend(cartItems[cartIndex], {
        checked: true,
        quantity: parseInt(item.quantity || 1)
      });
    }
  	else {
    	cartItems[cartIndex].checked = false;
    }
  }
  
  function updateTotal(item) {
  	item.checked = parseInt(item.quantity) > 0;
    checkCart(item, item.checked);
  	factory.total = calcTotal();
  }
  
  function checkout() {
    // later here would go a checkout page/popup
  	alert(JSON.stringify(factory.cartItems.map(function(item) {
    	return item.checked ? item: undefined;
    })) + 'total: '+ factory.total);
  }
}

function MainController(shop, shoppingCart) {
	var vm = this,
  		cart = [];
  
  vm.sections = shop.getItems().sections;
  
  vm.cart = shoppingCart;
}