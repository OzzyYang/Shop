import App from './App'
//导入store的实例对象
import store from '@/store/store.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	//将store挂在到vue实例上
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif


/*  导入网络请求的包  */
import {
	$http
} from '@escook/request-miniprogram'

uni.$http = $http

//请求的根路径
$http.baseUrl = 'http://www.uinav.com'

// 请求拦截器：请求开始之前做一些事情
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
	})
	// 判断请求的是否为有权限的 API 接口
	if (options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: store.state.m_user.token,
		}
	}
}

// 响应拦截器：请求完成之后做一些事情
$http.afterRequest = function() {
	uni.hideLoading()
}


/*  全局数据加载失败的showMessage方法  */
uni.$showMsg = function(title = '数据加载失败', duration = 1500, icon = 'error') {
	uni.showToast({
		title,
		duration,
		icon
	})
}
