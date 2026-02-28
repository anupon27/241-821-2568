const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000;
app.use(bodyParser.json());

let users = [];
let counter = 1;

let conn = null
const initDBConnection = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8821
    })
}
//path = GET /users สำหรับเก็บข้อมูลuserทั้งหมดในระบบ
app.get('/users',async (req, res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
})

app.get('/users/:id', async (req, res) => {
    try{
        let id = req.params.id
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id);
        if(results[0].length == 0) {
            throw {statusCode: 404, message: 'User not found'};
        }
        res.json(results[0][0]);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message:'Error fetching user',
            error: error.message
        });
    }
})

app.put('/users/:id', async (req, res) => {
    try{
        let id = req.params.id
        let updatedUser = req.body;
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id]);
        if(results[0].length == 0) {
            throw {statusCode: 404, message: 'User not found'};
        }
        res.json({
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message:'Error updating user',
            error: error.message
        });
    }
})

app.delete('/users/:id', async (req, res) => {
    try{
        let id = req.params.id
        const results = await conn.query('DELETE FROM users WHERE id = ?', id);
        if(results[0].affectedRows == 0) {
            throw {statusCode: 404, message: 'User not found'};
        }
        res.json({message: 'User deleted successfully'});
    } catch (error) {
        console.error('Error deleting user:', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message:'Error deleting user',
            error: error.message
        });
    }
})



// path = GET /users
app.get('/users', (req, res) => {
    res.json(users);
});

// path = post /user
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user);
    console.log('results:', results);
    res.json({ 
        message: 'User added successfully',
        data: results[0]
    });
    }catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ 
            message: 'Error adding user',
            error: error.message
        });
    }
});

//path = PUT /user/:id
app.patch('/user/:id', (req, res) => {
    let id = req.params.id;
    let updatedUser = req.body;

    //หา user ที่มี id ตรงกับ id ที่ส่งมา
    let selectedIndex = users.findIndex(user => user.id == id);

    //อัพเดตข้อมูลของ user นั้นด้วยข้อมูลที่ส่งมาใน body
    if (selectedIndex === -1) {
        users[selectedIndex].name = users[selectedIndex].name;
        users[selectedIndex].email = users[selectedIndex].email;
    }
    users[selectedIndex].name = updatedUser.name || users[selectedIndex].name;
    users[selectedIndex].email = updatedUser.email || users[selectedIndex].email;

    //ส่ง response กลับไปว่าอัพเดตสำเร็จหรือไม่

    res.json({ 
        message: 'User updated successfully',
        data: {
         user: updatedUser,
         indexUpdated: selectedIndex
        } 
        });
})

// path = DELETE /user/:id
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
//หา user ที่มี id ตรงกับ id ที่ส่งมา
    let selectedIndex = users.findIndex(user => user.id == id);
    delete users[selectedIndex];
    users.splice(selectedIndex, 1);
    res.json({ 
        message: 'User deleted successfully',
         indexDeleted: selectedIndex
        });
});

app.listen(port, async () => {
    await initDBConnection();
    console.log(`Server is running on port ${port}`);
});
