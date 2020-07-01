const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
    .where({id: id})
    .returning('entries')
    .increment('entries', 1)
    .then(data => res.json(data));
}

module.exports = {
    handleImage : handleImage
};