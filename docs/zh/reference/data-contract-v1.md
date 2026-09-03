# v1 数据契约

本文定义 Web Resume v1 的目标稳定数据契约。相关能力可以在 0.x 阶段实现，但只有发布 v1.0.0 后才成为正式的兼容性保证。

## 稳定输入

- canonical model 是随对应 Web Resume 版本发布的 JSON Resume schema。
- 简历可以使用 YAML 或 JSON 编写；文件语法不会改变数据模型。
- 能准确表达内容时，优先使用标准字段。
- Web Resume 专属展示数据只使用根级 `x-web-resume` 扩展。
- `x-web-resume.version` 独立管理扩展版本，初始值为 `1`。

正式版本会固定兼容的 `@jsonresume/schema` minor 范围。升级到不兼容的 canonical schema，或改变已持久化扩展字段的含义，需要发布 Web Resume major 版本或提供明确迁移路径。

## 兼容性保证

- 合法的 canonical 文档不需要 `x-web-resume` 也能加载。
- 除非用户明确选择 Portable 导出，编辑过程会保留未知的 canonical 字段。
- Web Resume 无损文档通过 `x-web-resume` 保留板块顺序、标题、图标、条目展示信息、自定义内容和页脚。
- Portable 导出只包含 canonical 字段，并在下载前通过校验。
- 加载、转换、排序和导出都不会静默覆盖原始 URL 或磁盘文件。

## 旧版文档

v0.4 之前的 Web Resume 结构属于兼容输入，不是 v1 推荐的编写格式。应用仍会识别它，并提供显式转换。未来若移除旧格式的直接渲染，必须：

1. 在发布说明中提前声明；
2. 保留或提供经过测试的转换命令；
3. 记录需要人工检查的字段；
4. 只在允许此类兼容性变化的版本边界发布。

## 扩展边界

`x-web-resume` 可以保存板块顺序、标题与图标、条目 Logo 与徽章、联系方式展示、自定义 `other` 内容和页脚等应用专属数据。不能仅仅为了绕开标准字段而复制一份标准内容。

不了解该扩展的消费者可以忽略它。需要最大互操作性时使用 Portable 导出；需要在 Web Resume 中完整往返编辑时，应保留无损 YAML 或 JSON 源文件。
