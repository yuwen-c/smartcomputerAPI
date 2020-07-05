const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


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

// query all users
app.get('/', (req, res) => {
    db.select('*').from('users').then(users => res.json(users))
})

// user signin with data in body
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))  

// new user sign up with data in body
// add data to 2 tables: login and users,
// store hash in login
// also, use transaction to make sure that the data will add to 2 tables at one time
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

// get user profile through id
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db))

// send url from front to back end, and make clarifai api request to get face-recog data
app.post('/imageUrl', image.handleApiCall)

// every time when user send an url, increase the entries.
app.put('/image', image.handleImage(db))
// a curring syntax



// 原本是輸入url，submit，這個url連同key被帶往clarifai server.
// 回傳後1. grabface 將方框顯示在前端。
// 2. 去database做entries 增加1

// 現在希望把去clarifai查詢的動作移到後端
// 當得到方框資訊，回傳前端。
// 所以我可以利用一個api endpoint，傳入req(url)，得到res(faceRegions)傳回前端。
// 這樣一來就很清楚了。太好了。

// 對了，我本來以為後端server做的就是連接database
// 但其實不止。前端不想透露出去的事情就可以給後端做。
// 第一次前端後端一起改，覺得很酷 ＠＠




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

