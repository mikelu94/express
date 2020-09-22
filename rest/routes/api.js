const express = require('express');
const Item = require('../models/item');

const apiRouter = express.Router();

// get a list of items from the db
apiRouter.get('/items', (req, res, next) => {
  Item.find({}).then((items) => {
    res.status(200).send(items);
  }).catch(next);
});

// get an item from the db
apiRouter.get('/items/:id', (req, res, next) => {
  Item.findOne({ _id: req.params.id }).then((item) => {
    res.status(200).send(item);
  }).catch(next);
});

// add a new item to the db
apiRouter.post('/items', (req, res, next) => {
  Item.create(req.body).then((item) => {
    res.status(201).send(item);
  }).catch(next);
});

// update an item in the db
apiRouter.put('/items/:id', (req, res, next) => {
  Item.findByIdAndUpdate({ _id: req.params.id }, req.body, () => {
    Item.findOne({ _id: req.params.id }).then((item) => {
      res.status(204).send(item);
    });
  }).catch(next);
});

// delete an item from the db
apiRouter.delete('/items/:id', (req, res, next) => {
  Item.findByIdAndDelete({ _id: req.params.id }, (item) => {
    res.send(item);
  }).catch(next);
});

module.exports = apiRouter;
