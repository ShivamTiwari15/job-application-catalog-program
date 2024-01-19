class Catalogue {
    constructor() {
        // Define initial product prices
        this.products = { "Product A": 20, "Product B": 40, "Product C": 50 };
        // Cart to store user's selected products and quantities
        this.cart = {};
        // Discount rules and corresponding functions
        this.discountRules = {
            "flat_10_discount": (total) => (total > 200 ? 10 : 0),
            "bulk_5_discount": (qty, price) => (qty > 10 ? price * 0.05 : 0),
            "bulk_10_discount": (totalQty, price) => (totalQty > 20 ? price * 0.10 : 0),
            "tiered_50_discount": (totalQty, singleQty, price) =>
                totalQty > 30 && singleQty > 15 ? price * 0.5 : 0,
        };
        // Fees for gift wrapping and shipping
        this.giftWrapFee = 1;
        this.shippingFee = 5;
        this.unitsPerPackage = 10;
    }

    // Function to calculate the most beneficial discount
    calculateDiscount(totalQty, singleQty, price) {
        const discounts = {};
        for (const rule in this.discountRules) {
            discounts[rule] = this.discountRules[rule](totalQty, singleQty, price);
        }
        const maxDiscountRule = Object.keys(discounts).reduce((a, b) => (discounts[a] > discounts[b] ? a : b));
        return [maxDiscountRule, discounts[maxDiscountRule]];
    }

    // Function to calculate total costs and fees
    calculateTotal() {
        const totalAmount = Object.values(this.cart).reduce((sum, item) => sum + item.total, 0);
        const totalQuantity = Object.values(this.cart).reduce((sum, item) => sum + item.quantity, 0);
        const maxDiscountRule = this.calculateDiscount(
            totalQuantity,
            Math.max(...Object.values(this.cart).map((item) => item.quantity)),
            totalAmount
        )[0];
        const shippingFee = Math.floor(totalQuantity / this.unitsPerPackage) * this.shippingFee;
        const total =
            totalAmount -
            this.discountRules[maxDiscountRule](
                totalQuantity,
                Math.max(...Object.values(this.cart).map((item) => item.quantity)),
                totalAmount
            ) +
            shippingFee +
            this.giftWrapFee * totalQuantity;
        return [totalAmount, maxDiscountRule, this.discountRules[maxDiscountRule](
            totalQuantity,
            Math.max(...Object.values(this.cart).map((item) => item.quantity)),
            totalAmount), shippingFee, total];
    }

    // Function to add items to the cart
    addToCart(product, quantity, isGiftWrapped) {
        const totalPrice = this.products[product] * quantity;
        this.cart[product] = { quantity, total: totalPrice, giftWrapped: isGiftWrapped };
    }

    // Function to process the checkout
    checkout() {
        for (const product in this.products) {
            const quantity = parseInt(prompt(`Enter the quantity of ${product}:`), 10);
            const isGiftWrapped = prompt(`Is ${product} wrapped as a gift? (yes/no):`).toLowerCase() === "yes";
            this.addToCart(product, quantity, isGiftWrapped);
        }

        const [subtotal, discountRule, discountAmount, shippingFee, total] = this.calculateTotal();

        console.log("\nOrder Details:");
        for (const item in this.cart) {
            console.log(`${item}: Quantity - ${this.cart[item].quantity}, Total - $${this.cart[item].total}`);
        }

        console.log("\nSubtotal:", subtotal);
        console.log("Discount Applied:", `${discountRule} - $${discountAmount}`);
        console.log("Shipping Fee:", shippingFee);
        console.log("Gift Wrap Fee:", this.giftWrapFee * Object.values(this.cart).reduce((sum, item) => sum + item.quantity, 0));
        console.log("\nTotal:", total);
    }
}

// Instantiate the Catalogue class and initiate the checkout process
const catalogue = new Catalogue();
catalogue.checkout();
