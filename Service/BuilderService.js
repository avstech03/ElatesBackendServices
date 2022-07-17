module.exports = {
    userService: require("./userService").getInst(),
    productService: require("./productService").getInst(),
    categoryService: require("./categoryService").getInst(),
    offerService: require("./offerService").getInst(),
    homescreentemplateService: require("./homescreentemplateService").getInst(),
    orderService: require("./orderService").getInst(),
    couponService: require("./couponService").getInst(),
    cartService: require("./cartService").getInst(),
};