import Axios from "axios";

function getToken(){
	Axios.get('https://fa.fengniaotuangou.cn/v4/getToken').then(function(response){
		console.log(response)
	})
	.catch(function(error){
		console.log(error)
	})
}
const qiniu={

	token:getToken(),
	upurl:'https://upload-z2.qiniup.com',


	showurl:'https://tu.fengniaotuangou.cn/'
	// showurl:'https://qu.qdbnm.com/'
	// showurl:'http://pam213sin.bkt.clouddn.com/'
};

export default qiniu