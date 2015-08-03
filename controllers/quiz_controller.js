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
    res.render('quizzes/index', {quizes: quizes, errors: []});
      }).catch(function (error) { next(error);});

  } else {
    //lista de preguntas sin filtrado
    models.Quiz.findAll().then(function (quizes){
      res.render('quizzes/index', {quizes: quizes, errors: []});
    }).catch(function (error) { next(error);});
  }

};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizzes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizzes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizzes?search
exports.search = function (req, res) {
  models.Quiz.findAll({where:["pregunta like ?", '%'+req.query.search+'%'], order:"pregunta"}).then(function (quizes){
    res.render('quizzes/search', { quizes: quizes, errors: []});
  }
)};

// GET /quizzes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizzes/new', {quiz: quiz, errors: []});
};

// POST /quizzes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  var errors = quiz.validate();
  
  if (errors) {
    var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
    for (var prop in errors) {
      errores[i++] = { message: errors[prop] };
    }
    res.render('quizzes/new', {quiz: quiz, errors: errores});
  } else {
    quiz.save({fields: ["pregunta", "respuesta","tema"]}).then( function() {
      res.redirect('/quizzes');
    });
  }

};

// GET /quizzes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizzes/edit', {quiz: quiz, errors: []});
};

// PUT /quizzes/:id
exports.update = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  var errors = quiz.validate();

  if (errors) {
    var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
    for (var prop in errors) {
      errores[i++] = { message: errors[prop] };
    }
    res.render('quizzes/edit', {quiz: req.quiz, errors: errores});
  } else {
    req.quiz.save({fields: ["pregunta", "respuesta"]}).then( function() {
      res.redirect('/quizzes');
    });
  }

};

// DELETE /quizzes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizzes');
  }).catch(function(error){next(error)});
};
