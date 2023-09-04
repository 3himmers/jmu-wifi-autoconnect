const axios = require('axios');
const fs = require('fs');
const path = require('path');

const RSAUtils = require('./utils/security');
const configPath = path.join( process.cwd(), 'config.json')

async function main() {
    const date = new Date();
    const options = { timeZone: 'Asia/Shanghai' };
    const formattedDate = date.toLocaleString('en-US', options);
    console.log(formattedDate)
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const config = JSON.parse(data);
        let userId =  config.userId
        let password =  config.password
        let service = encodeURIComponent(encodeURIComponent(config.service))
        //get pageInfo
        axios.get('http://10.8.2.2').then(res => {
            let s1 = res.data
            let s2 = s1.slice(s1.indexOf('wlanuserip'), s1.indexOf('\'</script>'))
            let macString = s2.slice(s2.indexOf('&mac=') + 5, s2.indexOf('&t=wireless'))
            let queryString = encodeURIComponent(encodeURIComponent(s2))
            if (macString===""){
                console.log("It seems to be logged in.")
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
                })
            })
        })
    });

}

main()