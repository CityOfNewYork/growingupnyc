var $ = require('jquery');

module.exports = function(fbId) {
  var $body = $('body');

  // Facebook sharing with the SDK
  $.getScript('//connect.facebook.net/en_US/sdk.js').done(function() {
    $body.on('click.sharer-fb', '.sharer-fb', function(e) {
      var $link = $(this);
      var options;
      var newUrl;
      e.preventDefault();

      FB.init({
        appId: fbId,
        xfbml: false,
        version: 'v2.0',
        status: false,
        cookie: true
      });

      options = {
        method: 'feed',
        display: 'popup'
      };

      if ($link.data('title')) {
        options.name = $link.data('title');
      }

      if ($link.data('url')) {
        options.link = $link.data('url');
      }

      if ($link.data('picture')) {
        options.picture = $link.data('picture');
      }

      if ($link.data('description')) {
        options.description = $link.data('description');
      }

      if ($link.data('redirect-to')) {
        newUrl = $link.data('redirect-to');
      }

      FB.ui(options, function() {
        if (newUrl) {
          window.location.href = newUrl;
        }
      });
    });
  });

  // Twitter sharing
  $body.on('click.sharer-tw', '.sharer-tw', function(e) {
    var $link = $(this),
      url = $link.data('url'),
      text = $link.data('description'),
      via = $link.data('source'),
      twitterURL = 'https://twitter.com/share?url=' + encodeURIComponent(url);

    e.preventDefault();

    if (text) {
      twitterURL += '&text=' + encodeURIComponent(text);
    }
    if (via) {
      twitterURL += '&via=' + encodeURIComponent(via);
    }
    window.open(twitterURL, 'tweet', 'width=500,height=384,menubar=no,status=no,toolbar=no');
  });

  // LinkedIn sharing
  $body.on('click.sharer-li', '.sharer-li', function(e) {
    var $link = $(this),
      url = $link.data('url'),
      title = $link.data('title'),
      summary = $link.data('description'),
      source = $link.data('source'),
      linkedinURL = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url);

    e.preventDefault();

    if (title) {
      linkedinURL += '&title=' + encodeURIComponent(title);
    } else {
      linkedinURL += '&title=';
    }

    if (summary) {
      linkedinURL += '&summary=' + encodeURIComponent(summary.substring(0, 256));
    }

    if (source) {
      linkedinURL += '&source=' + encodeURIComponent(source);
    }

    window.open(linkedinURL, 'linkedin', 'width=520,height=570,menubar=no,status=no,toolbar=no');
  });
};
