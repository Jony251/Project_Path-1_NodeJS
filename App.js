const express = require('express');          
const app = express();                        
const userRoutes = require('./routes/user');  
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders'); 
const port = 3000;                           
const db = require('./database/dbSingleton') 
const bcrypt = require('bcrypt');            
const session = require('express-session');
const MySQLStore = require('connect-mysql')(session);

/**
 * Session middleware configuration
 * Uses MySQL store to persist sessions
 */
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
        config: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'user_db'
        }
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(express.json());

/**
 * Authentication middleware
 * Checks if user is logged in
 */
const authenticateUser = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized - Please log in' });
    }
    next();
};

/**
 * Admin authentication middleware
 * Checks if user has admin role
 */
const authenticateAdmin = (req, res, next) => {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    next();
};

app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to our shop API!',
        endpoints: {
            users: '/users',
            products: '/products',
            orders: '/orders'
        },
        isLoggedIn: !!req.session.userId
    });
});

app.use('/users', userRoutes);
app.use('/products', authenticateUser, productRoutes);
app.use('/orders', authenticateUser, orderRoutes);

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
    console.log(`GET    http://localhost:${port}/users         - Get all users (admin only)`);
    console.log(`GET    http://localhost:${port}/users/:id     - Get user by ID`);
    console.log(`POST   http://localhost:${port}/users/register - Register new user`);
    console.log(`POST   http://localhost:${port}/users/login    - Login user`);
    console.log(`POST   http://localhost:${port}/users/logout   - Logout user`);
    console.log(`PUT    http://localhost:${port}/users/:id      - Update user (self or admin)`);
    console.log(`DELETE http://localhost:${port}/users/:id      - Delete user (admin only)`);

    console.log('\nProducts:');
    console.log(`GET    http://localhost:${port}/products        - Get all products`);
    console.log(`GET    http://localhost:${port}/products/:id    - Get product by ID`);
    console.log(`POST   http://localhost:${port}/products        - Create new product`);
    console.log(`PUT    http://localhost:${port}/products/:id    - Update product (creator or admin)`);
    console.log(`DELETE http://localhost:${port}/products/:id    - Delete product (creator or admin)`);

    console.log('\nOrders:');
    console.log(`GET    http://localhost:${port}/orders         - Get all orders (admin only)`);
    console.log(`GET    http://localhost:${port}/orders/:id     - Get order by ID`);
    console.log(`POST   http://localhost:${port}/orders         - Create new order`);
    console.log(`PUT    http://localhost:${port}/orders/:id     - Update order (admin only)`);
    console.log(`DELETE http://localhost:${port}/orders/:id     - Delete order (admin only)`);
});