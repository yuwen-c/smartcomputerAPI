const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body
    if(email && password){
        db.select('hash').from('login')
        .where({email: email}) 
        .then(data=> {
            // if the email exists, do find a user(data)
            if(data.length){
                const isValid = bcrypt.compareSync(password, data[0].hash); // compare if password is correct
                if(isValid){
                    return db.select('*').from('users')
                    .where({email: email})
                    .then(user => res.json(user[0])) 
                }else{
                    res.status(400).json('wrong credentials') // wrong password
                }
            }
            else{
                res.status(400).json('wrong credentials') // email doesn't exist
            }
        }) 
        .catch(err => res.status(400).json("fail to sing in"))   
    }
    else{
        res.status(400).json('please fill in the blanks')
    }
}

module.exports = {
    handleSignin : handleSignin
};