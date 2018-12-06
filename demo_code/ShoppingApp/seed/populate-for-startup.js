var User        = require('../models/user');
var Category    = require('../models/categories');
var Department  = require('../models/department');
var Product     = require('../models/product');
var Variant     = require('../models/variant');
var mongoose    = require('mongoose');
//mongoose.connect('mongodb://localhost/shoppingApp');
//mongoose.connect('mongodb://localhost/myShoppingApp3', { useNewUrlParser: true, useCreateIndex: true, });
mongoose.connect('mongodb://james:james123@ds127644.mlab.com:27644/myapp');


var categories =
[
    new Category({
        categoryName        : 'IPhone10s'
    }),
    new Category({
        categoryName        : 'Wigs'
    }),
    new Category({
        categoryName        : 'ThinkPads'
    }),
    new Category({
        categoryName        : 'WaterBottles'
    }),
    new Category({
        categoryName        : 'Cars'
    })
]

for (let i = 0; i < categories.length; i++){
    categories[i].save(function(e, r) {
        if (i === categories.length - 1){
            exit();
        }
    });
}

var departments =
[
    new Department({
        departmentName      : 'Women',
        categories          : 'IPhone10s,Wigs'

    }),
    new Department({
        departmentName      : 'Men',
        categories          : 'ThinkPads,WaterBottles,Cars'
    })
]

for (let i = 0; i < departments.length; i++){
    departments[i].save(function(e, r) {
        if (i === departments.length - 1){
            exit();
        }
    });
}

var products =
[
    new Product({
        _id: "5bedf31cc14d7822b39d9d43",
        imagePath: "https://i.ytimg.com/vi/4riem49Yjus/maxresdefault.jpg",
        title: 'A Brand New AirPlane',
        description: 'Very smol',
        price: 35.95,
        color: 'Gray',
        size: 'XS,S,M',
        quantity: 10,
        department: 'Women',
        category: 'IPhone10s',
    }),
    new Product({
        _id: "5bedf31cc14d7822b39d9d43",
        imagePath: "https://s.hswstatic.com/gif/2017-Chevrolet-Corvette-Grand-Sport.jpg",
        title: 'Sports Car',
        description: 'very fast',
        price: 35.95,
        color: 'Gray',
        size: 'XS,S,M',
        quantity: 10,
        department: 'Women',
        category: 'IPhone10s',
    }),
    new Product({
        _id: "5bedf31cc14d7822b39d9d43",
        imagePath: "https://i.redd.it/zyh2i129cqjz.jpg",
        title: 'Toyoto Cameria',
        description: 'supper speedy',
        price: 35.95,
        color: 'Gray',
        size: 'XS,S,M',
        quantity: 10,
        department: 'Women',
        category: 'IPhone10s',
    }),
    new Product({
        _id: "5bedf3b9c14d7822b39d9d45",
        imagePath: "https://funnyfoto.org/wp-content/uploads/2018/01/dank-memes-for-the-weekend-28-memes-27_result.jpg",
        title: 'PinWheel',
        description: 'will spin',
        price: 29.99,
        color: 'Black',
        size: 'XS,S,XL',
        quantity: 15,
        department: 'Women',
        category: 'IPhone10s',
    }),
    new Product({
        _id: "5bedf448c14d7822b39d9d47",
        imagePath: "https://amp.businessinsider.com/images/57ec29fa077dccf2018b8c62-750-563.png",
        title: 'Nike Adidas Air Max',
        description: 'jump higher than ever',
        price: 25.99,
        color: 'White',
        size: 'XS',
        quantity: 90,
        department: 'Women',
        category: 'IPhone10s',
    }),
    new Product({
        _id: "5bedf55bc14d7822b39d9d4b",
        imagePath: "https://i.kym-cdn.com/entries/icons/original/000/000/091/TrollFace.jpg",
        title: 'Toy Soldier',
        description: 'bang bang',
        price: 79.99,
        color: 'Black',
        size: 'S,M,L',
        quantity: 4,
        department: 'Women',
        category: 'Wigs',
    }),
    new Product({
        _id: "5bedf5eec14d7822b39d9d4e",
        imagePath: "https://imgix.ranker.com/user_node_img/50065/1001280631/original/dr-no-chill-photo-u1?w=650&q=50&fm=jpg&fit=crop&crop=faces",
        title: 'Brand New Honda',
        description: 'very new, very brand',
        price: 79.99,
        color: 'Orange',
        size: 'M,L',
        quantity: 5,
        department: 'Men',
        category: 'ThinkPads',
    }),
    new Product({
        _id: "5bedf6b5c14d7822b39d9d51",
        imagePath: "https://cdn.vox-cdn.com/thumbor/PUswy3EF3nojtrMhUWeYabQEi9A=/0x0:2039x1359/1200x800/filters:focal(0x0:2039x1359)/cdn.vox-cdn.com/uploads/chorus_image/image/52590407/jkastrenakes_161222_1339_A_0018__1_.0.0.jpeg",
        title: 'Mac Book Pro',
        description: 'laptop is laptop',
        price: 79.99,
        color: 'Dark Blue',
        size: 'M,L',
        quantity: 80,
        department: 'Men',
        category: 'WaterBottles',
    }),
    new Product({
        _id: "5bedf720c14d7822b39d9d52",
        imagePath: "https://i.kinja-img.com/gawker-media/image/upload/s--5TGkQA5r--/c_scale,fl_progressive,q_80,w_800/sinpooscwadbvaangh7i.jpg",
        title: 'Android Phone',
        description: 'slim and thicc',
        price: 45.99,
        color: 'Light Blue',
        size: 'XS,S,M',
        quantity: 8,
        department: 'Men',
        category: 'WaterBottles',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d53",
        imagePath: "https://media.wired.com/photos/592708127034dc5f91bed670/4:3/w_2680,c_limit/rosegold-macbookft1.jpg",
        title: 'Linux The Game',
        description: 'Wow has nice pockets',
        price: 99.99,
        color: 'Brown',
        size: 'XS,M,XL',
        quantity: 12,
        department: 'Men',
        category: 'Cars',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d52",
        imagePath: "https://cdn.britannica.com/67/197567-131-1645A26E.jpg",
        title: 'PineApple',
        description: 'Very red and stickers',
        price: 99.99,
        color: 'Brown',
        size: 'XS,M,XL',
        quantity: 12,
        department: 'Men',
        category: 'Cars',
    }),
    new Product({
        _id: "5bedf7ecc14d7822b39d9d51",
        imagePath: "https://cdn-images-1.medium.com/max/1600/1*mONNI1lG9VuiqovpnYqicA.jpeg",
        title: '3000 series Phone',
        description: 'Black and long like an aligattor',
        price: 99.99,
        color: 'Brown',
        size: 'XS,M,XL',
        quantity: 12,
        department: 'Men',
        category: 'Cars',
    })
    
];

