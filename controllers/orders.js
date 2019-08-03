const express = require("express");
const router = express.Router();
const { db_connection } = require("../db/db_connection");
const { Order, ShippingAddress, OrderItem } = require("../models/order");
const { infoLogger, errorLogger } = require("../utils/logger");
const { orderValidator } = require("../utils/bodyValidators");
const verifyToken = require("../middlewares/verify-token");
const verifyAdmin = require("../middlewares/verify-admin");

router.post("/", [verifyToken], async (req, res, next) => {
    try {
        infoLogger.log({
            level: "info",
            message: JSON.stringify(req.body)
        });
        const obj = req.body;
        const { error } = orderValidator(req.body);
        if (error) {
            return res.status(400).json({ error: 1, body: error.details[0].message });
        }
        const shipping = new ShippingAddress(
            obj.shipping.name,
            obj.shipping.address_1,
            obj.shipping.city,
            obj.shipping.address_2
        );
        const orderItems = [];
        for (let item of obj.orderItems) {
            orderItems.push(new OrderItem(item.productId, item.quantity))
        }
        const order = new Order(obj.userID, orderItems, shipping, obj.total_price, obj.created_on);

        db_connection.transaction(trx => {

            const promises = [];

            trx('shippings').insert({
                name: shipping._name,
                address_1: shipping._address1,
                address_2: shipping._address2,
                city: shipping._city
            }, 'id')
                .transacting(trx)
                .then(shippingId => {
                    trx('orders').insert({
                        userid: +order._userId,
                        total_price: +order._total_price,
                        shipping: +shippingId,
                        created_on: order._created_on
                    }, 'id')
                        .transacting(trx)
                        .then(orderId => {

                            orderItems.forEach(item => {
                                promises.push(
                                    trx('orderitems').insert({
                                        orderid: +orderId,
                                        productid: +item._productId,
                                        quantity: +item._quantity
                                    })
                                        .transacting(trx)
                                );
                            });
                            return Promise.all(promises);
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                })
        }).then(result => {
            return res.status(200).json(result.length);
        }).catch(exc => {
            res.status(500).json(exc);
            throw exc;
        });

    } catch (ex) {
        next(ex);
    }
});

router.get("/user/:id", [verifyToken], async (req, res, next) => {
    try {
        infoLogger.log({
            level: "info",
            message: JSON.stringify(req.body)
        });
        const userId = parseInt(req.params["id"]);
        if (isNaN(userId) || userId <= 0) {
            errorLogger.log({
                level: "error",
                message: JSON.stringify(req.originalUrl + "::").concat(
                    JSON.stringify(req.params)
                )
            });
            return res.status(400).json({ error: 1, body: "ID must be a number" });
        }
        const orders = await db_connection("orders")
            .select("*")
            .where({
                userid: userId
            });
        return res.status(200).json(orders);
    } catch (exc) {
        next(exc);
    }
});

router.get("/:orderId", [verifyToken], async (req, res, next) => {
    try {
        infoLogger.log({
            level: "info",
            message: JSON.stringify(req.body)
        });
        const orderId = parseInt(req.params["orderId"]);
        if (isNaN(orderId) || orderId <= 0) {
            errorLogger.log({
                level: "error",
                message: JSON.stringify(req.originalUrl + "::").concat(
                    JSON.stringify(req.params)
                )
            });
            return res.status(400).json({ error: 1, body: "ID must be a number" });
        }

        const orderItems = await db_connection("orderitems")
            .innerJoin("products", "orderitems.productid", "products.id")
            .where("orderitems.orderid", orderId)
            .select("products.id", "products.imageurl", "products.title", "products.price", "orderitems.quantity");

        return res.status(200).json(orderItems);

    } catch (exc) {
        next(exc);
    }
});

router.get("/", [verifyAdmin, verifyToken], async (req, res, next) => {
    try {

        infoLogger.log({
            level: "info",
            message: JSON.stringify(req.body)
        });

        const orders = await db_connection("orders").select("*").orderBy("created_on", "asc");
        return res.status(200).json(orders);

    } catch (exc) {
        next(exc);
    }
});

router.get("/shipping/:shippingId", [verifyToken, verifyAdmin], async (req, res, next) => {
    try {

        infoLogger.log({
            level: "info",
            message: JSON.stringify(req.body)
        });
        const shippingId = parseInt(req.params["shippingId"]);
        if (isNaN(shippingId) || shippingId <= 0) {
            errorLogger.log({
                level: "error",
                message: JSON.stringify(req.originalUrl + "::").concat(
                    JSON.stringify(req.params)
                )
            });
            return res.status(400).json({ error: 1, body: "ID must be a number" });
        }
        const shipping = await db_connection("shippings").select("*").where("id", shippingId);
        return res.status(200).json(shipping[0]);
    } catch (exc) {
        next(exc);
    }
})

module.exports = router;