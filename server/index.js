const express = require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const cors = require('cors')
app.use(cors())

const mysql = require('mysql2/promise');

const port = 3000;

let conn = null;

async function initMySql() {
    try {
        conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'tutorials',
            port: 3306
        })
    } catch (error) {
        console.error('Error connecting to mysql server users:', error.message)
        res.status(500).json({ error: 'something went wrong' })
    }
};


// GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
// POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
// GET /users/:id สำหรับการดึง users รายคนออกมา
// PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
// DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)


// GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req, res) => {

    try {
        let results = await conn.query('SELECT * FROM users')
        res.json(results[0])
    } catch (error) {
        console.error('Error fetching users:', error.message)
        res.status(500).json({ error: 'something went wrong' })
    }
});


// POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', async (req, res) => {

    try {
        let user = req.body

        let results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'Inserted',
            data: results[0]
        })
    } catch (error) {
        console.error('Error inserting user:', error.message)
        res.status(500).json({ error: 'something went wrong' })
    }
});

// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', async (req, res) => {

    try {
        let id = req.params.id
        let results = await conn.query('SELECT * FROM users WHERE id = ?', id)

        if (results[0].length == 0) {
            throw { statusCode: 404, message: '404 not found' }

        } else {
            res.send({
                message: "information of user id: " + id,
                data: results[0][0]
            })
        }
    } catch (error) {
        let statusCode = error.statusCode || 500
        console.error('Error getting user by id:', error.message)
        res.status(statusCode).json({ error: 'something went wrong' })
    }

})

// put แก้,update ทั้งหมด
// PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/user/:id', async (req, res) => {

    try {
        let id = req.params.id
        let updateUser = req.body
        let results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id])
        res.json({
            message: 'Updated',
            data: results[0]
        })
    } catch (error) {
        console.error('Error updating user:', error.message)
        res.status(500).json({ error: 'something went wrong' })
    }
});

// delete
// DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/user/:id', async (req, res) => {
    try {
        let id = req.params.id
        let results = await conn.query('DELETE from users WHERE id = ?', id)
        res.json({
            message: 'Deleted',
            data: results[0]
        })
    } catch (error) {
        console.error('Error updating user:', error.message)
        res.status(500).json({ error: 'something went wrong' })
    }

});


app.listen(port, async () => {
    await initMySql()
    console.log('Listening to port: ' + port);
});