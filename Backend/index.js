const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8000;
app.use(bodyParser.json());

let users = [];
let counter = 1;
// path = GET /users
app.get('/users', (req, res) => {
    res.json(users);
});

// path = post /user
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter;
    counter += 1;
    users.push(user);
    res.json({ 
        message: 'User added successfully', 
        user: user });
})

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

