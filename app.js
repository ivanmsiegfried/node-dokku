const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

// Setup SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)');
});

app.use(bodyParser.urlencoded({ extended: false }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Route to display all users (READ)
app.get('/', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.render('index', { users: rows });
    });
});

// Route to display form for adding a new user (CREATE)
app.get('/add', (req, res) => {
    res.render('edit', { user: null });
});

// Handle adding new user (CREATE)
app.post('/add', (req, res) => {
    const { name, email } = req.body;
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.redirect('/');
    });
});

// Route to display form for editing a user (UPDATE)
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        res.render('edit', { user: row });
    });
});

// Handle updating user (UPDATE)
app.post('/edit/:id', (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.redirect('/');
    });
});

// Handle deleting a user (DELETE)
app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.redirect('/');
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
