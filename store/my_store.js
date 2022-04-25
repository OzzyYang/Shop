export default {
	//开启命名空间
	namespaced: true,

	//模块的state数据
	state: () => ({
		firstColContent: [{
			name: '收藏的店铺',
			content: []
		}, {
			name: '收藏的商品',
			content: []
		}, {
			name: '关注的商品',
			content: []
		}, {
			name: '足迹',
			content: []
		}],
		secondColContent: [{
			name: '待付款',
			image: '../../static/my-icons/icon1.png',
			
		}, {
			name: '待收货',
			image: '../../static/my-icons/icon2.png'
		}, {
			name: '退款/退货',
			image: '../../static/my-icons/icon3.png'
		}, {
			name: '全部订单',
			image: '../../static/my-icons/icon4.png'
		}],
		thirdColContent: ['收货地址', '联系客服', '退出登录']
	}),

	//模块的mutations方法
	mutations: {

	},

	//模块的getters属性
	getters: {

	}
}
