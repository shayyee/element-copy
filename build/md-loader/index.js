/**
 * 提取template 与 script 的内容，把 Markdown 转化成 Vue 组件
 */
const md = require('./config');
const { stripScript, stripTemplate, genInlineComponentText } = require('./util');
module.exports = function (source) {
    const content = md.render(source);
    // 注释Tag 开始结束的名称和长度
    const startTag = '<!--meui-demo:';
    const startTagLen = startTag.length;
    const endTag = ':meui-demo-->';
    const endTagLen = endTag.length;
    // 组件字符串
    let componentString = '';
    // demo 的 id
    let id = 0;
    // 输出的内容
    let output = [];
    // 字符串开始位置
    let start = 0;
    // 获取注释开始Tag内容起始位置
    let commentStart = content.indexOf(startTag);
    //从注释开始Tag之后的位置 获取注释结束Tag位置
    let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
    // 循环获取注释内容
    while (commentStart !== -1 && commentEnd !== -1) {
        // 剔除注释开始Tag
        output.push(content.slice(start, commentStart));
        // 获取注释内容
        const commentContent = content.slice(commentStart + startTagLen, commentEnd);
        // 获取template的html信息
        const html = stripTemplate(commentContent);
        // 获取script信息
        const script = stripScript(commentContent);
        // 转成一个内联组件
        let demoComponentContent = genInlineComponentText(html, script);
        // 内联组件名称
        const demoComponentName = `meui-demo${id}`;
        // 使用slot插槽 运行组件
        output.push(`<template slot="source"><${demoComponentName} /></template>`);
        // 页面组件注册   组件名称:组件内容
        componentString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`;

        // 重新计算下一次的位置
        id++;
        start = commentEnd + endTagLen;
        commentStart = content.indexOf(startTag, start);
        commentEnd = content.indexOf(endTag, commentStart + startTagLen);
    }

    // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
    let pageScript = '';
    if (componentString) {
        pageScript = `<script>
      export default {
        name: 'component-doc',
        components: {
          ${componentString}
        }
      }
    </script>`;
    } else if (content.indexOf('<script>') === 0) {
        // 硬编码，有待改善
        start = content.indexOf('</script>') + '</script>'.length;
        pageScript = content.slice(0, start);
    }

    output.push(content.slice(start));
    return `
    <template>
      <section class="content me-doc">
        ${output.join('')}
      </section>
    </template>
    ${pageScript}
  `;
}
