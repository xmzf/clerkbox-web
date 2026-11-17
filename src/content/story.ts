export const storyCopy = {
  zh: {
    eyebrow: '04 / 一点一点，长成现在',
    title: '从一个念头，\n到一个工作现场。',
    intro:
      '2026 年 5 月立项。想法先有了，代码慢慢跟上。从最早的源码快照，到 4.1.1 的公网连接，工作现场一点点延伸，每一次变化，都有来处。',
    origin: '立项时间由项目发起者补充；其余节点据公开 Git 记录整理。',
    source: '查看提交记录',
    expand: '展开这个阶段的记录',
    mayTitle: '先给想法，一个名字。',
    mayBody: 'ClerkBox 在 5 月立项。一个关于桌面 AI 工具的想法，从这里开始。',
    mayEvidence: '项目发起者回溯 · 2026 年 5 月',
    julyTitle: '把想法，放进源码里。',
    julyBody:
      '7 月 22 日，仓库留下 v1.6.0 的初始源码快照。月底，Skills 渐进式加载与多会话并发陆续进入代码，工作开始有了自己的秩序。',
    julyEvidence: 'v1.6.0 源码快照 → Skills 改造 → 多会话并发',
    augustTitle: '工作台，走出一个窗口。',
    augustBody:
      '8 月 13 日，WebUI 远程访问加入项目。浏览器与桌面之间有了新的连接，对话与工具开始适应更多使用方式。',
    augustEvidence: 'WebUI 远程访问与双模式数据同步',
    septemberTitle: '让任务，有自己的生命。',
    septemberBody:
      '9 月，Agent 执行逐步迁入主进程宿主，消息列表加入虚拟滚动，定时任务有了提案与确认流程。3.0 的重心，开始从一个聊天窗口转向持续工作的 Agent。',
    septemberEvidence: '消息虚拟化 → AgentHost → v3.0.0',
    octoberTitle: '工具更近，入口更轻。',
    octoberBody:
      '10 月初加入编程 / 通用双模式与 Git 集成；随后 IM 通道扩展，Joule 在 10 月 23 日接入账号、订阅和额度，让连接模型多了一条直接的路。',
    octoberEvidence: '编程 / 通用模式 → Git → Joule 账号闭环',
    novemberTitle: '4.0，把体验认真做好。',
    novemberBody:
      'VIBE 的布局与切换重新打磨，消息撤回补齐草稿恢复和执行保护，未配置模型时优先引导 Joule。一路加上来的能力，开始成为更顺手的日常。',
    novemberEvidence: 'VIBE 与撤回可靠性 → 4.0.0 版本准备',
    remoteTitle: '4.1.1，工作不止在桌面。',
    remoteBody: '早期的局域网 WebUI，走到了固定的公网入口。浏览器先配对、桌面再批准，接入完整工作台，切换全部会话、目录与设置。4.1.1 继续修复大量历史记录下的启动和断线恢复，让远程连接更稳。',
    remoteEvidence: '完整工作台 → 持久设备配对与共享设置 → 批量历史恢复',
    release: '阅读 4.1.1 发布记录',
    closing: '还在继续。下一次改进，也会留下记录。',
    log: '浏览完整 Git 历史',
  },
  en: {
    eyebrow: '04 / BUILT, ONE STEP AT A TIME',
    title: 'An idea became\na place to work.',
    intro:
      'Started in May 2026. The idea came first; the code followed. From the earliest source snapshot to public remote access in 4.1.1, the workspace grew one traceable change at a time.',
    origin:
      'The founder supplied the May start date. Other milestones come from public Git history.',
    source: 'View commit',
    expand: 'Explore this chapter’s record',
    mayTitle: 'Give the idea a name.',
    mayBody:
      'ClerkBox began in May: the starting point for an idea about AI tools on the desktop.',
    mayEvidence: 'Founder’s account · May 2026',
    julyTitle: 'Put the idea into code.',
    julyBody:
      'On July 22, the repository recorded its initial v1.6.0 source snapshot. Progressive Skills loading and concurrent conversations followed later that month, giving the work more structure.',
    julyEvidence:
      'v1.6.0 snapshot → Skills redesign → concurrent conversations',
    augustTitle: 'Beyond a single window.',
    augustBody:
      'WebUI remote access arrived on August 13. A connection between browser and desktop opened up new ways to use conversations and tools.',
    augustEvidence: 'WebUI remote access and synchronization between modes',
    septemberTitle: 'Give tasks a life of their own.',
    septemberBody:
      'In September, Agent execution moved toward a host in the main process. Message lists gained virtualization, and scheduled tasks gained proposals and confirmation. Version 3.0 shifted the focus toward an Agent that keeps working.',
    septemberEvidence: 'Virtualized messages → AgentHost → v3.0.0',
    octoberTitle: 'Tools closer. A simpler start.',
    octoberBody:
      'Coding and general modes arrived with Git integration in early October. IM channels expanded, and Joule connected accounts, subscriptions and quotas on October 23, adding a direct route to models.',
    octoberEvidence: 'Coding / general modes → Git → Joule accounts',
    novemberTitle: '4.0. Make the experience count.',
    novemberBody:
      'VIBE gained a refined layout and safer switching. Message recall gained draft restoration and execution guards. Joule became the first setup suggestion. Growing capabilities became a more comfortable daily workspace.',
    novemberEvidence: 'Reliable VIBE and recall → preparation for 4.0.0',
    remoteTitle: '4.1.1. Your work goes further.',
    remoteBody: 'The early LAN WebUI grew into a fixed public address. Pair in the browser, approve on the desktop, then use the full workbench with all conversations, folders and settings. Version 4.1.1 improves startup and reconnection with large conversation histories.',
    remoteEvidence: 'Full workbench → persistent device pairing and shared settings → batched history recovery',
    release: 'Read the 4.1.1 release notes',
    closing:
      'Still being built. The next improvement will leave a record, too.',
    log: 'Browse the full Git history',
  },
} as const
