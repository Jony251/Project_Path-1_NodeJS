const express = require('express');          
const app = express();                        
const userRoutes = require('./routes/user');  
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders'); 
const port = 3000;                           
const db = require('./database/dbSingleton') 
const bcrypt = require('bcrypt');            
const articlesRoutes = require('./routes/articles'); 

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to our shop API!',
        endpoints: {
            users: '/users',
            products: '/products',
            orders: '/orders'
        }
    });
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/articles', articlesRoutes); 

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('=== Available Routes ===');
    console.log(`http://localhost:${port}/users`);
    console.log(`http://localhost:${port}/articles`);
   
    console.log('\nUsers:');
    console.log(`GET    http://localhost:${port}/users`);
    console.log(`GET    http://localhost:${port}/users/WRITE_YOUR_ID_HERE`);
    console.log(`POST   http://localhost:${port}/users`);
    console.log(`POST   http://localhost:${port}/users/login`);
    console.log(`PUT    http://localhost:${port}/users/:id`);
    console.log(`DELETE http://localhost:${port}/users/:id`);

    console.log('\nArticles:');
    console.log(`GET    http://localhost:${port}/articles`);
    console.log(`GET    http://localhost:${port}/articles/WRITE_YOUR_ID_HERE`);
    console.log(`POST   http://localhost:${port}/articles`);
    console.log(`PUT    http://localhost:${port}/articles/:id`);
    console.log(`DELETE http://localhost:${port}/articles/:id`);

});