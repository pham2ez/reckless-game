const express = require('express');

const router = express.Router();

const Reckless = require('../models/Reckless');
/**
 * Get my current game info.
 * @name GET/api/reck/
 */
router.get('/info/:id', (req, res) => {
  res.status(200).json(Reckless.truncGame(req.params.id,req.session.username)).end();
});

/**
 * Successful block, continue to next player.
 * @name GET/api/reck/next
 */
router.get('/next/:id', (req, res) => {
  Reckless.next(req.params.id);
  res.status(200).json(true).end();
});

/**
 * Update checkpoint
 * @name GET/api/reck/update
 */
router.put('/update/:id', (req, res) => {
  Reckless.checkpoint(req.body,req.params.id);
  res.status(200).json(true).end();
});

/**
 * Player makes a move.
 * @name PUT/api/reck/move
 */
router.put('/move', (req, res) => {
  res.status(200).json(Reckless.doMove(req.body.id, req.body.player1, req.body.player2, req.body.action, req.body.cards)).end();
});

module.exports = router;
