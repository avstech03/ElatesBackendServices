module.exports = {
    userService: require("./userService").getInst(),
    productService: require("./productService").getInst(),
    categoryService: require("./categoryService").getInst(),
};