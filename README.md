该脚本为自动连接jmu校园网。（可能对锐捷网络通用？）

执行 npm i 安装第三方包

然后请在config.json中更改配置。

username,password即为你的账号和密码。

service即为运营商，填入教育网接入，电信宽带接入，联通宽带接入或者移动宽带接入。

最后执行 node index.js 即可。

建议写个自动化脚本，每天6:01自动执行该脚本。

如果你路由器有刷openwrt，可以将该脚本编译为二进制文件。 在Scheduled Tasks下配置自动化执行。

具体编译功能可以网上搜索。 需要注意你的openwrt的处理器架构，如x86或者arm。

x86一般你都可以编译，arm可以去租用华为云的arm云服务器。按小时计费，很便宜。
