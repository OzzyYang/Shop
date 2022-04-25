<template>
	<view>
		<view class="loginContainer">
			<uni-icons type="personadd" size="100"></uni-icons>
			<button type="default" open-type="getUserInfo" @click="getUserInfo">一键登录</button>
			<view class="loginText">登陆后即可享受更多权益~</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: "my-login",
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		data() {
			return {};
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateUserToken', 'updateRedirectInfo']),
			getUserInfoProfileTest() {
				uni.getUserProfile({
					desc: "测试",
					lang: "zh_CN",
					success(res) {
					},
					fail(res) {
						return uni.$showMsg('登陆授权失败', 2000, 'error')
					}
				})
			},
			/**
			 * 获取用户的基本信息
			 * 仅限微信
			 */
			async getUserInfo(e) {
				const [err, res] = await uni.getUserProfile({
					desc: "测试",
					lang: "zh_CN"
				})
				if (err || res.errMsg !== 'getUserProfile:ok') return uni.$showMsg('登陆授权失败')
				this.updateUserInfo(res.userInfo)
				this.getUserToken(res, true)
			},
			async getUserToken(info, isTest) {
				const [err, res] = await uni.login().catch(err => err)
				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登陆失败')

				//查询参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}


				//请求Token
				const {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin')
				if (loginResult.meta.status !== 200 && !isTest) {
					return uni.$showMsg('登陆失败')
				}
				uni.$showMsg('登陆成功', 2000, 'success')
				this.updateUserToken(isTest ?
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o" :
					loginResult.message.token)
				this.navigateBack()
			},
			navigateBack() {
				if (this.redirectInfo === null || this.redirectInfo === '{}' || JSON.stringify(this.redirectInfo) === '{}')
					return
				switch (this.redirectInfo.openType) {
					case 'switchTab': {
						uni.switchTab({
							url: this.redirectInfo.from
						})
						this.updateRedirectInfo('{}')
						break;
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.loginContainer {
		display: flex;
		padding-top: 300upx;
		flex-direction: column;
		align-items: center;

		button {
			color: white;
			width: 90%;
			background-color: #c00000;
			border-radius: 50upx;
			margin: 30upx 0;
		}

		.loginText {
			font-size: 25upx;
			color: #333333;
		}
	}
</style>
