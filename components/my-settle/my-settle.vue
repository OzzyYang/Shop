<template>
	<view>
		<view class="settleContainer">
			<view class="radioContainer" @click="checkAll">
				<radio color="#c00000" :checked="isAllChecked" /><text>全选</text>
			</view>
			<view class="amountBox">
				合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
			</view>
			<view class="settleButton">
				<button type="default">结算<text class="count">({{checkedGoodsSum}})</text></button>
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
			isAllChecked: false
		},
		data() {
			return {

			};
		},
		methods: {
			checkAll() {
				// console.log(this.isAllChecked,'结算组件')
				this.$emit('check-all', {
					isAllChecked: this.isAllChecked
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

		/*固定在底部*/
		position: fixed;
		bottom: 0;
		left: 0;

		display: flex;
		justify-content: space-between;
		align-items: center;

		.radioContainer {
			width: 130upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			radio {
				width: 48upx;
				height: 48upx;
				margin: 8upx;
			}
		}

		.amountBox {
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
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
