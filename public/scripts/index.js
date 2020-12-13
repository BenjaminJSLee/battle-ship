$( function() {
  $("#vs-ai").on('click', function() {
    window.location.replace("/vs/AI");
  });
  $(".dropdown").on('click', function() {
    $(".content").slideToggle();
  });
});