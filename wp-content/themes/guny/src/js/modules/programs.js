'use strict';
import _ from 'underscore';
import Vue from 'vue/dist/vue.common';
import axios from 'axios';

class ProgramsList {
  constructor() {
    this._baseURL = window.location.origin;

    this._programs = {
      delimiters: ['v{', '}'],
      el: '#vue-programs',
      data: {
        programsURL: this._baseURL + '/wp-json/wp/v2/program',
        programs: null,
        categoriesURL: this._baseURL + '/wp-json/wp/v2/programs_cat',
        categoriesQuery: '?programs_cat[]=',
        categories: null,
        category: null,
        agesURL: this._baseURL + '/wp-json/wp/v2/age_group',
        ageQuery: '?age_group[]=',
        ages: null,
        age: null
      },
       watch: {
        category: 'getPrograms',
        age: 'getPrograms'
      },
      mounted: function() {
        this.getPrograms(),
        this.getCategories(),
        this.getAges()
      },
      methods: {
        getPrograms: ProgramsList.getPrograms,
        getSelectedCat: ProgramsList.getSelectedCat,
        getSelectedAge: ProgramsList.getSelectedAge,
        getCategories: ProgramsList.getCategories,
        getAges: ProgramsList.getAges,
      }
    }
  }

  /**
   * Initialize
   */
  init() {
    this._programs = new Vue(this._programs);
  }
}

// get the programs
ProgramsList.getPrograms = function() {
  let url = this.programsURL;
  if (this.category) {
    url = this.programsURL + this.categoriesQuery + this.category;
  }
  if (this.age) {
    url = this.programsURL + this.ageQuery + this.age;
  }
  axios
  .get(url)
  .then(response => (this.programs = response.data))
  .catch(error => console.log(error))
}

// get the post category based on user selection
ProgramsList.getSelectedCat = function(event) {
  let cat_id = event.target.getAttribute('href');
  console.log(cat_id);
  this.category = cat_id;
}

// get the age group based on the user selection
ProgramsList.getSelectedAge = function(event) {
  let age_id = event.target.getAttribute('href');
  console.log(age_id);
  this.age = age_id;
}

// get the categories for the filter
ProgramsList.getCategories = function() {
  console.log(this.categoriesURL);
  axios
  .get(this.categoriesURL)
  .then(response => (this.categories = response.data))
  .catch(error => console.log(error))
}

// get the categories for the filter
ProgramsList.getAges = function() {
  console.log(this.agesURL);
  axios
  .get(this.agesURL)
  .then(response => (this.ages = response.data))
  .catch(error => console.log(error))
}

export default ProgramsList;
