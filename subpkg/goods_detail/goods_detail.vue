<template>
	<view>
		<!-- 购买导航栏 -->
		<view class="goodsNavigationContainer">
			<uni-goods-nav @click="onClick" />
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in goodsInfo.pics" :key="index">
				<image :src="item.pics_big" mode="aspectFit" @click="previewImage(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goodsInfoContainer" v-if="goodsInfo.goods_name">
			<view class="goodsInfo">
				<text class="title">{{goodsInfo.goods_name}}</text>
				<view class="starContainer">
					<uni-icons type="star" size="25"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<view class="underTitle">
				<view class="delivery">快递：免运费</view>
				<view class="price">￥{{goodsInfo.goods_price}}</view>
			</view>
		</view>
		<!-- 商品详情区域 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// goodsId: 0,
				goodsInfo: {}
			};
		},
		methods: {
			async getGoodsInfo(goodsId) {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id: goodsId
				})
				if (res.meta.status === 200) {
					// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
					res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g,
						'<img style="display:block;" ')
					// 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名,解决 .webp 格式图片在 ios 设备上无法正常显示的问题
					res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g,
						'<img style="display:block;" ').replace(/webp/g, 'jpg')
					this.goodsInfo = res.message
					console.log("商品详情数据请求成功", res)
				} else {
					console.log("商品详情数据请求失败", res)
					return uni.$showMsg()
				}
			},
			/**
			 * 实现轮播图的预览效果
			 * @param {Object} index 当前点击的轮播图索引
			 */
			previewImage(index) {
				console.log("点击图片")
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current: index,
					// 所有图片 url 地址的数组
					urls: this.goodsInfo.pics.map(x => x.pics_big)
				})
			},
			onClick() {
				uni.$showMsg("点击购买按钮", 1500, "none")
			}
		},
		onLoad(option) {
			const goodsId = option.goods_id
			this.getGoodsInfo(goodsId)
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750upx;
		width: 100%;

		image {
			height: 100%;
			width: 100%;
		}
	}

	.goodsNavigationContainer {
		// 为商品导航组件添加固定定位
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.goodsInfoContainer {
		width: 100%;
		margin-bottom: 10upx;

		.goodsInfo {
			margin-top: 20upx;
			height: 90upx;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				flex: 4;
				height: 100%;
				font-size: 28upx;
				display: flex;
				align-items: center;
				margin-left: 9upx;
			}

			.starContainer {
				flex: 1;
				height: 100%;
				font-size: 28upx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 2upx solid #efefef;
				margin: 10upx;
			}
		}

		.underTitle {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.delivery {
				font-size: 26upx;
				color: #848484;
			}

			.price {
				font-size: 45upx;
				color: #c00000;
				margin-right: 30upx;
			}
		}
	}
</style>
