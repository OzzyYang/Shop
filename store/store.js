import Vue from "vue"
import Vuex from "vuex"
import moduleCart from '@/store/cart_store.js'

//将Vuex安装为Vue的插件
Vue.use(Vuex)

//创建Store的实例对象
const store = new Vuex.Store({
	//TODO: 挂载Store模块
	modules: {
		//挂载购物车的vuex模块，模块内成员的访问路径调整为m_cart
		//例如：购物车模块中，cart数组的访问路径是m_cart/cart
		'm_cart': moduleCart
	},

})

//向外共享Store的实例对象
export default store
