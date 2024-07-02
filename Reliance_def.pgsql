CREATE SEQUENCE cust start 1 increment 1;
CREATE TABLE customers (
    custid integer DEFAULT nextval('cust') PRIMARY KEY,
    name varchar(30),
    email varchar(40),
    phone numeric(10),
    gender varchar(1),
    city varchar(30)
);

CREATE TYPE Rel_digital AS ENUM ('phone', 'tv','laptop','refrigerator','ac');
CREATE TYPE Jiomart AS ENUM ('dry fruits', 'vegetables','chacolates','flour','oils');
CREATE TYPE Trends AS ENUM ('jeans', 'kurti','tshirt','shirt','tops');
CREATE TYPE Ajio AS ENUM ('dresses', 'jewellery','homestyle','beauty','footwear');
CREATE TYPE Smart_brandName AS ENUM ('detergents', 'pulses','oils','fruits','vegetables');
CREATE TYPE Netmeds AS ENUM ('painrelievers', 'skincare','oralcare','medicaldevices','eyecare');
CREATE TYPE Petroleum AS ENUM ('petrol', 'diesel','gas');
CREATE TYPE Tira AS ENUM ('compact', 'foundation','serum','kajal','primer');
CREATE TYPE Jewels AS ENUM ('ring', 'bangle','chain','bracelete','earrings');


CREATE TYPE category AS ENUM('Rel_digital','Jiomart','Trends','Ajio','Smart_brandName','Netmeds','Petroleum','Tira','Jewels'); 

CREATE SEQUENCE cate start 1 increment 1;
CREATE TABLE brand (
    brandid integer DEFAULT nextval('cate') PRIMARY KEY,
    brandName category,
    city varchar(30)
);

CREATE SEQUENCE pur start 1 increment 1;
CREATE TABLE purchase (
    pid integer DEFAULT nextval('pur') PRIMARY KEY,
    custid integer,
    brandid integer,
    brandName category,
    item varchar,
    amount integer,
    date DATE not NULL,
    Foreign key(custid) references customers(custid),
    Foreign key(brandid) references brand(brandid),
    CHECK (
        CASE
            WHEN brandName = 'Rel_digital' THEN item::Rel_digital IS NOT NULL
            WHEN brandName = 'Jiomart' THEN item::Jiomart IS NOT NULL
            WHEN brandName = 'Trends' THEN item::Trends IS NOT NULL
            WHEN brandName = 'Ajio' THEN item::Ajio IS NOT NULL
            WHEN brandName = 'Smart_brandName' THEN item::Smart_brandName IS NOT NULL
            WHEN brandName = 'Netmeds' THEN item::Netmeds IS NOT NULL
             WHEN brandName = 'Petroleum' THEN item::Petroleum IS NOT NULL
            WHEN brandName = 'Tira' THEN item::Tira IS NOT NULL
            WHEN brandName = 'Jewels' THEN item::Jewels IS NOT NULL
            ELSE FALSE
        END
    )
);

CREATE SEQUENCE emp start 100 increment 1;
CREATE TABLE employee(
    empid integer DEFAULT nextval('emp') PRIMARY KEY,
    empName varchar(30),
    branchid integer,
    branch category,
    email varchar(40),
    phone numeric(10),
    foreign key(branchid) references brand(brandid)
);