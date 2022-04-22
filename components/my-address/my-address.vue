<template>
	<view>
		<view class="addressBoxContainer">
			<view class="userInfo">
				<view class="userName">收货人：陈小娇</view>
				<view class="phoneNumber">电话：18457051787</view>
				<view class="address">收货地址：湖南省长沙市岳麓区岳麓街道唯盛园小区12栋一单元</view>
			</view>
			<uni-icons class="edit" type="compose" :size="28"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-address",
		data() {
			return {
				//收货地址
				address: {}
			}
		}
	}
</script>

<style lang="scss">
	.addressBoxContainer {
		height: 100%;
		width: 100%;
		padding: 20upx 10upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;

		.userInfo {
			height: 70%;
			flex: 9;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			.userName {
				height: 50%;
				width: 40%;
			}

			.phoneNumber {
				height: 50%;
				width: 58%;
				text-align: right;
				margin-right: 2%;
			}

			.address {
				height: 50%;
				width: 100%;
			}
		}

		.edit {
			height: 70%;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 10upx;
		}
	}
</style>
