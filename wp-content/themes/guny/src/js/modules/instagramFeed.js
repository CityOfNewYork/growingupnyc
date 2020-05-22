/**
 * Instagram feed
 */
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
class InstagramFeed {
  constructor(){
    this._el = '#' + $('div').find('[id^=instagram]').attr('id');

    this._settings = {
      delimiters: ['v{', '}'],
      el: this._el,
      data: {
        url: InstagramFeed.mediaUrl + InstagramFeed.token,
        posts: null
      },
      watch: {
      },
      mounted: function () {
        console.log(this.url)
        fetch(this.url)
          .then(response => response.json())
          .then(data => {
            this.posts = data.data
            console.log(data)
          })
      
      },
      methods: {
      }
    }
  }

  // intialize the vue app
  init(){
    this.feed = new Vue(this._settings);
  }
}

// Defaults
InstagramFeed.mediaUrl = 'https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token='
InstagramFeed.token = 'IGQVJYM2N2aWlzR2FEaTBNOGlobVFieU9lUGFzVnk1TUV3NmwzdDVFS09WY3hKZAlRfTklnYzlCU3ZAWMGZAuMWt6QzBId1VWajNfcC1kQ08wMFhJeXBOTUdZALVRKcmFBYW55UmdZARkln'
InstagramFeed.posts = 4;

export default InstagramFeed;
