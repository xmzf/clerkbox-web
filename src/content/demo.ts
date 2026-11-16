import { desktopCopy } from './desktop'

export const demoCopy = {
  zh: {
    desktop: desktopCopy.zh,
    interactive: '亲手试试这个工作区',
    scenarios: '产品演示场景',
    work: '工作台',
    vibe: 'VIBE',
    recall: '消息撤回',
    sessionTitle: 'ClerkBox 官网更新',
    researchTitle: '整理项目资料',
    prompt: '请先梳理官网改版计划，确认后再开始实现。',
    researchPrompt:
      '梳理这个项目的资料，给我一份结构清楚、可以继续执行的计划。',
    response: '我会先核对现有页面与产品能力，再整理改版步骤。',
    researchResponse:
      '我会先阅读已有资料，把目标、约束和待确认事项整理在一起，再拆解为可以逐步执行的计划。',
    model: 'Claude Sonnet 5.5',
    stepOne: '统一页面层级与视觉节奏',
    stepTwo: '同步真实产品界面与 4.0 功能',
    stepThree: '检查中英文、移动端与下载入口',
    desktopOnly: '此入口需要桌面应用；网页仅演示会话、草稿和 VIBE 切换。',
    copyUnavailable: '浏览器未授予剪贴板权限。可以直接选中消息复制。',
    resetNotice: '示例会话已重置。',
    vibeBackgroundNote:
      '使用应用默认背景。自选图片、文件夹和系统玻璃请在桌面版中设置。',
    localSent: '消息已添加到网页示例；不会发送给模型，也不会修改文件。',
    fileRestored: '示例文件已恢复到修改前',
    workCaption: '从一个想法，到看得见的工作结果。',
    vibeCaption: '换一种氛围，继续同一个工作区。',
    recallCaption: '先看清范围，再决定从哪里重新开始。',
    disclaimer: '可交互的界面示例。使用样例数据，不连接模型或操作你的文件。',
    recalledNotice: '已恢复示例草稿，文件保持原样。',
    recalledFilesNotice: '已恢复示例草稿与修改前的示例文件。',
    reset: '重新体验',
  },
  en: {
    desktop: desktopCopy.en,
    interactive: 'Take the workspace for a spin',
    scenarios: 'Product demo scenarios',
    work: 'Workspace',
    vibe: 'VIBE',
    recall: 'Rewind',
    sessionTitle: 'ClerkBox website update',
    researchTitle: 'Organize project research',
    prompt:
      'Outline the website redesign first. Wait for confirmation before implementing it.',
    researchPrompt:
      'Organize this project’s research into a clear plan I can act on.',
    response:
      'I will check the current pages and product capabilities, then organize the redesign steps.',
    researchResponse:
      'I will read the existing material, bring the goals and constraints together, then break the work into practical next steps.',
    model: 'Claude Sonnet 5.5',
    stepOne: 'Unify page hierarchy and visual rhythm',
    stepTwo: 'Sync the real product UI and 4.0 features',
    stepThree: 'Check both languages, mobile layouts, and downloads',
    desktopOnly:
      'Open the desktop app to use this feature. This webpage demonstrates chats, drafts, and VIBE switching.',
    copyUnavailable:
      'Clipboard access was denied. You can select and copy the message directly.',
    resetNotice: 'The sample chat has been reset.',
    vibeBackgroundNote:
      'Using the app’s default background. Set custom images, folders, or system glass in the desktop app.',
    localSent:
      'Added to this webpage example. No model request or file changes were made.',
    fileRestored: 'Sample file restored to its earlier content',
    workCaption: 'From an idea to work you can see.',
    vibeCaption: 'A different atmosphere. The same workspace.',
    recallCaption: 'See the scope before choosing where to start again.',
    disclaimer:
      'Interactive interface example with sample data. No model connection or access to your files.',
    recalledNotice: 'Sample draft restored. Files kept as they are.',
    recalledFilesNotice: 'Sample draft and the earlier sample file restored.',
    reset: 'Try it again',
  },
} as const
