const setPlayingState = function() {
  let playState = false;
  return function(toggle = false) {
    const isPlaying = playState;
    if (toggle) playState = !playState;
    return isPlaying;
  }
};

const createMusicHandlers = function($icon, $slider, music) {
  const isPlaying = setPlayingState();

  const sliderHandler = function(evt) {
    music.volume = evt.target.value / 100;
    window.localStorage.setItem('music-volume', evt.target.value);
  }
  const musicLeaveHandler = function() {
    let className = ""
    if (!isPlaying()) className = "fas fa-music";
    else if ($slider.val() >= 50) className = "fas fa-volume-up";
    else if($slider.val() > 0) className = "fas fa-volume-down";
    else className = "fas fa-volume-mute";
    $icon.removeClass().addClass(className);
  }
  const musicEnterHandler = function() {
    $icon.removeClass().addClass(isPlaying() ? "fas fa-pause" : "fas fa-play");
  }
  const iconClickHandler = function() {
    if (isPlaying(true)) {
      music.pause();
      $icon.removeClass().addClass("fas fa-play");
    } else {
      music.play();
      $icon.removeClass().addClass("fas fa-pause");
    }
  }
  const togglePlayHandler = function(evt) {
    if ((evt.type === 'pause' && isPlaying()) ||
      (evt.type === 'play' && !isPlaying())) isPlaying(true);
  }

  return { sliderHandler, musicLeaveHandler, musicEnterHandler, iconClickHandler, togglePlayHandler };
};

const addMusicListeners = function($music, $icon, $slider, music) {
  const { 
    sliderHandler, 
    musicLeaveHandler, 
    musicEnterHandler, 
    iconClickHandler,
    togglePlayHandler, 
  } = createMusicHandlers($icon, $slider, music);
  $slider.on('input', sliderHandler);
  $music.on("mouseleave", musicLeaveHandler);
  $music.on("mouseenter", musicEnterHandler);
  $icon.on("click", iconClickHandler);
  music.addEventListener('pause', togglePlayHandler);
  music.addEventListener('play', togglePlayHandler);
}

const createMusicController = function(music) {
  const $musicContainer = $(`<div id="bg-music"></div>`);
  const $iconContainer = $(`<span class="volume-icon"></span>`);
  const $sliderContainer = $(`<div class="slider-container"></div>`);
  const $icon = $(`<i class="fas fa-music"></i>`);
  const $slider = $(`<input type="range" min="0" max="100" value="${window.localStorage.getItem('music-volume') || 25}" id="bg-music-slider" />`);

  music.volume = $slider.val() / 100;

  addMusicListeners($musicContainer, $icon, $slider, music);

  $iconContainer.append($icon);
  $sliderContainer.append($slider);
  $musicContainer.append($iconContainer).append($sliderContainer);
  return $musicContainer;
};

const createMusicPlayer = function(filename) {
  const music = document.createElement('audio');
  music.src = filename;
  music.loop = true;
  const changeMusic = function(newFile, play = false) {
    music.src = newFile || filename;
    if (play) music.play();
  }
  return { $player: createMusicController(music), changeMusic };
};
