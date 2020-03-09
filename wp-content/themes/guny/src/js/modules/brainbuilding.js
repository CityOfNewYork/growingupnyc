'use strict';

/**
 * Brain Building
 */

import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'

class BrainBuilding {

  constructor() {
    this._baseURL = window.location.origin + '/wp-json/wp/v2/';
    this._lang = '?lang=' + document.documentElement.lang;
    this._el = '#' + $('div').find('[id^=vue]').attr('id');
    this._posttype = this._el.replace(new RegExp("^" + '#vue-'), '')

    this._programs = {
      delimiters: ['v{', '}'],
      el: this._el,
      router,
      data: {
        posttype: this._posttype,
        programsURL: this._baseURL + this._posttype + this._lang + '&per_page=42&page=1',
        programsAll: null,
        programs: null,
        ageGroups: null,
        checkedAgeGroup: [],
        checkedAllAges: false,
        tipTypes: null,
        checkedTipType: [],
        checkedAllTipTypes: false,
        programPage: 1,
        currentPage: 1,
        maxPages: 1,
        errorMsg: false,
        isLoading: true,
        totalResults: '',
      },
      watch: {
        checkedTipType: 'getPrograms',
        checkedAgeGroup: 'getPrograms',
      },
      mounted: function () {
        axios.all([
          axios.get(this.programsURL),
        ])
          .then(axios.spread((programs) => {
            this.programsAll = programs.data;
            this.getTaxonomies();
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: BrainBuilding.getPrograms,
        getTaxonomies: BrainBuilding.getTaxonomies,
        selectAllTipTypes: BrainBuilding.selectAllTipTypes,
        parseQuery: BrainBuilding.parseQuery,
        hideLoader: BrainBuilding.hideLoader,
        scrollToTop() {
          window.scrollTo(0, 0);
        },
        showLoader: BrainBuilding.showLoader,
        selectAllAges: BrainBuilding.selectAllAges,
        loadMore: BrainBuilding.loadMore,
        mobileScroll: BrainBuilding.mobileScroll,
      },
      created() {
        window.addEventListener('scroll', this.mobileScroll);
      }
    }
  }

  /**
   * Initialize
   **/
  init() {
    this._programs = new Vue(this._programs);


    $(window).on('resize', function () {
      if ($(window).width() >= 1024) {
        $('.loader-mobile').hide();
      }
    });
  }
}

/**
 * Request to get the programs and update router
 **/
BrainBuilding.getPrograms = function () {
  BrainBuilding.showLoader(this, this.programs)

  // let filters = BrainBuilding.updateFilters(this);
  this.checkedAgeGroup.length != this.ageGroups.length ? this.checkedAllAges = false : this.checkedAllAges = true;
  this.checkedTipType.length != this.tipTypes.length ? this.checkedAllTipTypes = false : this.checkedAllTipTypes = true;

  let types = this.checkedAllTipTypes ? this.tipTypes.map(a => a.slug) : this.checkedTipType;
  let ages = this.checkedAllAges ? this.ageGroups.map(a => a.slug) : this.checkedAgeGroup;
  let result;

  // update router based on selection
  this.$router.push({
    query:
    {
      ages: this.checkedAgeGroup.length < this.ageGroups.length ? this.checkedAgeGroup : 'all',
      tip_category: this.checkedTipType.length < this.tipTypes.length ? this.checkedTipType : 'all',
    }
  });

  if (types.length > 0 && ages.length > 0){
    result = this.programsAll.filter(function (e) {
      return e.tip_category.find(x => types.includes(x.slug)) && e.age_group.find(x => ages.includes(x.slug));
    });
    this.programs = result;
  } else if (types.length > 0 && ages.length == 0) {
    result = this.programsAll.filter(function (e) {
      return e.tip_category.find(x => types.includes(x.slug));
    });
    this.programs = result;
  } else if (types.length == 0 && ages.length > 0) {
    result = this.programsAll.filter(function (e) {
      return e.age_group.find(x => ages.includes(x.slug))
    });
    this.programs = result;
  } else {
    this.programs = this.programsAll.slice(0, 6);
  }

  if (this.programs.length == 0) {
    this.errorMsg = true;
    this.isLoading = false;
    this.maxPages = 1;
    BrainBuilding.hideLoader(this.$el, this.programs);
  } else {
    this.errorMsg = false;
    this.isLoading = false;
    this.totalResults = this.programs.length;
    BrainBuilding.hideLoader(this.$el, this.programs);
  }

}


BrainBuilding.getTaxonomies = function () {
  // let result = this.programsAll.map(a => a.age_group);

  // age groups
  let ageGroups = _.uniq([].concat.apply([], this.programsAll.map(a => a.age_group)), function (x) {
    return x.name;
  });

  this.ageGroups = ageGroups.sort((a, b) => a.description.localeCompare(b.description))
  
  // tip types
  let types = _.uniq([].concat.apply([], this.programsAll.map(a => a.tip_category)), function (x) {
    return x.name;
  });

  this.tipTypes = types.sort((a, b) => a.name.localeCompare(b.name))

}

BrainBuilding.parseQuery = function () {
  let query = this.$route.query;

  if (query.ages == 'all') {
    this.checkedAllAges = true;
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  }
  if (!_.isEmpty(query.ages) && query.ages != 'all') {
    this.checkedAllAges = false;
    if (_.isArray(query.ages)) {
      if (query.ages.every((val, i, arr) => val === arr[0])) {
        query.ages = query.ages[0];
      } 
      else {
        this.checkedAgeGroup = query.ages
      }
    } else {
      let index = this.ageGroups.map(function (e) { return e.slug; }).indexOf(query.ages);
      this.checkedAgeGroup.push(this.ageGroups[index].slug);
    }
  }

  if (query.tip_category == 'all') {
    this.checkedAllTipTypes = true;
    this.checkedTipType = this.tipTypes.map(a => a.slug);
  }
  if (!_.isEmpty(query.tip_category) && query.tip_category != 'all') {
    this.checkedAllTipTypes = false;
    if (_.isArray(query.tip_category)) {
      if (query.tip_category.every((val, i, arr) => val === arr[0])) {
        query.tip_category = query.tip_category[0];
      } else {
        this.checkedTipType = query.tip_category
      }
    } else {
      let index = this.tipTypes.map(function (e) { return e.slug; }).indexOf(query.tip_category);
      this.checkedTipType.push(this.tipTypes[index].slug);
    }
  }

}

BrainBuilding.selectAllAges = function () {
  if (this.checkedAllAges) {
    this.checkedAgeGroup = this.ageGroups.map(a => a.slug);
  } else {
    this.checkedAgeGroup = [];
  }
}

BrainBuilding.selectAllTipTypes = function () {
  if (this.checkedAllTipTypes) {
    this.checkedTipType = this.tipTypes.map(a => a.slug);
  } else {
    this.checkedTipType = [];
  }
}

BrainBuilding.showLoader = function (obj, programs) {
  let el = obj.$el;
  let sh = $(el).find('.o-article-sidebar').height();

  if ($(window).width() >= 1024) {
    if (programs == null) {
      $(el).find('.loader').css({ 'height': sh }).addClass('animated pulse');
    } else {
      $(el).find('.loader').css({ 'height': '100%' }).removeClass('animated pulse');
    }
    $(el).find('.pagination').hide();
    $(el).find('.loader').show();
  } else {
    $(el).find('.loader').hide();
    if (obj.checkedTipType.length > 0 || obj.checkedAgeGroup.length > 0) {
      $('.c-alert__banner').hide();
      $(el).find('.loader-mobile').fadeIn();
    }
  }
}

BrainBuilding.hideLoader = function (el, status) {
  $(el).find('.loader').hide();
  $(el).find('.pagination').show();
}

BrainBuilding.loadMore = function () {
  this.programs = this.programs.concat(this.programsAll.slice(this.programs.length, 6 + this.programs.length))
}

BrainBuilding.mobileScroll = function () {
  if (this.checkedAgeGroup.length > 0 ||
    this.checkedTipType.length > 0
  ) {
    let ww = $(window).scrollTop()
    if ($('#programs-loaded').length) {
      let cw = $('#programs-loaded').offset().top;
      if ($(window).width() < 1024) {
        if (ww >= cw - 50) {
          $('.loader-mobile').fadeOut();
        } else {
          $('.loader-mobile').fadeIn();
        }
      } else {
        $('.loader-mobile').fadeOut();
      }
    }
  } else {
    $('.loader-mobile').fadeOut();
  }
}

export default BrainBuilding;


