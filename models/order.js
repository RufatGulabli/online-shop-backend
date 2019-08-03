class Order {
    constructor(userId, orderItems, shippingAddress, total_price, created_on) {
        this._userId = userId;
        this._orderItems = orderItems;
        this._shippingAddress = shippingAddress;
        this._total_price = total_price;
        this._created_on = created_on;
    }
}

class ShippingAddress {
    constructor(name, address1, city, address2) {
        this._name = name;
        this._address1 = address1;
        this._city = city;
        this._address2 = address2 || null
    }
}

class OrderItem {
    constructor(productId, quantity) {
        this._productId = productId;
        this._quantity = quantity;
    }
}

module.exports = {
    Order,
    OrderItem,
    ShippingAddress
};
