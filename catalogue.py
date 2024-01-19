class Catalogue:
    def __init__(self):
        # Define initial product prices
        self.products = {"Product A": 20, "Product B": 40, "Product C": 50}
        # Cart to store user's selected products and quantities
        self.cart = {}
        # Discount rules and corresponding functions
        self.discount_rules = {
            "flat_10_discount": lambda total: 10 if total > 200 else 0,
            "bulk_5_discount": lambda qty, price: price * 0.05 if qty > 10 else 0,
            "bulk_10_discount": lambda total_qty, price: price * 0.10 if total_qty > 20 else 0,
            "tiered_50_discount": lambda total_qty, single_qty, price: (price * 0.5) if (total_qty > 30 and single_qty > 15) else 0
        }
        # Fees for gift wrapping and shipping
        self.gift_wrap_fee = 1
        self.shipping_fee = 5
        self.units_per_package = 10

    def calculate_discount(self, total_qty, single_qty, price):
        # Calculate discounts based on predefined rules
        discounts = {rule: rule_func(total_qty, single_qty, price) for rule, rule_func in self.discount_rules.items()}
        # Choose the most beneficial discount rule
        return max(discounts, key=discounts.get), discounts[max(discounts, key=discounts.get)]

    def calculate_total(self):
        # Calculate total amount, quantities, and fees
        total_amount = sum(self.cart[item]["total"] for item in self.cart)
        total_quantity = sum(self.cart[item]["quantity"] for item in self.cart)
        discount_rule, discount_amount = self.calculate_discount(total_quantity, max(self.cart[item]["quantity"] for item in self.cart), total_amount)
        shipping_fee = (total_quantity // self.units_per_package) * self.shipping_fee
        total = total_amount - discount_amount + shipping_fee + (self.gift_wrap_fee * total_quantity)
        return total_amount, discount_rule, discount_amount, shipping_fee, total

    def add_to_cart(self, product, quantity, is_gift_wrapped):
        # Add selected products to the cart
        total_price = self.products[product] * quantity
        self.cart[product] = {"quantity": quantity, "total": total_price, "gift_wrapped": is_gift_wrapped}

    def checkout(self):
        # User input for product quantities and gift wrapping
        for product in self.products:
            quantity = int(input(f"Enter the quantity of {product}: "))
            is_gift_wrapped = input(f"Is {product} wrapped as a gift? (yes/no): ").lower() == "yes"
            self.add_to_cart(product, quantity, is_gift_wrapped)

        # Calculate and display order details
        subtotal, discount_rule, discount_amount, shipping_fee, total = self.calculate_total()

        print("\nOrder Details:")
        for item in self.cart:
            print(f"{item}: Quantity - {self.cart[item]['quantity']}, Total - ${self.cart[item]['total']}")

        print("\nSubtotal:", subtotal)
        print("Discount Applied:", f"{discount_rule} - ${discount_amount}")
        print("Shipping Fee:", shipping_fee)
        print("Gift Wrap Fee:", self.gift_wrap_fee * sum(self.cart[item]["quantity"] for item in self.cart))
        print("\nTotal:", total)


if __name__ == "__main__":
    # Instantiate the Catalogue class and initiate the checkout process
    catalogue = Catalogue()
    catalogue.checkout()
