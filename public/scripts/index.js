$.event.addProp('dataTransfer');
$( function() {
  const { $player, changeMusic } = createMusicPlayer(`/sounds/sea-shanty2.mp3`);
  $('body').prepend($player);
  $(`body`).on('click', function() {
    changeMusic(null, true);
    $(this).off();
  });
  $("#2-player").on('click', function() {
    $('main').empty();
    changeMusic(`/sounds/sea-shanty.mp3`, true);
    $('main').append(createGame({rows: 10, cols: 10}));
  });

  $(".dropdown").on('click', function() {
    $(".content").slideToggle();
  });
});