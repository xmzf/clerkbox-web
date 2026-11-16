# ClerkBox 官网真实界面与动效改造：性能简报

用户优先要求官网中的产品界面忠实还原桌面端，并继续重构官网设计。性能工作服从这两项明确目标，不能通过删除真实控件、替换骨架或伪造下载状态来换分数。用户已授权完成检查后直接提交推送；本轮不修改 DNS、CDN 或托管配置。

| 核心操作 | 起点 | 真正能用的终点 |
|---|---|---|
| 打开产品演示 | 导航开始 | `#workspace textarea` 完成挂载，滚动到可操作位置，聚焦后实际 Chromium 键盘事件输入 `Z`，React 回显仍存在 |
| 切换工作台 / VIBE / 撤回场景 | 场景按钮 click | 根节点 `data-scenario` 更新，并跨过下一次绘制帧 |

DOM 就绪的探针为 `!!document.querySelector('#workspace textarea') && !document.querySelector('#workspace textarea').disabled && !!document.querySelector('.product-demo[data-scenario]')`，完整可见尺寸判断见 `bench/measure.cjs`。DOM 探针只是开始输入验证的条件，最终 `ready` 使用实际输入回显时刻。`dom_ready` 单独保留，禁止用它替换用户能用指标。

不能牺牲桌面源代码中的 UI 结构、标签和真实交互，不改变 Release 安全解析、中英功能、键盘操作与减少动态效果支持。真实界面与官网重构属于用户明确要求的视觉变化，因此旧官网截图不作像素相等护栏；新版产品界面的还原由真实桌面源码对照、截图和几何核对验证。

性能探索目标是把冷缓存「打开到能用」p75 降一半；这是实验目标，不是已实现承诺。先建立旧版上限，并报告新增真实 UI 与动效带来的任何成本。若收益无法证明，不声称提速。回归上限与原始数据均保存在 `bench/`。

主口径：1440×900、DPR1；Chromium/Electron42、独立临时资料目录；每轮新内存 session，禁用缓存；所有实际页面请求（包含 localhost）统一 20ms 延迟、4Mbps 下行、3Mbps 上行，CPU 不限速。使用 offscreen 60fps，避免隐藏窗口的 1fps 降频污染交互延迟。非关键 GitHub Release API 在实验中阻断，避免第三方网络波动；实际下载接口由官网功能检查独立覆盖。

基线固定为提交 `750bbe8fcf1a7df25008a07bb7900ddc4caff0ea`，从 Git 归档到仓库外后独立构建。最终两个构建用相同 HTTP 服务，A、B 交替各至少10次。没有可核实的生产域名或 CrUX 数据，不以本地实验代替线上结论。

交付方式是 GitHub 普通提交与推送；不改托管设置。若需回滚，使用 `git revert <本次提交>`，保留后续独立改动；不 force push。
