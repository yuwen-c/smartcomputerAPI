const HandleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
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
    .catch(error => console.log(error))
}

module.exports = {HandleRegister: HandleRegister}
