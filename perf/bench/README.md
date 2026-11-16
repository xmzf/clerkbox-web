# 可复测台架

依赖已安装桌面项目的 Electron，仅测量工具使用它，官网没有新增 Electron 依赖。若桌面仓库不在默认位置，设置 `CLERKBOX_DESKTOP_PACKAGE` 为其 `package.json` 绝对路径。

两个版本都先 `npm run build`，再用相同静态服务启动：

```powershell
node perf/bench/serve.cjs <旧版dist绝对路径> 5182
node perf/bench/serve.cjs dist 5183
```

在第三个终端执行交替配对测量：

```powershell
node perf/bench/run.cjs --url http://127.0.0.1:5182/ --url-b http://127.0.0.1:5183/ --runs 10 --out perf/bench/paired.json
node perf/bench/ratchet.mjs perf/bench/paired.json B
node perf/bench/ratchet.mjs perf/bench/paired.json B perf/bench/ceilings.json paired
```

慢机档增加 `--cpu 4`，不要把慢机档与主口径混算。单版本基线省略 `--url-b`。每组小于10次会拒绝执行；每轮必须输入验证成功、无翻译key泄露、无横向溢出、场景选择器存在。主指标单位毫秒，字节统计为编码响应体，不包含HTTP头。

`ceilings.json` 是业务改造前固定的旧版上限。时间值允许注明的系统/帧量化噪音；请求、字节类计数不允许容差。台架失败时退出码非0，不能用失败样本排除后凑满10次。

`fixed` 模式使用开工前固定上限；`paired` 模式使用同一组报告A的p75，避免机器负载变化误判产品收益。两者都保留；`paired`不改写固定文件。真实UI新增功能使旧版预算不通过时，必须在报告列出成本，禁止修改原始旧版上限伪装通过。可以另建注明为新功能预算的文件，给以后回归使用。

本轮旧版预算已如实失败，见 `../报告.md`。`ceilings-fidelity-v1.json` 是用户要求真实UI后新增的功能预算，与旧版比较不能用这个文件替代：

```powershell
node perf/bench/ratchet.mjs perf/bench/paired.json B perf/bench/ceilings-fidelity-v1.json
```

`navigation_bytes/navigation_requests` 截止第一次真实输入回显，`bytes_total/requests` 则包含随后三个场景的首次操作，尤其包含真实森林背景下载。不能拿后者假称首屏负担，也不能把前者冒充完整场景流量。`lcp.valid_n` 不足10时不报告其前后结论。

所有测试使用新的浏览器临时资料和内存会话，不读用户浏览器或应用配置。开发工具诊断协议只连接本次创建的测试窗口。
