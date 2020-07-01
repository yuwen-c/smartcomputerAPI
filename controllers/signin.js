const HandleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body
    db.select('hash').from('login')
    .where({email: email}) 
    .then(data=> {
        // if the email exists
        if(data.length){
            const isValid = bcrypt.compareSync(password, data[0].hash); 
            if(isValid){
                return db.select('*').from('users')
                .where({email: email})
                .then(user => res.json(user[0])) 
            }else{
                res.status(400).json('wrong credentials!') // wrong password
            }
        }
        else{
            res.status(400).json('wrong credentials') // email doesn't exist
        }
    }) 
    .catch(err => res.status(400).json("fail to sing in"))   
}

module.exports = {
    HandleSignin : HandleSignin
};