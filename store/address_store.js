export default {
	//开启命名空间
	namespaced: true,

	//模块的state数据
	state: () => ({
		//用来存储地址的对象，包含如下属性：
		// userName	string	收货人姓名	
		// postalCode	string	邮编	
		// provinceName	string	国标收货地址第一级地址	
		// cityName	string	国标收货地址第二级地址	
		// countyName	string	国标收货地址第三级地址	
		// detailInfo	string	详细收货地址信息	
		// nationalCode	string	收货地址国家码	
		// telNumber	string	收货人手机号码	
		// errMsg	string	错误信息 **仅限微信小程序**
		address: JSON.parse(uni.getStorageSync('address') || '{}') //读取本地存储的地址数据，对 address 进行初始化
	}),

	//模块的mutations方法
	mutations: {
		/**
		 * 更新地址
		 * @param {Object} state
		 * @param {Object} address
		 */
		async updateAddress(state) {
			console.log('运行中')
			//调用小程序提供的chooseAddress()方法，即可使用选择收货地址的功能
			//返回值是一个数组：第一项为错误对象；第二项为成功之后的收货地址对象
			const [err, succ] = await uni.chooseAddress().catch(err => err)
			//如果成功的选择了收货地址
			if (err === null && succ.errMsg === 'chooseAddress:ok') {
				// console.log(succ)
				//为收货地址对象赋值
				state.address = succ
			}
			//如果用户没有授权
			// 在模拟器和安卓真机上，错误消息 err.errMsg 的值为 chooseAddress:fail auth deny
			// 在 iPhone 真机上，错误消息 err.errMsg 的值为 chooseAddress:fail authorize no response
			if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg ===
					'chooseAddress:fail authorize no response')) {
				console.log(err)
				this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
			}
			//通过commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
			this.commit('m_address/saveToStorage')
		},
		/**
		 * 让用户对地址重新进行授权
		 */
		async reAuth() {
			//提示用户对地址进行授权
			const [err2, confirmResult] = await uni.showModal({
				content: '检测到您没打开地址权限，是否去设置打开？',
				confirmText: "确认",
				cancelText: "取消",
			})
			//如果弹框异常，则直接退出
			if (err2) return
			//如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
			if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
			//如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
			if (confirmResult.confirm) return uni.openSetting({
				//授权结束， 需要对授权的结果做进一步判断
				success: (settingResult) => {
					//地址授权的值等于 true，提示用户 “授权成功”
					if (settingResult.authSetting['scope.address']) return
					uni.$showMsg('授权成功！请选择地址')
					//地址授权的值等于 false，提示用户 “您取消了地址授权”
					if (!settingResult.authSetting['scope.address']) return
					uni.$showMsg('您取消了地址授权！')
				}
			})
		},
		/**
		 * 将地址数据保存到本地
		 */
		saveToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},

	//模块的getters属性
	getters: {
		/**
		 * 获取完整的地址字符串
		 * @param {Object} state
		 */
		getAddressStr(state) {
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}
