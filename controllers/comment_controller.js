var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
            where: {
                id: Number(commentId)
            }
        }).then(function(comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else{next(new Error('No existe commentId=' + commentId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizzes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizzes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build(
      { texto: req.body.comment.texto,          
        QuizId: req.params.quizId
        });

  var errors = comment.validate();
  
  if (errors) {
    console.log("Error en validate");
    var i=0; var errores = new Array();//se convierte en [] con la propiedad message por compatibilidad con layout
    for (var prop in errors) {
      console.log("Error: " + prop);
      errores[i++] = { message: errors[prop] };
    }
    res.render('comments/new.ejs', {comment: comment, errors: err.errors});
  } else {
    // save: guarda en DB campo texto de comment
    comment.save().then( function(){ 
      res.redirect('/quizzes/'+req.params.quizId);
    });
  }
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save( {fields: ["publicado"]})
    .then( function(){ res.redirect('/quizzes/'+req.params.quizId);} )
    .catch(function(error){next(error)});

  };