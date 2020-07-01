const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
    handleProfileGet : handleProfileGet
}