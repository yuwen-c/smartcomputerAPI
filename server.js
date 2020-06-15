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
// since this return a promise, do .then to access data.
// no need to do .json since it doesn't pass through HTTP
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
    // bcrypt.compare("gogogo", "$2a$10$a3OAAVGjKNDxpiawYKx6k.OszB.vnXhkeNluPFJRYZxB2ozzAZVZm", (err, res) => {
    //     console.log(res);
    // });
    if( email === database.users[0].email && 
        password === database.users[0].password){
            res.json(database.users[0]);
        }   
    else{
        res.status(404).json("sign in failed!")
    }
})  



// new user sign up with data in body
app.post('/register', (req, res) => {
    const { name, email, password} = req.body;
    db('users')
    .returning("*") // return all columns of that user
    // specifies which column should be returned by insert. update . 
    .insert({
        name: name,
        email: email,
        joined: new Date()
    })
    .then(user => res.json(user[0])) // w/o [0], it returns an array
    // encrypt password 
    // bcrypt.hash(password, null, null, (err, hash) => {
    //     hashedPw = hash;
    // });
    .catch(err => res.status(400).json("fail to register!!"));
})

// get user profile through id
// 後來不寫/:id了，findUserFun有改，改成body送資料
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
    // const [userIndex, finded] = findUserFun(req.params, false);
    // const numId = parseInt(id); // params是字串，改為數字
    // let userIndex = 0;
    // let finded = false; // flag
    // const findUser = database.users.some((item, index) => {
    //     // 從資料庫裡面撈出 id符合的那一筆
    //     if( item.id === numId){
    //         userIndex = index;
    //         finded = true;
    //         return item.id === numId;
    //     }
    // })
})

// 帶入/:id 及 flag，找到userIndex
const findUserFun = (user, finded) => {
    const { id } = user;
    const numId = parseInt(id);
    let userIndex = 0;
    const findUser = database.users.some((item, index) => {
        if( item.id === numId){
            finded = true;
            userIndex = index;
            return item.id === numId;
        }
    })
    return [userIndex, finded];
}

// every time when user send an url, increase the entries.
app.put('/image', (req, res) => {
    const [userIndex, finded] = findUserFun(req.body, false);
    if(finded){
        database.users[userIndex].entries ++;
        res.json(database.users[userIndex].entries); //回傳user
    }else{
        res.status(404).json("cannot find user id")
    }
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

