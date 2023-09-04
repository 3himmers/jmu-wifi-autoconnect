该脚本为自动连接jmu校园网。（可能对锐捷网络通用？）

1.执行 `npm i` 安装第三方包

2.然后请在config.json中更改配置。

userId,password即为你的账号和密码。

service即为运营商，填入教育网接入，电信宽带接入，联通宽带接入或者移动宽带接入。

3.最后执行 `node index.js` 即可。

本项目可以使用pkg打包：

1.安装pkg：`npm i pkg -g`

2.pkg打包时需要下载打包文件，这里下载速度可能会很慢，直接搜索引擎搜素pkg打包慢，网上有解决方案。

3.选择对应系统的指令，执行打包命令。同时需要注意你的处理器架构，是x86或者arm。openwrt较为特殊需要将参数设置为`-t linuxstatic`。

4.打包之后要在可执行文件同一文件夹下创建config.json配置文件。

5.写个自动化任务，每天6:01自动执行该脚本。注意如果是自动化之心，config.json文件位置可能需要在/root下。

我在releases下发布了我自己打包的在openwrt arm64下运行的可执行文件。

x86一般你都可以编译，arm可以去租用华为云的arm云服务器。按小时计费，很便宜。
