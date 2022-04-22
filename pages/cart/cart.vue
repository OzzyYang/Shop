<template>
	<view>
		<view class="addressArea">
			<block v-if="JSON.stringify('address')!==1123">
				<my-address></my-address>
			</block>
			<block v-else>
				<button type="primary" style="font-size: 14px;background-color: #c00000;font-weight: bold;">
					请选择收货地址+
				</button>
			</block>
		</view>
		<image src="../../static/cart_border@2x.png" mode="widthFix" style="width: 100%;"></image>
		<!-- 购物车标题 -->
		<view class="cartTitleContainer">
			<uni-icons type="cart" size="30"></uni-icons>
			<view class="titleText">购物车</view>
		</view>
		<!-- 可以滑动操作的商品项 -->
		<uni-swipe-action class="goodsListContainer">
			<!-- 滑动操作 -->
			<uni-swipe-action-item class="goodSwipeItem" v-for="(item,index) in cart" :key="index" :threshold="0"
				:right-options="goodOptions" @click="swipeButtonHandler(item)">
				<!-- 商品项 -->
				<goods-in-cart class="good" :good="item" @radio-change="radioChangeHandler"
					@numberbox-change="numberboxChangeHandler"></goods-in-cart>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>

</template>

<script>
	// 按需导入 mapGetters 这个辅助方法
	import {
		mapGetters
	} from 'vuex'
	// 按需导入 mapState 这个辅助函数
	import {
		mapState,
		mapMutations
	} from 'vuex'

	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabBar_badge.js'


	export default {
		mixins: [badgeMix],
		computed: {
			// 将 m_cart 模块中的 cart 数组映射到当前页面中使用
			...mapState('m_cart', ['cart']),
		},
		data() {
			return {
				goodOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}],
				address: JSON.parse(uni.getStorageSync('cart') || '[]')
			};
		},
		methods: {
			...mapMutations('m_cart', ['deleteGood', 'saveToStorage']),
			/**
			 * 根据选择器的状态修改对应的商品选择状态
			 * @param {Object} e
			 */
			radioChangeHandler(e) {
				const findResult = this.cart.find(x => x.goods_id === e.goods_id)
				findResult.goods_state = e.goods_state
				//将购物车的数据持久保存到本地
				this.saveToStorage()
			},
			/**
			 * 处理用户对商品数量的修改
			 * @param {Object} e
			 */
			numberboxChangeHandler(e) {
				const findResult = this.cart.find(x => x.goods_id === e.goods_id)
				findResult.goods_count = e.goods_count
				//将购物车的数据持久保存到本地
				this.saveToStorage()
				//更新TabBar的徽标数量
				this.setBadge()
			},
			/**
			 * 处理滑动删除按钮的操作
			 * @param {Object} good
			 */
			swipeButtonHandler(good) {
				console.log("用户删除了商品", good)
				this.deleteGood(good)
			}
		},
		onShow() {
			console.log(JSON.stringify(address))
		}
	}
</script>

<style lang="scss">
	.addressArea {
		height: 160upx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}

	.cartTitleContainer {
		display: flex;
		border-bottom: 2upx solid #e7e7e7;
		font-size: 30upx;
		align-items: center;
		padding-left: 6upx;

		.titleText {
			margin-left: 10upx;
		}
	}

	.good {
		// margin: 2upx;
	}
</style>
