<template>
	<view>
		<view class="settleContainer">
			<view class="radioContainer" @click="checkAll">
				<radio color="#c00000" :checked="isAllCheckedStatus" /><text>全选</text>
			</view>
			<view class="amountBox">
				合计：<text class="amount">￥{{checkedGoodsAmount.toFixed(2)}}</text>
			</view>
			<view class="settleButton">
				<button type="default" @click="settleGoods">结算<text
						class="count">({{checkedGoodsSum>99?("99+"):checkedGoodsSum}})</text></button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-settle",
		props: {
			checkedGoodsSum: 0,
			checkedGoodsAmount: 0,
			isAllCheckedStatus: false,
			address: null,
			token: '',
		},
		data() {
			return {
				timer: null,
				seconds: 3
			};
		},
		methods: {
			checkAll() {
				console.log(this.isAllCheckedStatus, '结算组件')
				this.$emit('check-all', {
					isAllCheckedStatus: this.isAllCheckedStatus
				})
			},
			async settleGoods() {
				if (this.checkedGoodsSum === 0) return uni.$showMsg('您还没有选择商品~', 2000, 'none')
				if (this.address === null || this.address === '{}' || JSON.stringify(this.address) === '{}') return uni
					.$showMsg('您还没有选择地址~', 2000,
						'none')
				if (this.token === null || this.token === '') {
					this.delayNavigation()
					return
				}
				this.$emit('payOrder')

			},
			delayNavigation() {
				this.dynamicShowToast()
				this.timer = setInterval(() => {
					this.seconds--
					this.dynamicShowToast()
					if (this.seconds <= 0) {
						clearInterval(this.timer)
						this.seconds = 3
						this.$emit('emitRediInfo', {
							redirectInfo: {
								openType: 'switchTab',
								from: '/pages/cart/cart'
							}
						})
						uni.switchTab({
							url: '/pages/my/my'
						})
					}
				}, 1000)

			},
			dynamicShowToast() {
				uni.showToast({
					icon: 'none',
					title: '请登录后再进行结算\n将在' + this.seconds + '秒后自动跳转到登录页',
					//添加透明遮罩，防止点击穿透
					mask: true,
					duration: 1500
				})
			}
		}
	}
</script>

<style lang="scss">
	.settleContainer {
		width: 100%;
		height: 100upx;
		background-color: white;
		border: 2upx solid #efefef;

		/*固定在底部*/
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;

		display: flex;
		justify-content: space-between;
		align-items: center;

		.radioContainer {
			width: 125upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30upx;

			radio {
				width: 48upx;
				height: 48upx;
				margin: 8upx;
			}
		}

		.amountBox {
			font-size: 30upx;

			.amount {
				color: #C00000;
			}
		}

		.settleButton {
			height: 100%;
			width: 200upx;

			button {
				color: white;
				height: 100%;
				width: 100%;
				background-color: #c00000;
				border-radius: 0;
				font-size: 30upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
