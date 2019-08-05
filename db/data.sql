create TABLE categories
(
    id serial PRIMARY KEY,
    description VARCHAR(32) NOT NULL
);

create TABLE users
(
    id serial PRIMARY KEY,
    email VARCHAR(128) unique NOT NULL,
    password VARCHAR(128) NOT NULL,
    fullname VARCHAR(128) NOT NULL,
    isadmin SMALLINT NOT NULL
);

create TABLE shippings
(
    id serial PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    address_1 VARCHAR(128) NOT NULL,
    address_2 VARCHAR(64) DEFAULT NULL,
    city VARCHAR(24) NOT NULL
);

create TABLE products
(
    id serial PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    price NUMERIC(6,2) NOT NULL,
    category SMALLINT NOT NULL REFERENCES categories(id),
    imageurl VARCHAR(256) NOT NULL
);

create TABLE orders
(
    id serial PRIMARY KEY,
    userid INTEGER NOT NULL REFERENCES users(id),
    total_price NUMERIC(8,2) NOT NULL,
    shipping INTEGER NOT NULL REFERENCES shippings(id),
    created_on TIMESTAMP NOT NULL
);

create TABLE orderitems
(
    orderid INTEGER NOT NULL REFERENCES orders(id),
    productid INTEGER NOT NULL REFERENCES products(id),
    quantity SMALLINT NOT NULL,
    PRIMARY KEY(orderid, productid)
);

insert into users
    (email, password, fullname, isadmin)
values
    (
        'gulabli.rufat@gmail.com',
        '$2a$10$/B0sj/2Ab86pNSv03mhvg.L.lYeH13omP6iRQlCASnpypJZzTC7A6',
        'Rufat Gulabli',
        1
);
insert into users
    (email, password, fullname, isadmin)
values
    (
        'samir_mammadli@hotmail.com',
        '$2a$10$w6sFrJlgCrhBYBsgiEAzMOw1q6JUHK0YUufk4Qh4eQ7pHfFi6CjGW',
        'Samir Mammadli',
        0
);

insert into users
    (email, password, fullname, isadmin)
values
    (
        'ali@mail.ru',
        '$2a$10$IW6yLPYvDZoHIk8SrjVhp.kk/2z8XfjahxhCgacLd7suDz7ROY8Yq',
        'Ali Babayev',
        0
);


