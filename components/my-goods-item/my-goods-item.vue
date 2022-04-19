<template>
	<view>
		<view class="goodsListItem" @click="toDetail()">
			<!-- 左侧商品海报 -->
			<!-- 商品有图片则渲染图片 -->
			<view class="goodsListItemLogo" v-if="goodsItem.goods_small_logo!==''">
				<image :src="goodsItem.goods_small_logo" mode="aspectFit"></image>
			</view>
			<!-- 没有则渲染图片找不到的信息 -->
			<view class="goodsListItemNone" v-else>
				<uni-icons type="close" size="25"></uni-icons>
				<text>商品图片失踪了...</text>
			</view>
			<!-- 右侧商品信息 -->
			<view class="goodsListItemInfo">
				<text class="name">{{goodsItem.goods_name}}</text>
				<!-- 渲染商品价格的时候，通过管道符|调用过滤器 -->
				<text class="price">￥{{goodsItem.goods_price | toFixed}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		//过滤器
		filters: {
			//将商品的价格固定为包含两位小数的格式
			toFixed(num) {
				return Number(num).toFixed(2)
			}
		},
		props: {
			//组件要展示的商品对象
			goodsItem: {
				type: Object,
				// default: {}
			},
		},
		name: "my-goods-item",
		data() {
			return {

			};
		},
		methods: {
			/**
			 * 跳转至商品详情页
			 */
			toDetail() {
				uni.navigateTo({
					url: '../../subpkg/goods_detail/goods_detail?goods_id=' + this.goodsItem.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.goodsListItem {
		height: 250upx;
		display: flex;
		border-bottom: 2upx solid #efefef;
		padding: 12upx 6upx;

		.goodsListItemLogo {
			flex: 1;

			image {
				height: 100%;
				width: 100%;
			}
		}


		.goodsListItemNone {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 20upx;
			background-color: #eeeeee;
		}

		.goodsListItemInfo {
			flex: 2;

			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 4upx 6upx;

			.name {
				font-size: 25upx;
			}

			.price {
				font-size: 40upx;
				color: #c00000;
			}
		}
	}
</style>
