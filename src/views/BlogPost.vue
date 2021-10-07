<script>
// <template>
//   <div class="about">
//     <h1>有了render（）  这个还会展示吗？</h1>
//   </div>
// </template>  这个优先级高于render（）
import { h } from 'vue'
export default {
  name: 'BlogPost',
  auth: true,
  render () {
    if (this.$.type.auth) {
      //       const ButtonCounter = resolveComponent('ButtonCounter')
    //   return h(ButtonCounter)
      return h('div', [
        h('header', this.$slots.header()),
        h('main', this.$slots.default()),
        h('footer', this.$slots.footer())
      ])
    } else {
      return h('div', null, null)
    }
  }
}
</script>
