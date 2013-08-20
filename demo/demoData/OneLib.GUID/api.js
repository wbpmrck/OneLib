[
    {
        "name":"创建GUID",
        "apis":[
            {
                "name":"getGUID",
                "type":"function",
                "desc":"GUID是一种由算法生成的二进制长度为128位的数字标识符。GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx” 。其中的 x 是 0-9 或 a-f 范围内的一个32位十六进制数。在理想情况下，任何计算机和计算机集群都不会生成两个相同的GUID",
                "params":[
                    {"name":"len","type":"Number","desc":"限制生成的GUID的数量"},
                    {"name":"radix","type":"Number","desc":"生成的guid的数制，如2,10,16"}
                ],
                "demoCodeRefs":[
                    {
                        "name":"getGUID基本用法",
                        "desc":"不使用任何参数，则默认输出标准的基于10进制的GUID",
                        "type":"example",
                        "codeUrl":"/demo/demoData/OneLib.GUID/example.getGUID.js?_=123",
                        "cssUrls":[
                        ],
                        "javascriptUrls":[
                        ]
                    },
                    {
                        "name":"点击下面按钮运行示例",
                        "desc":"",
                        "type":"real",
                        "codeUrl":"/demo/demoData/OneLib.GUID/example.getGUID.html",
                        "cssUrls":[
                        ],
                        "javascriptUrls":[
                            "/src/OneLib.GUID.js",
                            "/demo/demoData/OneLib.GUID/example.getGUID.js?_=456"
                        ]
                    }
                ]
            }
        ]
    }
]