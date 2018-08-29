'use strict';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';
import router from './router'


class ProgramsList {

  constructor() {
    if(document.documentElement.lang != 'en'){
      this._baseURL = window.location.origin + '/' + document.documentElement.lang;
    }else{
      this._baseURL = window.location.origin;
    }

    this._programs = {
      delimiters: ['v{', '}'],
      el: '#vue-programs',
      router,
      data: {
        programsURL: this._baseURL + '/wp-json/wp/v2/program',
        programTypeURL: this._baseURL + '/wp-json/wp/v2/programs_cat',
        ageGroupURL: this._baseURL + '/wp-json/wp/v2/age_group',
        programs: null,
        programTypes: null,
        ageGroups: null,
        checkedProgramType: [],
        checkedAgeGroup: [],
        programPage: 1,
        errorMsg: false
      },
       watch: {
        url: 'getPrograms',
        checkedProgramType: 'getPrograms',
        checkedAgeGroup: 'getPrograms',
        programPage: 'getPrograms',
      },
      mounted: function() {
        axios.all([
          axios.get(this.programTypeURL),
          axios.get(this.ageGroupURL)
          ])
          .then(axios.spread((catResponse, ageResponse) => {
            this.programTypes = catResponse.data;
            this.ageGroups = ageResponse.data;
            this.parseQuery();
            this.getPrograms();
          }));
      },
      methods: {
        getPrograms: ProgramsList.getPrograms,
        generateFilterURL: ProgramsList.generateFilterURL,
        parseQuery: ProgramsList.parseQuery,
        getIds: ProgramsList.getIds,
      }
    }
  }

  /**
   * Initialize
   **/
  init() {
    this._programs = new Vue(this._programs);
  }
}
/**
 * Request to get the programs and update router
 **/
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  
  let filters = ProgramsList.generateFilterURL(this.checkedProgramType, this.checkedAgeGroup, this.programPage);
  url = url + '?' + filters.typeIds + '&' + filters.ageIds + '&' + filters.pageId;

  // update the query
  if ( this.programPage == 1){
    this.$router.push({query: {category: filters.typeSlugs, age: filters.ageSlugs }});
  }else {
    this.$router.push({query: {programs_cat: this.checkedProgramType, age_group: this.checkedAgeGroup, page: this.programPage }});
  }

  axios
    .get(url)
    .then(response => {
      this.programs = response.data
      if (this.programs.length == 0) {
        this.errorMsg = true;
      } else {
        this.errorMsg = false;
      }
    })
    .catch(error => {
      console.log(error);
      this.programPage = 1;
    });
}

/**
 * Generate the string filter for all user chosen taxonomies
 * @param {array} - array with the ids of program types
 * @param {array} - array with the ids of age groups
 * @param {integer} - page number
 * @return {string} - string of all filters
 **/
ProgramsList.generateFilterURL = function(types, ages, page) {
  let filters = {
    typeIds: [],
    typeSlugs: [],
    ageIds: [],
    ageSlugs: [],
    pageId: []
  };

  // populate the arrays based on filters
  if ( types.length > 0 ) {
    let type_ids = types.map(a => a.term_id);
    filters.typeIds.push('programs_cat[]=' + type_ids.join('&programs_cat[]='));

    let type_slugs = types.map(a => a.slug);
    filters.typeSlugs= type_slugs;
  }

  if ( ages.length > 0  ) {
    let age_ids = ages.map(a => a.id);
    filters.ageIds.push('age_group[]=' + age_ids.join('&age_group[]='));

    let age_slugs = ages.map(a => a.slug);
    filters.ageSlugs= age_slugs;
  }

  if (page > 1) {
    filters.pageId.push('page=' + page);
  }

  // join array elements
  filters.ageIds = filters.ageIds.join('&');
  filters.typeIds = filters.typeIds.join('&');
  
  return filters;
}
/**
 * Extracts the taxonomies from the url query
 * and updates the program type and age group arrays 
 **/
ProgramsList.parseQuery = function() {
  let query =this.$route.query;

  if (_.isArray(query.category)){
    // if an array with the same value in each element
    if (query.category.every( (val, i, arr) => val === arr[0] )){
      query.category = query.category[0];
    }else{
      this.checkedProgramType=ProgramsList.getIds(this.programTypes, query.category.map(String));
    }
  }

  if (!_.isArray(query.category) && query.category){
    this.checkedProgramType.push(parseInt(query.category, 10));
  }

  if (_.isArray(query.age_group)){
    if (query.age_group.every( (val, i, arr) => val === arr[0] )) {
      query.age_group = query.age_group[0];
    } else {
      this.checkedAgeGroup=query.age_group.map(Number);
    }
  }

  if (!_.isArray(query.age_group) && query.age_group) {
    this.checkedAgeGroup.push(parseInt(query.age_group,10));
  }

  if(query.page) {
    this.programPage=query.page;
  }

}

/**
 * Gets the id of the slug
 **/
ProgramsList.getIds = function(filter, slugs) {
  let arrIds = [];
  
  // loop through each slug and get the index to capture the filter
  slugs.forEach(function(slug) {
    let index = filter.map(function(e) { return e.slug; }).indexOf(slug);
    if (filter[index].id) {
      arrIds.push(filter[index])
    }else {
      arrIds.push(filter[index])
    }
  });

  return arrIds;
}

export default ProgramsList;


