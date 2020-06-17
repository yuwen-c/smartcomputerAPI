const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// use knex to connect database to server
const db = knex({
    client: 'pg',  // postgre
    connection: {
      host : '127.0.0.1',  // localhost
      user : '',
      password : '',
      database : 'smartcomputer'
    }
});

// test
// db.select("*").from('users').then(data => console.log(data)); // []

const app = express();

// middlewear to decode req.body
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// database
const database = {
    users:[
        {
            id: 123,
            name: "Judy",
            email: "judy@gmail.com",
            password: "123",
            entries: 0,
            joined: new Date()
        },
        {
            id: 124,
            name: "David",
            email: "david@gmail.com",
            password: "124",
            entries: 0,
            joined: new Date()
        }
    ],
    login:[
        {
            id: 123,
            password: ""
        },
        {
            id: 124,
            password: ""
        }
    ]
}

// query all users
app.get('/', (req, res) => {
    res.json(database.users);
})


// user signin with data in body

app.post('/signin', (req, res) => {
    const { email, password } = req.body

    if( email === database.users[0].email && 
        password === database.users[0].password){
            res.json(database.users[0]);
        }   
    else{
        res.status(404).json("sign in failed!")
    }
})  



// new user sign up with data in body
// add data to 2 tables: login and users,
// store hash in login

// also, use transaction to make sure that the data will add to 2 tables at one time
// 使用者輸入：姓名、mail、密碼註冊，要把資料存到login以及users
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    // encrypted password
    const hash = bcrypt.hashSync(password);
    // transaction begin
    db.transaction(trx => {
        return trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx
            .returning('*')
            .insert({
                email: loginEmail[0],  // {"...@gmail.com"}
                name: name,
                joined: new Date()
            })
            .into('users')           
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => console.log(error))

    // db('users')
    // .insert({
    //     name: name,
    //     email: email,
    //     joined: new Date()
    // })
    // .returning("*") 
    // .then(user => res.json(user[0])) // w/o [0], it returns an array
    // .catch(err => res.status(400).json("fail to register!!"));
})

// get user profile through id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json('user does not exit');
        }})
    .catch(error => res.status(400).json('cannot find user'));
})


// every time when user send an url, increase the entries.
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
    .where({id: id})
    .returning('entries')
    .increment('entries', 1)
    .then(data => res.json(data));
})










// app.get('/profile/:id', (req, res) => {
//     const { id } = req.params;    
//     database.users.forEach((item, index) => {        
//         if(item.id === id){
//             res.json(item);
//         }
//         else{
//             // 這種寫法會出現error, 本來設定：找不到的話會回傳error message,
//             // 但實際上：因為forEach會go through all users even if it's already find one,
//             // 造成重複送出response, 導致server錯誤。
//             console.log("else", item.id);
//             res.status(404).json("cannot find one!");
//         }
//     })
// })

// a plan
// ok / get, it's working 
// ok /signin, post, with user info> send success/fail
// ok /register, post, with user info> send user (add an user to database)
// ok /profile/:id, get, with id> send user (homepage shows user file)
// ok /image put, with user info> send user (update user file entries)

app.listen(3000, ()=> {
    console.log("it's running on port 3000!");
})

