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
            type: DataTypes.STRING,
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
    console.log('cust table has been created.');
  })
  .catch(error => {
    console.error('Unable to create the table:', error);
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
    

const insertCustomers = async () => {
  console.log("hello");
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

