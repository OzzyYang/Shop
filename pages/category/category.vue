<template>
	<view>
		<view class="scrollViewContainer">
			<!-- 左侧的父级分类视图 -->
			<scroll-view class="leftScrollView" scroll-y :style="{height:windowHeight+'px'}">
				<!-- 为被选中的父级分类视图添加active类名 -->
				<view v-for="(item,index) in categoryList" :key="index"
					:class="['leftScrollViewItem',index===active? 'active':'']" @click="changeActive(index)">
					{{item.cat_name}}
				</view>
			</scroll-view>
			<!-- 右侧的子级分类视图，包含两级分类-->
			<scroll-view class="rightScrollView" scroll-y :style="{height:windowHeight+'px'}" :scroll-top="scrollTop">
				<!-- 一级分类标题 -->
				<view class="oneLevel" v-for="(oneLevelItem,oneLevelIndex) in categoryList[active].children"
					:key="oneLevelIndex">
					<view class="oneLevelTitle">{{oneLevelItem.cat_name}} </view>
					<!-- 二级分类视图 -->
					<view class="twoLevel">
						<navigator class="twoLevelContent" v-for="(twoLevelItem,twoLevelIndex) in oneLevelItem.children"
							:key="twoLevelIndex" :url="'../../subpkg/goods_detail/goods_detail?cid='+twoLevelItem.cat_id">
							<image :src="twoLevelItem.cat_icon"></image>
							<text>{{twoLevelItem.cat_name}}</text>
						</navigator>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//窗口可用高度=屏幕高度 - navigationBar高度 - tabBar 高度
				windowHeight: 0,
				//分类数据列表
				categoryList: [],
				//被选中的父级分类（左侧）
				active: 0,
				//滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		methods: {
			/**
			 * 请求分类数据列表
			 */
			async getCategoryList() {
				try {
					const {
						data: res
					} = await uni.$http.get('/api/public/v1/categories')

					if (res.meta.status === 200) {
						this.categoryList = res.message
						console.log("分类数据请求成功", res.meta.status)
					}
				} catch (e) {
					console.log("分类数据请求失败", e)
					return uni.$showMsg()
				}
			},

			/**
			 * 第{index}个父级分类被选中时，将active修改为对应的{index}
			 * @param {Object} index 被选中的父级分类的序号索引
			 */
			changeActive(index) {
				//切换一级类时，动态设置scrollTop的值
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
				this.active = index
			}
		},
		onLoad() {
			//获取系统信息
			const sysInfo = uni.getSystemInfoSync()
			console.log(sysInfo)
			this.windowHeight = sysInfo.windowHeight
			//获取分类数据列表
			this.getCategoryList()
		}
	}
</script>

<style lang="scss">
	.scrollViewContainer {
		display: flex;
		height: 100%;

		.leftScrollView {
			width: 240upx;

			.leftScrollViewItem {
				line-height: 120upx;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 30upx;

				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 6upx;
						height: 60upx;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}

		}

		.rightScrollView {
			margin-top: 10upx;

			.oneLevelTitle {
				height: 60upx;
				font-size: 30upx;
				font-weight: bold;
				display: flex;
				align-items: flex-end;
				justify-content: center;
			}

			.twoLevel {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;

				.twoLevelContent {
					margin: 16upx;
					display: flex;
					flex-direction: column;

					image {
						height: 120upx;
						width: 156.9upx;
					}

					text {
						height: 39upx;
						width: 156.9upx;
						text-align: center;
						font-size: 25upx;
					}
				}

			}
		}
	}
</style>
