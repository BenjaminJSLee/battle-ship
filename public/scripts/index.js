$.event.addProp('dataTransfer');
$( function() {
  const { $player, changeMusic } = createMusicPlayer(`/sounds/sea-shanty2.mp3`);
  $('body').prepend($player);

  $("#vs-ai").on('click', function() {
    $('main').empty();
    changeMusic(`/sounds/sea-shanty.mp3`, true);
    $('main').append(createGame({rows: 15, cols: 15}));
  });

  $(".dropdown").on('click', function() {
    $(".content").slideToggle();
  });
});