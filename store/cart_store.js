export default {
	//开启命名空间
	namespaced: true,

	//模块的state数据
	state: () => ({
		/*购物车的数组，用来存储购物车中每个商品的信息对象
		 *每个商品的信息对象，都包含如下6个属性
		 *{goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
		 */
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'), //读取本地存储的购物车数据，对 cart 数组进行初始化
		test_isAllChecked: false

	}),
	watch: {

	},
	//模块的mutations方法
	mutations: {

		/**
		 * 加入购物车
		 * @param {Object} state
		 * @param {Object} goods
		 */
		addToCart(state, goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}
			//通过commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
			this.commit('m_cart/saveToStorage')
		},
		/**
		 * 根据商品的ID从cart数组中删除对应的商品
		 * @param {Object} good
		 */
		deleteGood(state, good) {
			// 调用数组的 filter 方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== good.goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		/**
		 * 将所有购物车中的商品状态设置为isChecked属性
		 * @param {Object} state
		 * @param {Object} statusMy
		 */
		checkAllGoods(state, statusMy) {
			console.log('购物车Store', statusMy === 'true', Boolean(statusMy), (Boolean(statusMy) === true))

			for (var i = 0; i < state.cart.length; i++) {

				if (statusMy.isAllCheckedStatus) {
					state.cart[i].goods_state = false
				} else {
					state.cart[i].goods_state = true
				}

			}
			this.commit('m_cart/saveToStorage')
		},
		/**
		 * 将购物车的数据保存到本地
		 */
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		}
	},

	//模块的getters属性
	getters: {
		/**
		 * 获取购物车商品的数量
		 * @param {Object} state
		 */
		getCartSize(state) {
			let c = 0
			state.cart.forEach(x => c += x.goods_count)
			return c
		},
		/**
		 * 获取选中的商品的总数量
		 * @param {Object} state
		 */
		getCheckedGoodsSum(state) {
			let result = 0
			state.cart.forEach(x => {
				if (x.goods_state) result += x.goods_count
			})
			return result
		},
		getCheckedGoodsAmount(state) {
			let result = 0
			state.cart.forEach(x => {
				if (x.goods_state) result += x.goods_count * x.goods_price
			})
			return result
		},
		getAllCheckedStatus(state) {
			let num = 0
			state.cart.forEach(x => {
				if (x.goods_state) num++
			})
			// console.log(num === (state.cart.length ))
			return num === (state.cart.length) ? true : false
		}
	}
}
