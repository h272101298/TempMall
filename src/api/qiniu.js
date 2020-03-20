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

	token:'og7Mlfh-qhsdYS2V5-1s2cmeYEinlnJkHKoLwZmg:88KwI1o_stLYTjnNIpWQltGEMew=:eyJzY29wZSI6InNoYW5nY2hlbmdtdWJhbiIsImRlYWRsaW5lIjoxOTMxODE0ODk4fQ==',

	upurl:'https://upload-z2.qiniup.com',


	showurl:'https://sheng.qdbnm.com/'
	// showurl:'https://qu.qdbnm.com/'
	// showurl:'http://pam213sin.bkt.clouddn.com/'
};

export default qiniu