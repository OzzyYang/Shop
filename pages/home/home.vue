<template>
	<view>
		<!-- 使用自定义的搜索组件,在外面包裹一个容器，才能在小程序中实现吸顶效果-->
		<view class="mySearchBox">
			<my-search></my-search>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图 -->
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="navigationBar">
			<view class="navigationItem" v-for="(item,index) in navigationList" :key="index"
				@click="navigationClick(item)">
				<image :src="item.image_src"></image>
			</view>
		</view>
		<!-- 楼层 -->
		<view class="floorList">
			<!-- 楼层的item项 -->
			<view class="floorItem" v-for="(item,index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image class="floorTitle" :src="item.floor_title.image_src"></image>
				<!-- 楼层海报 -->
				<view class="floorImage">
					<!-- 头版大海报 -->
					<navigator class="floorBigImage" :url="item.product_list[0].url">
						<image mode="widthFix" :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width+'rpx'}"></image>
					</navigator>

					<!-- 右侧四个小海报-->
					<view class="floorSmallImage">
						<navigator class="floorSmallImageItem"
							v-for="(smallImageItem,smallImageIndex) in item.product_list" v-if="smallImageIndex!==0"
							:key="smallImageIndex" :url="smallImageItem.url">
							<image :src="smallImageItem.image_src" :style="{width:smallImageItem.image_width+'rpx'}"
								mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabBar_badge.js'
	import {
		mapMutations
	} from 'vuex'


	export default {
		mixins: [badgeMix],
		data() {
			return {
				//轮播图的数据列表
				swiperList: [],
				//分类导航的数据列表
				navigationList: [],
				//首页楼层的数据列表
				floorList: []
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getNavigationList()
			this.getFloorList()
			// this.updateFromStorage()
		},
		methods: {
			/**
			 * 监听用户点击的分类导航项，并切换到指定页面
			 * @param {Object} item 用户点击的分类导航项
			 */
			navigationClick(item) {
				// console.log(item.name)
				switch (item.name) {
					case "分类": {
						uni.switchTab({
							url: '../category/category'
						})
						break;
					}
				}
			},
			/**
			 * 获取轮播图的数据
			 */
			async getSwiperList() {
				try {
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/home/swiperdata')
					if (res.meta.status === 200) {
						console.log('轮播图数据请求成功', res.meta.status)
						this.swiperList = res.message
					}
				} catch (e) {
					console.log('轮播图数据请求失败', e)
					return uni.$showMsg()
				}
			},
			/**
			 * 获取分类导航的数据
			 */
			async getNavigationList() {
				try {
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/home/catitems')
					if (res.meta.status === 200) {
						console.log('分类导航数据请求成功', res.meta.status)
						this.navigationList = res.message
					}
				} catch (e) {
					console.log('分类导航数据请求失败', e)
					return uni.$showMsg()
				}
			},
			/**
			 * 获取楼层的数据
			 */
			async getFloorList() {
				try {
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/home/floordata')
					if (res.meta.status === 200) {
						console.log('楼层数据请求成功', res.meta.status)
						this.floorList = res.message
						// 通过双层 forEach 循环，处理 URL 地址
						res.message.forEach(floor => {
							floor.product_list.forEach(product => {
								product.url = '/subpkg/goods_list/goods_list?' + product
									.navigator_url.split('?')[1]

							})
						})
					}
				} catch (e) {
					console.log('楼层数据请求失败', e)
					return uni.$showMsg()
				}
			}

		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330upx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}

	}

	.mySearchBox {
		// 设置定位效果为“吸顶”
		position: sticky;
		// 吸顶的“位置”
		top: 0;
		// 提高层级，防止被轮播图覆盖
		z-index: 999;
	}

	.navigationBar {
		display: flex;
		justify-content: space-around;
		margin: 15upx 0;

		image {
			width: 128upx;
			height: 140upx;
		}
	}

	.floorList {
		.floorItem {
			margin: 4upx;

			.floorTitle {
				height: 60upx;
				width: 100%;
			}

			.floorImage {
				width: 100%;
				display: flex;
				justify-content: space-around;
				padding-left: 4upx;
				padding-right: 4upx;

				.floorBigImage {
					flex: 1;
					height: 100%;
					padding: 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.floorSmallImage {
					flex: 2;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					padding-right: 8upx;
				}
			}


		}
	}
</style>
