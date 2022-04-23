<template>
	<view>
		<view class="addressBoxContainer">
			<view class="userInfo">
				<view class="userName">收货人：{{address.userName}}</view>
				<view class="telNumber">电话：{{address.telNumber}}</view>
				<view class="address">
					收货地址：{{address.provinceName + address.cityName + address.countyName + address.detailInfo}}</view>
			</view>
			<uni-icons class="edit" type="compose" :size="28" @click="editTabHandler"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-address",
		props: {
			//收货地址
			address: {}
		},
		data() {
			return {}
		},
		methods: {
			editTabHandler() {
				this.$emit('address-edit')
			}
		}
	}
</script>

<style lang="scss">
	.addressBoxContainer {
		height: 160upx;
		width: 100%;
		padding: 10upx 10upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;

		.userInfo {
			height: 100%;
			flex: 9;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			.userName {
				height: 33.333%;
				width: 40%;
				display: flex;
				align-items: flex-end;
			}

			.telNumber {
				height: 33.333%;
				width: 58%;
				text-align: right;
				margin-right: 2%;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
			}

			.address {
				margin: 10upx 0;
				height: 66.666%;
				width: 100%;
				display: flex;
				align-items: center;
			}
		}

		.edit {
			height: 100%;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 10upx;
		}
	}
</style>
