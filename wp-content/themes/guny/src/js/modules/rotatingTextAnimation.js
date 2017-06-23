/**
* Home Rotating Text Animation
* Referred from Stackoverflow
* @see https://stackoverflow.com/questions/2771789/changing-text-periodically-in-a-span-from-an-array-with-jquery/2772278#2772278
*/

export default function() {
  var terms = [];

  $('.rotating-text__entry').each(function (i, e) {
      if ($(e).text().trim() != '') {
          terms.push($(e).text());
      }
  });

  function rotateTerm() {
    var ct = $("#rotate").data("term") || 0;
    $("#rotate").data("term", ct == terms.length -1 ? 0 : ct + 1).text(terms[ct]).fadeIn().delay(2000).fadeOut(200, rotateTerm);
  }
  $(rotateTerm);
}