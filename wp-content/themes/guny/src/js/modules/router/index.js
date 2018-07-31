import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
	// mode: 'history',
	routes: [{
		name: 'programs',
		path: ''
		},
		{
			name: 'events',
			path: '/events'
		}
	]
});
