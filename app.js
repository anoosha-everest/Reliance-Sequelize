const { Sequelize, Model, DataTypes } = require('sequelize');

// Create sequelize instance with logging enabled
const sequelize = new Sequelize('actualdb', 'anoosha', 'anoosha', {
    host: 'localhost',
    dialect: 'postgres'
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log("Connection successful");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

const createEnumTypesAndSequences = async () => {
    try {
        await sequelize.query(`
                CREATE TYPE "Rel_digital" AS ENUM ('phone', 'tv', 'laptop', 'refrigerator', 'ac');
                CREATE TYPE "Jiomart" AS ENUM ('dry fruits', 'vegetables', 'chocolates', 'flour', 'oils');
                CREATE TYPE "Trends" AS ENUM ('jeans', 'kurti', 'tshirt', 'shirt', 'tops');
                CREATE TYPE "Ajio" AS ENUM ('dresses', 'jewellery', 'homestyle', 'beauty', 'footwear');
                CREATE TYPE "Smart_brandName" AS ENUM ('detergents', 'pulses', 'oils', 'fruits', 'vegetables');
                CREATE TYPE "Netmeds" AS ENUM ('painrelievers', 'skincare', 'oralcare', 'medicaldevices', 'eyecare');
                CREATE TYPE "Petroleum" AS ENUM ('petrol', 'diesel', 'gas');
                CREATE TYPE "Tira" AS ENUM ('compact', 'foundation', 'serum', 'kajal', 'primer');
                CREATE TYPE "Jewels" AS ENUM ('ring', 'bangle', 'chain', 'bracelete', 'earrings');
                CREATE TYPE "category" AS ENUM('Rel_digital', 'Jiomart', 'Trends', 'Ajio', 'Smart_brandName', 'Netmeds', 'Petroleum', 'Tira', 'Jewels');
        `);
        console.log("Enum types created successfully");

        await sequelize.query(`
                CREATE SEQUENCE cate START 1 INCREMENT 1;
                CREATE SEQUENCE pur START 1 INCREMENT 1;
        `);
        console.log("Sequences created successfully");
    } catch (err) {
        console.error("Error creating enum types or sequences:", err);
    }
};

createEnumTypesAndSequences();

const cust = sequelize.define('Customers', {
    custId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "email"
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female'),
    },
    city: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'Customers'
});

const brand = sequelize.define('Brands', {
    brandid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        defaultValue: sequelize.literal("nextval('cate')")
    },
    brandName: {
        type: DataTypes.ENUM('Rel_digital', 'Jiomart', 'Trends', 'Ajio', 'Smart_brandName', 'Netmeds', 'Petroleum', 'Tira', 'Jewels'),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'Brands'
});

const purchase = sequelize.define('Purchase', {
    pid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        defaultValue: sequelize.literal("nextval('pur')")
    },
    custId: {
        type: DataTypes.INTEGER,
        references: {
            model: cust,
            key: 'custId'
        }
    },
    brandid: {
        type: DataTypes.INTEGER,
        references: {
            model: brand,
            key: 'brandid'
        }
    },
    brandName: {
        type: DataTypes.ENUM('Rel_digital', 'Jiomart', 'Trends', 'Ajio', 'Smart_brandName', 'Netmeds', 'Petroleum', 'Tira', 'Jewels'),
    },
    item: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'Purchase',
    validate: {
        itemType() {
            const validItems = {
                Rel_digital: ['phone', 'tv', 'laptop', 'refrigerator', 'ac'],
                Jiomart: ['dry fruits', 'vegetables', 'chocolates', 'flour', 'oils'],
                Trends: ['jeans', 'kurti', 'tshirt', 'shirt', 'tops'],
                Ajio: ['dresses', 'jewellery', 'homestyle', 'beauty', 'footwear'],
                Smart_brandName: ['detergents', 'pulses', 'oils', 'fruits', 'vegetables'],
                Netmeds: ['painrelievers', 'skincare', 'oralcare', 'medicaldevices', 'eyecare'],
                Petroleum: ['petrol', 'diesel', 'gas'],
                Tira: ['compact', 'foundation', 'serum', 'kajal', 'primer'],
                Jewels: ['ring', 'bangle', 'chain', 'bracelete', 'earrings']
            };
            if (!validItems[this.brandName].includes(this.item)) {
                console.error('Invalid item type for the specified brand');
            }
        }
    }
});

sequelize.sync({ force: true })
    .then(() => {
        console.log('Database synchronized');

        const insertCustomers = async () => {
            try {
                const customers = await cust.bulkCreate([
                    { name: 'Anoosha', email: 'anoosha@gmail.com', phone: '9876545363', gender: 'Female', city: 'Banglore' },
                    { name: 'Hareesh', email: 'hareesh@gmail.com', phone: '987234232', gender: 'Male', city: 'Hyderabad' },
                    { name: 'Surya', email: 'surya@gmail.com', phone: '8656399393', gender: 'Male', city: 'Adilabad' },
                    { name: 'Soujanya', email: 'soujanya@gmail.com', phone: '8563679090', gender: 'Female', city: 'Bhainsa' }
                ]);
                console.log('Customers inserted successfully');
                return customers;
            } catch (err) {
                console.error("Error inserting customers:", err);
                return null;
            }
        };

        const insertBrands = async () => {
            try {
                const brands = await brand.bulkCreate([
                    { brandName: 'Rel_digital', city: 'Banglore' },
                    { brandName: 'Jiomart', city: 'Hyderabad' },
                    { brandName: 'Trends', city: 'Chennai' },
                    { brandName: 'Netmeds', city: 'Bhainsa' },
                    { brandName: 'Petroleum', city: 'Mumbai' }
                ]);
                console.log('Brands inserted successfully');
                return brands;
            } catch (err) {
                console.error("Error inserting brands:", err);
                return null;
            }
        };

        const insertPurchase = async () => {
            try {
                const purchases = await purchase.bulkCreate([
                    { custId: 1, brandid: 91, brandName: "Rel_digital", item: "phone", amount: 1000, date: "2024-07-01" },
                    { custId: 2, brandid: 92, brandName: "Jiomart", item: "dry fruits", amount: 1200, date: "2024-03-05" },
                    { custId: 3, brandid: 94, brandName: "Netmeds", item: "skincare", amount: 2800, date: "2024-06-21" },
                    { custId: 4, brandid: 93, brandName: "Trends", item: "jeans", amount: 3900, date: "2024-07-19" },
                    { custId: 1, brandid: 95, brandName: "Petroleum", item: "petrol", amount: 9870, date: "2024-05-08" },
                    { custId: 3, brandid: 92, brandName: "Jiomart", item: "oils", amount: 9820, date: "2024-01-01" },
                    { custId: 4, brandid: 91, brandName: "Rel_digital", item: "laptop", amount: 13900, date: "2024-04-03" },
                    { custId: 2, brandid: 94, brandName: "Netmeds", item: "eyecare", amount: 7630, date: "2024-02-18" }
                ]);
                console.log('Purchases inserted successfully');
                return purchases;
            } catch (err) {
                console.error("Error inserting purchases:", err);
                return null;
            }
        };

        return Promise.all([insertCustomers(), insertBrands()]).then(() => insertPurchase());
    })
    .catch(error => {
        console.error('Error synchronizing the database:', error);
    });
