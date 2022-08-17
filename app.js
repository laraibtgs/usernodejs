const express = require('express');
const cors = require("cors")
const app = express();
const { randomUUID } = require('crypto'); 
const { getAllUser, getUserById, addOrUpdateUser, deleteUser } = require('./dynamo');

app.use(express.json());
const whitelist = ["http://localhost:3000","http://localhost:8080"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send("Hello From get request");
    res.end();
})

app.get('/users', async (req, res) => {
    try {
        const users = await getAllUser();
        res.json(users)
        res.end();
    } catch (error) {
        res.status(500).json({ err: "Somethingh WENT wrong" })
    }
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user = await getUserById(id);
        res.json(user)
        res.end();
    } catch (error) {
        res.status(500).json({ err: "Somethingh WENT wrong" })
    }
})

app.post('/users', async (req, res) => {
    const user = req.body;

    user.id = randomUUID()
    user.createdAt = new Date().toISOString()
    user.updatedAt = new Date().toISOString()

    try {
        const updatedUser = await addOrUpdateUser(user);
        res.json(user)
        res.end();
    } catch (error) {
        res.status(500).json({ err: "Somethingh WENT wrong" })
    }

})

app.put('/users/:id', async (req, res) => {
    const user = req.body;
    user.updatedAt = new Date().toISOString()

    try {
        const newUser = await addOrUpdateUser(user);
        res.json(user)
        res.end();
    } catch (error) {
        res.status(500).json({ err: "Somethingh WENT wrong" })
    }

})


app.delete('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
        const deletedUser = await deleteUser(id);
        res.json(deletedUser)
        res.end();
    } catch (error) {
        res.status(500).json({ err: "Somethingh WENT wrong" })
    }
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("listening")
})