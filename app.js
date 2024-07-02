const { Sequelize,Model,DataTypes} = require('sequelize');

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

    const createEnumTypes = async () => {
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
      } catch (err) {
        console.error("Error creating enum types:", err);
      }
    };
    
  createEnumTypes();

const createSequences = async () => {
      try {
        await sequelize.query(`CREATE SEQUENCE cate START 1 INCREMENT 1`);
        await sequelize.query(`CREATE SEQUENCE pur START 1 INCREMENT 1`);
        await sequelize.query(`CREATE SEQUENCE emp START 1 INCREMENT 1`);
        console.log("Sequences created successfully");
      } catch (err) {
        console.error("Error creating sequences:", err);
      }
    };
    
    createSequences();

const cust = sequelize.define(
        'Customers',
        {
          // Model attributes are defined here
          custId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
          },
          name: {
            type: DataTypes.STRING,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "email"
            // allowNull defaults to true
          },
          phone: {
            type:DataTypes.STRING(1234),
            allowNull: false,
            // allowNull defaults to true
          },
          gender: {
            type: DataTypes.ENUM('Male', 'Female'),
            // allowNull defaults to true
          },
          city: {
            type:DataTypes.STRING,
            // allowNull defaults to true
          },
        },
        {
            // timestamps: false,
          }
      );
  // `sequelize.define` also returns the model
  console.log(cust === sequelize.models.cust); 
  sequelize.sync()
  .then(() => {
    console.log('customers table has been created.');
  })
  .catch(error => {
    console.error('Unable to create the table customers:', error);
  });
// Synchronize the database
// sequelize.sync() // force: true will drop the table if it already exists
//     .then(() => {
//         console.log("Database synchronized");

//         // Create a user
//         return cust.create({
//             firstName: "sunny",
//             lastName: "Hongandhe"
//         });
//     })
//     .then(User1 => {
//         console.log("User created:", User1.toJSON());
//     })
//     .catch(err => {
//         console.error("Error in synchronization or creating user:", err);
//     });
    
//inserting data into customers
const insertCustomers = async () => {
  try {
    const customers = await cust.bulkCreate([
      { name: 'Anoosha', email: 'anoosha@gmail.com', phone: 9876545363, gender: 'Female', city: 'Banglore' },
      { name: 'Hareesh', email: 'hareesh@gmail.com', phone: 987234232, gender: 'Male', city: 'Hyderabad' },
      { name: 'Surya', email: 'surya@gmail.com', phone: 8656399393, gender: 'Male', city: 'Adilabad' },
      { name: 'Soujanya', email: 'soujanya@gmail.com', phone: 8563679090, gender: 'Female', city: 'Bhainsa' }
    ]);

    console.log(customers.length); // Logs the number of customers
    console.log(customers[0].name); // Logs the name of the first customer
    console.log(customers[0].custId); // Logs the customer ID of the first customer
    
    return customers; // Return the created customers
  } catch (err) {
    console.log("error in async");
    return null; // Return null or handle the error as needed
  }
};

// Invoke the function
insertCustomers().then(customers => {
  if (customers) {
    console.log("Customers inserted successfully");
  } else {
    console.log("Failed to insert customers");
  }
});

//creating brands table
//type: Sequelize.ENUM('free', 'premium'),

const brand=sequelize.define(
  'Brands',{
    brandid:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: sequelize.literal("nextval('cate')")
    },
    brandName:{
      type: DataTypes.ENUM('Rel_digital', 'Jiomart', 'Trends', 'Ajio', 'Smart_brandName', 'Netmeds', 'Petroleum', 'Tira', 'Jewels'),
      allowNull: false
    },
    city:{
      type:DataTypes.STRING,
    }
  }
);
console.log(brand === sequelize.models.brand); 
sequelize.sync()
.then(() => {
  console.log('brands table has been created.');
})
.catch(error => {
  console.error('Unable to create the table brands:', error);
});

//inserting data into brands
const insertBrands = async () => {
  try {
    const brands = await brand.bulkCreate([
      { brandName: 'Rel_digital', city: 'Banglore' },
      { brandName: 'Jiomart',city: 'Hyderabad' },
      { brandName: 'Trends', city: 'Chennai' },
      { brandName: 'Netmeds', city: 'Bhainsa' },
      { brandName: 'Petroleum', city: 'Mumbai' }
    ]);

    return brands; // Return the created brands
  } catch (err) {
    console.log("error in async");
    return null; // Return null or handle the error as needed
  }
};

// Invoke the function
insertBrands().then(brands => {
  if (brands) {
    console.log("Brands inserted successfully");
  } else {
    console.log("Failed to insert brands");
  }
});
