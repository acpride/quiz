var models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    res.render('quizzes/question', { pregunta: quiz[0].pregunta});
  })
};

// GET /quizzes/answer
exports.answer = function(req, res) {
   if (req.query.respuesta === 'Roma'){
      res.render('quizzes/answer', {respuesta: 'Correcto'});
   } else {
      res.render('quizzes/answer', {respuesta: 'Incorrecto'});
   }
};