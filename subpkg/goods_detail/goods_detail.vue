<template>
	<view>
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
		<rich-text class="goodsDetailContainer" :nodes="goodsInfo.goods_introduce"></rich-text>
		<!-- 购买导航栏 -->
		<view class="goodsNavigationContainer">
			<uni-goods-nav :buttonGroup="customButtomGroup" :options="options" :fill="true" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	//从vuex中按需导出mapState辅助方法
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		computed: {
			/*调用mapState方法，把m_cart模块中的cart数组映射到当前页面中，作为计算属性来使用
			...mapState('模块的名称',['要映射的数据名称1','要映射的数据名称2'])*/
			...mapState('m_cart', ['cart']),
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapGetters('m_cart', ['getCartSize'])
		},
		//监听器
		watch: {
			//使用对象的形式来定义 watch 侦听器（详细文档请参考 Vue 官方的watch 侦听器教程）
			// 定义 getCartSize 侦听器，指向一个配置对象
			getCartSize: {
				// handler 属性用来定义侦听器的 function 处理函数
				handler(newVal) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				},
				// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
				immediate: true
			}
			// 下面的方法定义的监听器在页面首次加载后不会被调用。因此导致了商品详情页在首次加载完毕之后，不会将商品的总数量显示到商品导航区域。
			// getCartSize(newValue) {
			// 	const findResult = this.options.find(x => x.text === '购物车')
			// 	if (findResult) {
			// 		findResult.info = newValue
			// 	}
			// }
		},
		data() {
			return {
				goodsInfo: {},
				options: [{
					icon: 'shop',
					text: '店铺',
					info: 0,
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0,
					infoBackgroundColor: '#ec0000',
					infoColor: "#f5f5f5"
				}],
				customButtomGroup: [{
						text: '加入购物车',
						backgroundColor: 'linear-gradient(90deg,  #f89d00, #e25300)',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: 'linear-gradient(90deg, #ea3a00, #c00000)',
						color: '#fff'
					}
				]
			}
		},
		methods: {
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart']),
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
			onClick(e) {
				switch (e.index) {
					case 0:
						uni.$showMsg("点击了店铺", 1500, 'none')
						break;

					case 1:
						uni.switchTab({
							url: '../../pages/cart/cart'
						})
						break;
				}
			},
			buttonClick(e) {
				switch (e.content.text) {
					case "加入购物车":
						const goods = {
							goods_id: this.goodsInfo.goods_id,
							goods_name: this.goodsInfo.goods_name,
							goods_price: this.goodsInfo.goods_price,
							goods_count: 1,
							goods_small_logo: this.goodsInfo.goods_small_logo,
							goods_state: true
						}
						this.addToCart(goods)
						break;

					case "立即购买":
						uni.$showMsg("点击了购买", 1500, 'none')
						// uni.navigateTo({
						// 	url: '../../pages/cart/cart'
						// })
						break;
				}
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

	.goodsDetailContainer {
		//防止商品被导航栏遮盖
		padding-bottom: 100upx;
	}

	.goodsNavigationContainer {
		border-top: 2upx solid #ebebeb;
		// 为商品导航组件添加固定定位，使其浮在底部
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}
</style>