for (let i = 0; i < products.length; i++){
    products[i].save(function(e, r) {
        if (i === products.length - 1){
            exit();
        }
    });
}

var variants =
[
    new Variant({
        productID: '5bedf31cc14d7822b39d9d13',
        imagePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe0SrJgIcd0L9j7xghkwzaOLNe6no2MzXmDApbowiKJQ0o2hFg9Q",
        color: 'Beige',
        size: 'S,L',
        quantity: 5,
    }),
    new Variant({
        productID: '5bedf3b9c14d7822b39d9d43',
        imagePath: "https://cdn1.itpro.co.uk/sites/itpro/files/2018/09/it_pro_best_laptops_2.jpg",

        color: 'Copper',
        size: 'S,L,XL',
        quantity: 12,
    }),
    new Variant({
        productID: '5bedf448c14d7822b39d9d45',
        imagePath: "https://media.wired.com/photos/59b1a378a0df4b47dcf7ccb0/master/w_2400,c_limit/LamborghiniRoadsterTA.jpg",

        color: 'Maroon',
        size: 'XS,M,L',
        quantity: 4,
    }),
    new Variant({
        productID: '5bedf448c14d7822b39d9d46',
        imagePath: "https://media.wired.com/photos/59bafdf204afdc5248726f5c/master/w_2400,c_limit/BMW-TA.jpg",

        color: 'Charcool',
        size: 'XS,L,XL',
        quantity: 5,
    }),
    new Variant({
        productID: '5bedf5eec14d7822b39d9d3e',
        imagePath: 'https://pm1.narvii.com/6255/4840765b89df3d0e73ba15d5938ae2612b3f0ff7_hq.jpg',
        color: 'Stone',
        size: 'S,XL',
        quantity: 35,
    }),
    new Variant({
        productID: '5bedf720c14d7822b39d9d51',
        imagePath: 'https://cdn140.picsart.com/236830659023212.png?r1024x1024',
        color: 'Dark Blue',
        size: 'M,XL',
        quantity: 5,
    })
];

for (let i = 0; i < variants.length; i++){
    variants[i].save(function(e, r) {
        if (i === variants.length - 1){
            exit();
        }
    });
}

var newUser = new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Cuneyt Celebican',
    admin       : true
});

var newUser2 = new User({
    username    : 'james',
    password    : 'j',
    fullname    : 'James James',
    admin       : true
});
var newUser3 = new User({
    username    : 'paulina',
    password    : 'p',
    fullname    : 'paulina chametka',
    admin       : true
}); 
User.createUser(newUser2, function(err, user){
    if(err) throw err;
    console.log(user);
});
User.createUser(newUser3, function(err, user){
    if(err) throw err;
    console.log(user);
}); 

User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
});



function exit() {
    mongoose.disconnect();
}
