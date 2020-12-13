$( function() {
  const music = document.createElement('audio');
  music.src = '/sounds/sea-shanty2.mp3';
  let isPlaying = false;
  music.loop = true;
  const $music = $("#bg-music");
  const $icon = $("#bg-music .volume-icon i");
  const $slider = $("#bg-music-slider");
  music.volume = $slider.val() / 100;
  $slider.on('input', function(evt) {
    music.volume = evt.target.value / 100;
  });
  $music.on("mouseleave", function(evt) {
    let className = ""
    if (!isPlaying) className = "fas fa-music";
    else if ($slider.val() >= 50) className = "fas fa-volume-up";
    else if($slider.val() > 0) className = "fas fa-volume-down";
    else className = "fas fa-volume-mute";
    $icon.removeClass().addClass(className);
  });
  $music.on("mouseenter", function() {
    $icon.removeClass().addClass(isPlaying ? "fas fa-pause" : "fas fa-play");
  });
  $icon.on("click", function() {
    if (isPlaying) {
      music.pause();
      $icon.removeClass().addClass("fas fa-play");
      isPlaying = false;
    } else {
      music.play();
      $icon.removeClass().addClass("fas fa-pause");
      isPlaying = true;
    }
  });
});