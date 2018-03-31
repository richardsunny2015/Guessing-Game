function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
  if (num >= 1 && num <= 100) {
    this.playersGuess = num;
    return this.checkGuess();
  } else {
    throw 'That is an invalid guess.';
  }
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    return "You Win!";
  } else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
    return "You have already guessed that number.";
  } else if (this.pastGuesses.indexOf(this.playersGuess) < 0 && this.pastGuesses.length < 4) {
    this.pastGuesses.push(this.playersGuess);
    if (this.difference() < 10) {
      return "You're burning up!";
    } else if (this.difference() < 25) {
      return "You're lukewarm.";
    } else if (this.difference() < 50) {
      return "You're a bit chilly.";
    } else {
      return "You're ice cold!";
    }
  } else if (this.pastGuesses.length === 4){
    return "You Lose.";
  }
};

Game.prototype.provideHint = function() {
  var retArr = [];
  retArr.push(this.winningNumber);
  retArr = retArr.concat([generateWinningNumber(), generateWinningNumber()]);
  return shuffle(retArr);
};

function newGame() {
  return new Game();
}

var endGame = function(response, game) {
  $('#title').text(response);
  $('#subtitle').text('Press the Reset button to play again!');
  $('#submit').prop('disabled', true);
  $('#hint').prop('disabled', true);
  if ($('.current').length) {
    $('.current').next().text(game.playersGuess);
  } else {
    $('li').first().text(game.playersGuess);
  }
};

var submitNumber = function(game) {
  var playerInput = $('#player-input').val();
  $('#player-input').val('');
  var response = game.playersGuessSubmission(+playerInput);
  if (response === 'You have already guessed that number.') {
    $('#title').text(response);
  } else if(response === 'You Win!' || response === 'You Lose.') {
    endGame(response, game);
  } else {
    $('#title').text(response);
    if (!game.isLower()) {
      $('#subtitle').text('Guess Lower!');
    } else {
      $('#subtitle').text('Guess Higher!');
    }
    if ($('.current').length) {
      $('.current').removeClass('current').next().addClass('current').text(game.playersGuess);
    } else {
      $('li').first().addClass('current').text(game.playersGuess);
    }
  }
};

$(document).ready(function(){
  var game = newGame();
  $('#submit').click(function(e) {
    submitNumber(game);
  });
  $('#player-input').keypress(function(event) {
    if (event.which == 13 && $('#title').text() !== 'You Lose.') {
      submitNumber(game);
    }
  });
  $('#hint').click(function() {
    var hints = game.provideHint();
    $('#title').text('The winning number is ' + hints[0] + ', ' + hints[1] + ', or '+ hints[2]);
  });
  $('#reset').click(function() {
    $('#title').text('Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100');
    $('li').text('-');
    $('.current').removeClass('current');
    game = newGame();
    $('#hint').prop('disabled', false);
    $('#submit').prop('disabled', false);
  });
});
