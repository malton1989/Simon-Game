$(document).ready(function(){
  var countTimer, inter;
  var game = {
    btn: ["#red0", "#blue1", "#green2", "#yellow3"],
    compMemory: [],
    index: [],
    gameOn: false,
    strict: false,
    number: 0,
    round: 0,
    sound: [new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
            new Audio("http://kristarling.com/publicassets/fail.wav")]
  };
  function init(){
    game.compMemory = [];
    game.index = [];
    game.gameOn = true;
    game.round = 0;
  }
  function getNum(){
    return Math.round(Math.random()*10/3);
  }
  function compTurn(){
    var i = 0;
    inter = setInterval(function(){
      game.sound[game.index[i]].play();
      $(game.compMemory[i]+" .inner").animate({opacity: 1}, 200);
      $(game.compMemory[i]+" .inner").animate({opacity: 0}, 600);
      i++;
      if(i==game.compMemory.length){
        clearInterval(inter);
        playerTurn();
        $(".buttons").on(btnFlash());
      } 
    },1000);
  }
  function startGame(){
    $(".btn").on({
      mousedown: function(){
        $(this).css({
          boxShadow: 'none',
          transform: 'translateY(5px)',
        });
      },
      mouseup: function(){
        $(this).css({
          boxShadow: '0px 4px 1px #053905',
          transform: 'translateY(0px)'
        });
      }
    });
  }
  function btnFlash(){
    $(".buttons").mousedown(function(){
      $(this).find(".inner").css("opacity", 1);
    });
    $(".buttons").mouseup(function(){
      $(this).find(".inner").css("opacity", 0);
    });
  }
  function count(){
    $('#disp').text(checkR(++game.round));
  }
  function playerTurn(){
    var playerRepeat = game.compMemory.slice(0);
    
    $(".buttons").click(function(){
        var presentBtn = $(this).attr('id');
        if(presentBtn !== playerRepeat.shift(0).slice(1)){
          if(game.strict){
            game.sound[4].play();
            init();
            memory();
            $('#disp').text(checkR(game.round));
            count();
            compTurn();
            $(".buttons").off();
          }else{
            compTurn();
            game.sound[4].play();
            $(".buttons").off();
          } 
        }else{
          game.sound[$(this).attr('id').slice($(this).length-2)].play();
          if(playerRepeat.length === 0){
            memory();
            count();
            compTurn();
            $(".buttons").off();
          }
        }
    });
  }
  $('.stick').click(function(){
    if(game.gameOn === false){
      $('#power div').animate({left: "3px"}, 100);
      $('#disp').css("color", "#772424");
      $('h1').css("text-shadow", "16px 15px 45px #fff, 0 5px 15px #fff");
      game.gameOn = true;
    }else{
      $('#power div').animate({left: '-34px'}, 100);
      $('h1').css("text-shadow", "none");
      game.gameOn = false;
      $('#disp').css("color", "#5a0000").text("--");
      $(".buttons").off(btnFlash());
      game.compMemory = [];
      game.index = [];
      game.strict = false;
      $('#strict').css('background-color', '#008181');
    }
  });
  function checkR(r){
    if(r<10){
      return "0"+r;
    }else{
      return r;
    }
  }
  function memory(){
    var number = getNum();
    game.compMemory.push(game.btn[number]);
    game.index.push(number);
  }
  
  startGame();
  $('.btn').click(function(){
    clearTimeout(countTimer);
    clearInterval(inter);
      if(game.gameOn === true && $(this).attr('id') === 'start'){
        countTimer = setTimeout(count, 1000);
        init();
        memory();
        $('.buttons').off(compTurn());
      }
    if(game.gameOn === true && $(this).attr('id') === 'strict' && game.strict === false){
      game.strict = true;
      $('#strict').css('background-color', '#00c6c6');
    }else if ($(this).attr('id') === 'strict'){
      game.strict = false;
      $('#strict').css('background-color', '#008181');
    }
  });
});