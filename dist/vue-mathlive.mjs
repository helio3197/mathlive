/** MathLive 0.94.5 */
var s={name:"mathlive-mathfield",template:'<math-field :id="id"><slot></slot></math-field>',props:{id:{type:String,default:""},value:{type:String,default:""},options:{type:Object,default:()=>({})}},install(t,e){t!=null&&t.version&&+t.version.split(".")[0]>=3?t.config.globalProperties.$mathlive=e:Object.defineProperty(t.prototype,"$mathlive",{value:e}),t.component("mathlive-mathfield",this)},watch:{value(t,e){let i=this.$el.getValue();t!==i&&this.$el.setValue(t,{suppressChangeNotifications:!0})},options:{deep:!0,handler(t,e){JSON.stringify(t)!==JSON.stringify(e)&&this.$el.setOptions(t)}}},mounted(){this.$nextTick(()=>this.$el.setOptions(this.options))},methods:{executeCommand(t){this.$el.executeCommand(t)},hasFocus(){return this.$el.hasFocus()},focus(){this.$el.focus()},blur(){this.$el.blur()},getValue(t){return this.$el.getValue(t)},insert(t,e){this.$el.insert(t,e)},select(){this.$el.select()}}};export{s as default};
