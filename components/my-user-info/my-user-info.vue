<template>
	<view class="myUserInfoContainer">
		<!-- 顶部栏 -->
		<view class="topBox">
			<image class="profilePhoto" mode="aspectFit" :src="userInfo.avatarUrl"></image>
			<!-- <uni-icons class="profilePhoto" type="contact" size="90" color="#efefef"></uni-icons> -->
			<view class="profileName">{{userInfo.nickName}}</view>
		</view>

		<!-- 收藏和足迹栏 -->
		<view class="firstColContainer">
			<view class="firstColItem" v-for="(item,index) in firstColContent" :key="index">
				<text class="amount">{{item.content.length}}</text>
				<text class="firstColTitle">{{item.name}}</text>
			</view>
		</view>

		<!-- 我的订单栏 -->
		<view class="secondColContainer">
			<view class="secondColTitle">
				我的订单
			</view>
			<view class="secondColItem" v-for="(item,index) in secondColContent" :key="index">
				<image :src="item.image" class="secondColIcon" mode="aspectFit"></image>
				<view class="secondColTitle">{{item.name}}</view>
			</view>
		</view>

		<!-- 设置栏 -->
		<view class="thirdColContainer">
			<view class="thirdColItem" v-for="(item,index) in thirdColContent" :key="index"
				@click="thirdColHandler(item)">
				<text class="thirdColTitle">{{item}}</text>
				<uni-icons class="rightArrow" type="right"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: "my-user-info",
		computed: {
			...mapState('m_user', ['userInfo']),
			...mapState('m_my', ['firstColContent', 'secondColContent', 'thirdColContent']),
		},
		data() {
			return {

			};
		},
		methods: {
			...mapMutations('m_address', ['updateAddress']),
			...mapMutations('m_user', ['updateUserInfo']),
			thirdColHandler(item) {
				switch (item) {
					case '退出登录': {
						this.logout()
						break;
					}
				}
			},
			async logout() {
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？'
				}).catch(err => err)
				if (succ && succ.confirm) {
					this.updateAddress(true)
					this.updateUserInfo('')
				}
			},
		}
	}
</script>

<style lang="scss">
	.myUserInfoContainer {
		height: 100%;
		background-color: #f4f4f4;
		display: flex;
		flex-direction: column;
		align-items: center;

		.topBox {
			width: 100%;
			height: 400upx;
			background-color: #c00000;
			display: flex;
			flex-direction: column;
			align-items: center;


			.profilePhoto {
				margin-top: 10%;
				width: 180upx;
				height: 180upx;
				border-radius: 90upx;
				border: 6upx solid white;
				box-shadow: 0 2upx 15upx #4d4d4d;
			}

			.profileName {
				color: white;
				font-weight: bold;
				margin-top: 20upx;
			}
		}

		.firstColContainer {
			height: 100upx;
			width: 92%;
			display: flex;
			border: 2upx solid #efefef;
			border-radius: 10upx;
			box-shadow: 0 0 4rpx #dcdcdc;
			background-color: white;

			// 相对定位,距离上一个元素-20upx
			position: relative;
			top: -20upx;

			.firstColItem {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;

				.firstColTitle {
					font-size: 25upx;
				}
			}
		}

		.secondColContainer {
			width: 92%;
			display: flex;
			flex-wrap: wrap;
			border: 2upx solid #efefef;
			border-radius: 10upx;
			box-shadow: 0 0 4rpx #dcdcdc;
			background-color: white;
			margin-top: 10upx;

			.secondColTitle {
				width: 98%;
				height: 80upx;
				display: flex;
				align-items: center;
				padding-left: 2%;

			}

			.secondColItem {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				padding: 20rpx 0;
				border-top: 2rpx solid #efefef;

				.secondColIcon {
					height: 70upx;
					width: 120upx;
				}

				.secondColTitle {
					height: 35upx;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					align-items: flex-start;
				}
			}
		}

		.thirdColContainer {
			height: 300upx;
			width: 92%;
			display: flex;
			flex-direction: column;
			border: 2upx solid #efefef;
			border-radius: 10upx;
			box-shadow: 0 0 4rpx #dcdcdc;
			background-color: white;
			margin-top: 20upx;

			.thirdColItem {
				flex: 1;
				display: flex;
				justify-content: space-between;
				border-bottom: 2upx solid #efefef;

				.thirdColTitle {
					width: 98%;
					height: 100%;
					display: flex;
					align-items: center;
					padding: 0 2%;

				}

				.rightArrow {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0 2%;
				}
			}


		}

	}
</style>
