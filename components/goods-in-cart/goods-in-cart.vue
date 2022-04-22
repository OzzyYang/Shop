<template>
	<view>
		<view class="goodInfoContainer">
			<view class="goodRadio">
				<radio color="#c00000" :checked="good.goods_state" @click="radioClickHandler" />
				<!-- <uni-icons type="checkbox" size="25" color="#c00000"></uni-icons> -->
			</view>
			<view class="goodLogo">
				<image :src="good.goods_small_logo" mode="aspectFit"></image>
			</view>
			<view class="goodInfo">
				<view class="goodTitle">{{good.goods_name}}</view>
				<view class="priceAndCount">
					<view class="price">￥{{good.goods_price}}</view>
					<uni-number-box class="count" :min="1" :value="good.goods_count" @change="numberboxHandler" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goods-in-cart",
		props: {
			good: {
				type: Object,
			},
			goodMax: 100
		},
		data() {
			return {

			};
		},
		methods: {
			// radio 组件的点击事件处理函数
			radioClickHandler() {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
				// 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
				this.$emit('radio-change', {
					// 商品的 Id
					goods_id: this.good.goods_id,
					// 商品最新的勾选状态
					goods_state: !this.good.goods_state
				})
			},
			numberboxHandler(newValue) {
				this.$emit('numberbox-change', {
					// 商品的 Id
					goods_id: this.good.goods_id,
					// 商品最新的勾选状态
					goods_count: newValue
				})
			}
		}
	}
</script>

<style lang="scss">
	.goodInfoContainer {
		height: 250upx;
		width: 100%;
		display: flex;
		border-bottom: 2upx solid #e7e7e7;
		padding: 10upx 2upx;

		.goodRadio {
			flex: 0.5;
			display: flex;
			justify-content: center;
			align-items: center;

			radio {
				width: 48upx;
				height: 48upx;
				margin: 6upx;
			}

			// border: 10upx solid #888888;
		}

		.goodLogo {
			height: 100%;
			flex: 3;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				height: 100%;
				width: 100%;
			}
		}

		.goodInfo {
			flex: 5;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			margin: 0 10upx;

			.goodTitle {
				width: 100%;
				font-size: 25upx;
			}

			.priceAndCount {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;

				.price {
					font-size: 40upx;
					color: #c00000;
				}

				.count {
					// font-size: 100upx;
					// height: 100upx;
					width: 200upx;
				}
			}
		}
	}
</style>
