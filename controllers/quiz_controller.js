var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

//GET /quizes
exports.index = function(req, res){
  var search = req.params.search;
  //check if search
  if(req.query.search) {
    var filter = (req.query.search || '').replace(" ", "%");
    models.Quiz.findAll({where:["pregunta like ?", '%'+filter+'%'],order:'pregunta ASC'}).then(function (quizes){
    res.render('quizzes/index', {quizes: quizes});
      }).catch(function (error) { next(error);});

  } else {
    //lista de preguntas sin filtrado
    models.Quiz.findAll().then(function (quizes){
      res.render('quizzes/index', {quizes: quizes});
    }).catch(function (error) { next(error);});
  }

};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizzes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizzes/answer', {quiz: req.quiz, respuesta: resultado});
};

//GET /quizzes?search
exports.search = function (req, res) {
  models.Quiz.findAll({where:["pregunta like ?", '%'+req.query.search+'%'], order:"pregunta"}).then(function (quizes){
    res.render('quizzes/search', { quizes: quizes});
  }
)};
