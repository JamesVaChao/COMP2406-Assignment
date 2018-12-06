var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Variant = require('../models/variant');
var Order = require('../models/order');
var Department = require('../models/department');
var Discount = require('../models/discount');
const roundTo = require('round-to');
var open = require("open");
var url = require('url');




/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests to the checkout page
//
// This basically renders checkout page and set the discount price
// to 0 always.
//
/////////////////////////////////////////////////////////////////////
router.get('/', ensureAuthenticated, function (req, res, next) {
  let cart = new Cart(req.session.cart);
  req.session.cart.discountPrice = 0;
  res.render('checkout', {
    title: 'Checkout Page',
    items: cart.generateArray(),
    totalPrice: roundTo(cart.totalPrice, 2),
    bodyClass: 'registration',
    containerWrapper: 'container'
  });
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for adding discount
//
// This basically rediercts to checkout page. I need this because
// I in the post request for apply discount I am rendering another page
// so '/apply-discount' keeps in the address bar. Therefore I just
// created redirect middleware for that reason.
//
/////////////////////////////////////////////////////////////////////
router.get('/apply-discount', ensureAuthenticated, function (req, res, next) {
  res.redirect('/checkout')
})

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles POST requests for adding discount
//
// Checks for the discount codes and if it is applicable then returns
// discounted price.
//
/////////////////////////////////////////////////////////////////////
router.post('/apply-discount', ensureAuthenticated, function (req, res, next) {
  let discountCode = req.body.discountCode;
  Discount.getDiscountByCode(discountCode, function (e, discount) {
    if (e) {
      console.log("Failed on router.get('/checkout/apply-discount')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      let cart = new Cart(req.session.cart);
      if (discount) {
        let totalDiscount = (cart.totalPrice * discount.percentage) / 100
        totalDiscount = parseFloat(totalDiscount.toFixed(2))
        let totalPrice = cart.totalPrice - totalDiscount;
        totalPrice = parseFloat(totalPrice.toFixed(2))
        cart.discountPrice = totalPrice
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPriceAfterDiscount: totalPrice,
          totalDiscount: totalDiscount,
          actualPrice: cart.totalPrice,
          discountPercentage: discount.percentage,
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        cart.discountPrice = 0;
        req.session.cart = cart;
        console.log(req.session.cart)
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: roundTo(cart.totalPrice, 2),
          discountCode: discountCode,
          bodyClass: 'registration',
          containerWrapper: 'container',
          msg: "This discount code is not applicable"
        });
      }
    }
  })
})

/////////////////////////////////////////////////////////////////////
//
// checkout-process - checkout-success - checkout-cancel
// MIDDLEWARE - Handles POST & GET requests
//
// They are just middleware for paypal API. Nothing special about them
// Derived from https://github.com/paypal/PayPal-node-SDK
//
/////////////////////////////////////////////////////////////////////
router.post('/checkout-process', function (req, res) {
  let cart = new Cart(req.session.cart);
  let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : roundTo(cart.totalPrice,2);
  //https://api.sandbox.paypal.com
  console.log("LINK:" + req.headers.host)
  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AU1-HVQ3Mjj_49EUkMmJxv5i07RrKOsqQL_kM6iRrbIaMNXAqY4FUpdvIgzomm9Zga56EacOA3l_58Wr',
    'client_secret': 'ELbFx6fAG_cFEuO4VNHTFYAByqQ2ULgjBYi25BwxAqROe6pfIl0ST0vHIlmiwddCS31H3Nir_EjS-Y4R'
  });
  //req.session.host
  return_url = `http://${req.headers.host}/checkout/checkout-success`
  cancel_url = `http://${req.headers.host}/checkout/checkout-cancel`
  console.log(return_url)
  console.log(cancel_url)
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `${return_url}`,
      "cancel_url": `${cancel_url}`
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Various items",
          "sku": "item",
          "price": totalPrice,
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": totalPrice
      },
      "description": "Buying from our our shopping store! "
    }]
  };
  //res.redirect(302, '/checkout/checkout-success')



  var paymentId = 'PAYMENTid';
  var paymentLink = ""

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
        if (payment.links[index].rel === 'approval_url') {
          console.log("Payment link: " + payment.links[index].href);
          paymentLink = payment.links[index].href;

        }
      }
      console.log("Payment link: " + paymentLink);
      res.redirect(paymentLink);

      console.log("PAYMENT");

      console.log(payment);
      res.redirect(302, '/')

    }
  });




});

