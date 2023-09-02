const fs = require('fs');
const axios = require('axios');

const RSAUtils = require('./utils/security');
const config = require('./config.json')

const today = new Date();
const logPath = 'log/' +formatData(today) + '.txt';
const file = fs.createWriteStream(logPath);
const logger = new console.Console(file, file);

async function main() {

    let userId = config.username
    let password = config.password
    let service = encodeURIComponent(encodeURIComponent(config.service))

    //get pageInfo
    axios.get('http://10.8.2.2').then(res => {
        // logger.log(res.data)
        let s1 = res.data
        let s2 = s1.slice(s1.indexOf('wlanuserip'), s1.indexOf('\'</script>'))
        let macString = s2.slice(s2.indexOf('&mac=') + 5, s2.indexOf('&t=wireless'))
        let queryString = encodeURIComponent(encodeURIComponent(s2))
        //get RSAInfo
        let infoUrl = 'http://10.8.2.2/eportal/InterFace.do?method=pageInfo'
        let infoData = 'queryString=' + queryString
        axios.post(infoUrl, infoData).then(res => {
            // logger.log(res.data)
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
                logger.log(res.data)
            })
        })
    })
}

function formatData(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hour}-${minute}-${second}`
}

main()