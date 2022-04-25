<template>
	<view>
		<view v-if="cart.length!==0" class="cartContainer">
			<!-- 地址栏 -->
			<view v-if="address===null || address==='{}' || JSON.stringify(address)==='{}'" class="addAddressButton">
				<button type="primary" @click="chooseAddressHandler"
					style="font-size:14px;background-color: #c00000;font-weight: bold;margin: 50upx 10upx;">
					请选择收货地址+
				</button>
			</view>
			<view v-else class="addressArea">
				<my-address :address="address" @address-edit="chooseAddressHandler"></my-address>
			</view>

			<image src="../../static/cart_border@2x.png" mode="widthFix" style="width: 100%;"></image>

			<!-- 购物车标题 -->
			<view class="cartTitleContainer">
				<uni-icons type="cart" size="30"></uni-icons>
				<view class="titleText">购物车</view>
			</view>

			<!-- 添加进入购物车中的商品 -->
			<view class="goodsListContainer">
				<!-- 可以滑动操作的商品项 -->
				<uni-swipe-action>
					<!-- 滑动操作 -->
					<uni-swipe-action-item class="goodSwipeItem" v-for="(item,index) in cart" :key="index"
						:threshold="0" :right-options="goodOptions" @click="swipeButtonHandler(item)">
						<!-- 商品项 -->
						<goods-in-cart class="good" :good="item" @radio-change="radioChangeHandler"
							@numberbox-change="numberboxChangeHandler"></goods-in-cart>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>

			<!-- 结算栏 -->
			<my-settle :checkedGoodsSum="getCheckedGoodsSum" :checkedGoodsAmount="getCheckedGoodsAmount"
				:isAllCheckedStatus="getAllCheckedStatus" :address="address" :token='token'
				@emitRediInfo="redirectInfoHandler" @check-all="checkAllGoodsHandler" @payOrder="payOrderHandler">
			</my-settle>
		</view>
		<view v-else class="noGoodsContainer">
			<image src="../../static/cart_empty@2x.png" mode="aspectFit"></image>
			<text>购物车空空如也~</text>
		</view>

	</view>

</template>

<script>
	// 按需导入store对象的属性和方法
	import {
		mapGetters,
		mapState,
		mapMutations
	} from 'vuex'

	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabBar_badge.js'


	export default {
		mixins: [badgeMix],

		computed: {
			// 将模块中的数组映射到当前页面中使用
			...mapState('m_cart', ['cart']),
			...mapState('m_address', ['address']),
			...mapState('m_user', ['token']),
			...mapGetters('m_cart', ['getCheckedGoodsSum', 'getCheckedGoodsAmount', 'getAllCheckedStatus']),
			...mapGetters('m_address', ['getAddressStr'])
		},
		data() {
			return {
				goodOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}]
			};
		},
		methods: {
			...mapMutations('m_cart', ['deleteGood', 'saveToStorage', 'checkAllGoods']),
			...mapMutations('m_address', ['updateAddress']),
			...mapMutations('m_user', ['updateRedirectInfo']),
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
			},
			/**
			 * 选择地址
			 * 目前仅对小程序生效，日后再增加APP端和H5端
			 */
			chooseAddressHandler() {
				this.updateAddress()
			},
			checkAllGoodsHandler(isAllChecked) {

				this.checkAllGoods(isAllChecked)
			},
			redirectInfoHandler(e) {
				this.updateRedirectInfo(e.redirectInfo)
			},
			async payOrderHandler(isTest) {
				isTest = true
				if (isTest) {
					const [err, succ] = await uni.showModal({
						title: '提示',
						content: '程序属于开发测试状态，以下为伪支付流程,可查看console日志，是否进行？',
						mask: true
					})
					if (succ.cancel) return
					console.log("--------以下支付流程为假流程--------")
				}
				//创建订单
				const goodsQuery = {
					//开发测试的时候把价格写死
					// order_price:this.getCheckedGoodsAmount
					order_price: 0.01,
					consignee_addr: this.getAddressStr,
					goods: this.cart.filter(x => x.goods_state).map(x => ({
						ID: x.goods_id,
						amount: x.goods_count,
						goods_price: x.goods_price,
					}))
				}
				const {
					data: res
				} = await uni.$http.post('/api/public/v1/my/orders/create', goodsQuery)
				console.log('1.创建订单', 'goodsQuery:', goodsQuery, 'res:', res)
				if (res.meta.status !== 200 && !isTest) return uni.$showMsg('订单创建失败', 1500, 'error')
				const orderNumber = isTest ? "GD20180504000000000045" : res.message.order_number


				//预支付订单
				const {
					data: res2
				} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
					order_number: orderNumber
				})
				console.log('2.订单预支付:', 'orderNumber', orderNumber, 'res:', res2)
				if (res.meta.status !== 200 && !isTest) return uni.$showMsg('订单预支付失败', 1500, 'error')
				const payInfo = isTest ? {
					"timeStamp": "1525681145",
					"nonceStr": "BkPggorBXZwPGXe3",
					"package": "prepay_id=wx071619042918087bb4c1d3d72999385683",
					"signType": "MD5",
					"paySign": "D1642DEEF1663C8012EDEB9297E1D516"
				} : res2.message.pay

				//发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				if (err && !isTest) return uni.$showMsg('微信支付失败', 1500, 'error')
				console.log('3.唤起微信支付:', 'pay', payInfo, 'err:', err, 'succ:', succ)

				//完成支付后查询结果
				const {
					data: res3
				} = await
				uni.$http.post('/api/public/v1/my/orders/chkOrder', {
					order_number: orderNumber
				})
				// 检测到订单未支付
				if (res3.meta.status !== 200 && !isTest) return uni.$showMsg('订单未支付', 1500, 'none')
				// 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				})
				console.log('4.查询支付状态:', 'pay', payInfo, 'res:', res3)
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">
	.addressArea {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;

		my-address {
			height: 100%;
			width: 100%;
		}

	}

	.addAddressButton {
		display: flex;
		justify-content: center;
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

	.goodsListContainer {
		padding-bottom: 104upx;
	}

	.noGoodsContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 300upx;
		font-size: 28upx;
		color: #b8b8b8;

		image {
			width: 180upx;
			height: 180upx;
		}
	}
</style>