router.get('/checkout-success', ensureAuthenticated, function (req, res) {
  //TODO: IMPLEMENT PAYMENT THROUGH PAYPAL

  var paymentId = req.query.paymentId;
  console.log("PaymentId:");
  console.log(paymentId);

  var payerId = {
    payer_id: req.query.PayerID
  };
  console.log("payerId:");
  console.log(payerId);

  paypal.payment.execute(paymentId, payerId, function (error, payment) {
    if (error) {
      var cart = new Cart(req.session.cart);

      console.error(JSON.stringify(error));
      //DELETING
      var cartItems = cart.generateArray()
      console.log(req.session.cart);

      cartItems.forEach(element => {
        var totalQty = element.qty

        for (var i = 0; i < totalQty; i++) {
          //console.log("I variable" + i)
          //console.log("element qty" + element.qty)


          cart.decreaseQty(element.item._id);
          //console.log("Deleting roughly: " + element.qty + " " + element.item.title + " with id: " + element.item._id);

          //console.log("total items in cart" + cart.totalQty)
        }
      });

      console.log(req.session.cart);
      console.log(cart)

      //Does deleting of cart
      req.session.cart = cart;
      console.log(req.session.cart);
      res.render('checkoutSuccess', {
        title: 'Not Successful',
        containerWrapper: 'container'
      });

    } else {
      if (payment.state == 'approved') {
        console.log('payment completed successfully');
        console.log("REQPAYMENT 1");
        req.session.payment = payment;
        console.log(payment);
        console.log("SHIPPING")
        console.log(payment.payer.payer_info.first_name)
        console.log(payment.payer.payer_info.shipping_address)
        var cart = new Cart(req.session.cart);
        let totalPrice = (req.session.cart.discountPrice > 0) ? req.session.cart.discountPrice : cart.totalPrice;
        var cartItems = cart.generateArray()
        //console.log("CART:");
        //console.log(cartItems)
        //console.log("ITEM:");
        //console.log(cartItems[0].item._id);
        //console.log(req);


        //ORDER HISTORY

        //console.log("REQPAYMENT");
        //console.log(req.session.payment);
        console.log("Hello")
        //console.log(req);
        console.log(req.session.payment)
        var addressInfo = req.session.payment.payer.payer_info.shipping_address
        console.log("ADDRESSINFO");
        console.log(addressInfo)
        console.log(typeof addressInfo)


        var newOrder = new Order({
          orderID: req.session.payment.id,
          username: req.user.username,
          address: `${addressInfo.line1} ${addressInfo.city} ${addressInfo.state} ${addressInfo.postal_code} ${addressInfo.country_code}`,
          orderDate: (req.session.payment.create_time).replace(/[A-Z]/g, " "),
          shipping: true
        });
        newOrder.save();


        //DELETING
        var cart = new Cart(req.session.cart);

        console.error(JSON.stringify(error));
        //DELETING
        var cartItems = cart.generateArray()
        console.log(req.session.cart);

        cartItems.forEach(element => {
          var totalQty = element.qty

          for (var i = 0; i < totalQty; i++) {
            //console.log("I variable" + i)
            //console.log("element qty" + element.qty)
            cart.decreaseQty(element.item._id);
            //console.log("Deleting roughly: " + element.qty + " " + element.item.title + " with id: " + element.item._id);
            //console.log("total items in cart" + cart.totalQty)
          }
        });

        console.log(req.session.cart);
        console.log(cart)

        //Does deleting of cart
        req.session.cart = cart;
        console.log(req.session.cart);
        res.render('checkoutSuccess', {
          title: 'Not Successful',
          containerWrapper: 'container'
        });

      } else {
        console.log('payment not successful');
      }
    }
  });




  /*
  console.log('orderid' + req.session.payment.id);
  console.log('username' + req.user.username);
  console.log('paymenttime' + req.session.payment.create_time);
  console.log(newOrder);


  //console.log(req)
  */



  ///





});

router.get('/checkout-cancel', ensureAuthenticated, function (req, res) {
  res.render('checkoutCancel', {
    title: 'Successful',
    containerWrapper: 'container'
  });
});

/////////////////////////////////////////////////////////////////////
//
// MIDDLEWARE - Handles GET requests for the buy now page
//
// This middleware works for in couple steps;
//      if there is no product in the shopping bag then creates a bag
//      then add to item in the bag then go to checkout page.
//
//      if there is a product in the shopping bag then add to selected
//      item in the bag then go to checkout page.
//
/////////////////////////////////////////////////////////////////////
router.get('/buy-now/:id', ensureAuthenticated, function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function (e, product) {
    if (e) {
      console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
      e.status = 406;
      next(e);
    } else {
      if (product) {
        cart.add(product, product.id);
        cart.userId = req.user._id;
        req.session.cart = cart;
        res.render('checkout', {
          title: 'Checkout Page',
          items: cart.generateArray(),
          totalPrice: roundTo(cart.totalPrice, 2),
          bodyClass: 'registration',
          containerWrapper: 'container'
        });
      } else {
        Variant.findById(productId, function (e, variant) {
          if (e) {
            console.log("Failed on router.get('/add-to-bag/:id')\nError:".error, e.message.error + "\n")
            e.status = 406;
            next(e);
          } else {
            Product.findById(variant.productID, function (e, p) {
              let color = (variant.color) ? "- " + variant.color : "";
              variant.title = p.title + " " + color
              variant.price = roundTo(p.price,2)
              cart.add(variant, variant.id);
              req.session.cart = cart;
              res.render('checkout', {
                title: 'Checkout Page',
                items: cart.generateArray(),
                totalPrice: roundTo(cart.totalPrice,2),
                bodyClass: 'registration',
                containerWrapper: 'container'
              });
            })
          }
        })
      }
    }
  })
});


/////////////////////////////////////////////////////////////////////
//
// Function decreaseInventory
//
// Decrease the inventory quantity whenever a customer buy an item.
//
/////////////////////////////////////////////////////////////////////
function decreaseInventory(cartItems, callback) {
  for (let item in cartItems) {
    let qty = cartItems[item].qty;
    console.log("QTY IS: ", qty)
    Product.getProductByID(item, function (e, p) {
      if (p) {
        Product.findOneAndUpdate({
          "_id": item
        }, {
          $set: {
            "quantity": p.quantity - qty,
          }
        }, {
          new: true
        }, function (e, result) {

        });
      } else {
        Variant.getVariantByID(item, function (e, v) {
          Variant.findOneAndUpdate({
            "_id": item
          }, {
            $set: {
              "quantity": v.quantity - qty,
            }
          }, {
            new: true
          }, function (e, result) {

          });
        });
      }
    });
  }

  return callback(true)
}

/////////////////////////////////////////////////////////////////////
//
// Function ensureAuthenticated()
//
// Check if the user authenticated or not. If not returns to login page
//
/////////////////////////////////////////////////////////////////////
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    Department.getAllDepartments(function (e, departments) {
      req.session.department = JSON.stringify(departments)
      return next();
    })
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/');
  }
};

module.exports = router;
