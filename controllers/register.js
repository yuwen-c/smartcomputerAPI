const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if(name && email && password){  // check no blank 
        // check if the email has already existed
        db('users').where('email', email)
        .then(data => {
            if(data.length === 0){  // email is new, data is [ ]
                // encrypted password
                const hash = bcrypt.hashSync(password);
                // transaction begin
                db.transaction(trx => {
                    trx.insert({
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
                .catch(error => {
                    res.status(400).json("registration failed")
                })
            }
            else if(data[0].id){ // mail exists, don't do registration
                res.status(400).json("this email address has been registered!");
            }
        });
    }
    else{
        res.status(400).json("please fill in the blanks");
    }
}

module.exports = {
    handleRegister: handleRegister
};
