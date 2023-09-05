const axios = require('axios');

const RSAUtils = require('./utils/security');

async function main() {
    const date = new Date();
    const options = {timeZone: 'Asia/Shanghai'};
    const formattedDate = date.toLocaleString('en-US', options);
    console.log(formattedDate)
    //read args
    const args = process.argv.slice(2)
    console.log(args)
    let userId = args[0]
    let password = args[1]
    let service = null
    if (args[2] === 1) {
        service = "电信宽带接入"
    } else if (args[2] === 2) {
        service = "联通宽带接入"
    } else if (args[2] === 3) {
        service = "移动宽带接入"
    } else if (args[2] === 4) {
        service = "教育网接入"
    }
    service = encodeURIComponent(encodeURIComponent(service))
    //get pageInfo
    axios.get('http://10.8.2.2').then(res => {
        let s1 = res.data
        let s2 = s1.slice(s1.indexOf('wlanuserip'), s1.indexOf('\'</script>'))
        let macString = s2.slice(s2.indexOf('&mac=') + 5, s2.indexOf('&t=wireless'))
        let queryString = encodeURIComponent(encodeURIComponent(s2))
        if (macString === "") {
            console.log("It seems to be logged in.")
            console.log("\n")
            return
        }
        //get RSAInfo
        let infoUrl = 'http://10.8.2.2/eportal/InterFace.do?method=pageInfo'
        let infoData = 'queryString=' + queryString
        axios.post(infoUrl, infoData).then(res => {
            let publicKeyExponent = res.data.publicKeyExponent
            let publicKeyModulus = res.data.publicKeyModulus
            //encrypt pw
            let passwordMac = password + ">" + macString
            let passwordEncode = passwordMac.split("").reverse().join("")
            RSAUtils.setMaxDigits(400)
            let key = new RSAUtils.getKeyPair(publicKeyExponent, "", publicKeyModulus)
            let newPw = RSAUtils.encryptedString(key, passwordEncode)
            newPw = encodeURIComponent(encodeURIComponent(newPw))
            //login
            let loginUrl = 'http://10.8.2.2/eportal/InterFace.do?method=login'
            let loginData = "userId=" + userId + "&password=" + newPw +
                "&service=" + service + "&queryString=" + queryString +
                "&operatorPwd=&operatorUserId=&validcode=&passwordEncrypt=true"
            axios.post(loginUrl, loginData).then(res => {
                console.log(res.data)
                console.log("\n")
            })
        })
    })

}

main()