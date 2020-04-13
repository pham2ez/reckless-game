const express = require('express');

const router = express.Router();

const Coup = require('../models/Coup');
/**
 * Get my game info.
 * @name GET/api/coup/
 */
router.get('/info/:id', (req, res) => {
  res.status(200).json(Coup.truncGame(req.params.id,req.session.username)).end();
});

/**
 * Successful block, continue to next player.
 * @name GET/api/coup/next
 */
router.get('/next/:id', (req, res) => {
  Coup.next(req.params.id);
  res.status(200).json(true).end();
});

/**
 * Player makes a move.
 * @name PUT/api/coup/move
 */
router.put('/move', (req, res) => {
  Coup.doMove(req.body.id, req.body.player1, req.body.player2, req.body.action, req.body.cards);
  res.status(200).json(true).end();
});

module.exports = router;
