(this["webpackJsonplms-react-app"]=this["webpackJsonplms-react-app"]||[]).push([[58],{429:function(e,t,a){"use strict";a.r(t);var n=a(67),o=a.n(n),r=a(68),i=a(17),s=a(9),l=a(10),c=a(12),u=a(11),p=a(0),d=a.n(p),m=a(71),h=a(73),f=a(72),g=a(74),E=a(244),b=a(21),v=a(63),C=a.n(v),y=a(23),k=a(64),x=a(16),_=a(22),w=a(231),N=a.n(w),S=a(98),O=a.n(S),V=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).handleConnectionChange=function(e,t){e.preventDefault();var a=Object(i.a)(n.state.options);a[e.target.dataset.id][t]=e.target.value,n.setState({options:a})},n.appenedNewOptions=function(e){e.preventDefault();var t=n.state.options;n.setState({options:[].concat(Object(i.a)(t),[{question:"",op1:"",op2:"",op3:"",op4:"",correct:"op1",correct_option:{op1:!0,op2:!1,op3:!1,op4:!1}}])})},n.deleteFromOptions=function(e,t){e.preventDefault();var a=n.state.options.splice(t,1);n.setState({optionss:a})},n.componentDidMount=Object(r.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n.props&&n.props.user&&n.props.user.id&&n.props.match&&n.props.match.params&&n.props.match.params.id)){e.next=3;break}return e.next=3,n.setState({class_id:n.props.match.params.id});case 3:case"end":return e.stop()}}),e)}))),n.createNotification=function(e,t){switch(e){case"info":k.NotificationManager.info(t,"",5e3);break;case"success":k.NotificationManager.success(t,"",5e3);break;case"warning":k.NotificationManager.warning(t,"",5e3);break;case"error":k.NotificationManager.error(t,"",5e3)}},n.onDropPhoto=function(e){n.setState({files:e,isValid:{value:!0,text:""}})},n.state={isLoading:!1,deletedRowId:null,showModal:!1,handleCloseModal:!1,name:"",description:"",class_id:"",total_marks:0,isValid:{value:!1,text:""},data:[],options:[{question:"",op1:"",op2:"",op3:"",op4:"",correct:"op1",correct_option:{op1:!0,op2:!1,op3:!1,op4:!1}}],submission_date:""},n}return Object(l.a)(a,[{key:"handleTextChange",value:function(e){this.setState({[e.name]:e.value})}},{key:"toggleEnabled",value:function(e,t,a){var n=Object(i.a)(this.state.options);"op1"===a&&(n[e.target.dataset.id][t].op1=!0,n[e.target.dataset.id][t].op2=!1,n[e.target.dataset.id][t].op3=!1,n[e.target.dataset.id][t].op4=!1,n[e.target.dataset.id].correct="op1"),"op2"===a&&(n[e.target.dataset.id][t].op1=!1,n[e.target.dataset.id][t].op2=!0,n[e.target.dataset.id][t].op3=!1,n[e.target.dataset.id][t].op4=!1,n[e.target.dataset.id].correct="op2"),"op3"===a&&(n[e.target.dataset.id][t].op1=!1,n[e.target.dataset.id][t].op2=!1,n[e.target.dataset.id][t].op3=!0,n[e.target.dataset.id][t].op4=!1,n[e.target.dataset.id].correct="op3"),"op4"===a&&(n[e.target.dataset.id][t].op1=!1,n[e.target.dataset.id][t].op2=!1,n[e.target.dataset.id][t].op3=!1,n[e.target.dataset.id][t].op4=!0,n[e.target.dataset.id].correct="op4"),this.setState({options:n})}},{key:"handleChange",value:function(e,t){this.setState({[t]:e._d.toISOString()})}},{key:"handleSubmit",value:function(){var e=Object(r.a)(o.a.mark((function e(t){var a,n,r,i,s,l,c=this;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),a=this.state,n=a.name,r=a.class_id,i=a.total_marks,s=a.submission_date,l=a.options,n||!(n.trim().length<=0)){e.next=5;break}return this.setState({isValid:{value:!0,text:"Please enter valid Quiz Title",name:"name"}}),e.abrupt("return");case 5:if(!(i<=0)){e.next=8;break}return this.setState({isValid:{value:!0,text:"Please enter valid Quiz Total Marks",name:"total_marks"}}),e.abrupt("return");case 8:if(s||!(s.trim().length<=0)){e.next=11;break}return this.setState({isValid:{value:!0,text:"Please enter valid Quiz Submission Date",name:"submission_date"}}),e.abrupt("return");case 11:C.a.post("".concat(y.a.prod,"/api/class/quiz/create"),{title:n.trim(),total_marks:i,class_id:r,submission_date:s.trim(),options:JSON.stringify(l)}).then((function(e){c.props.history.push("/faculty/class/list")})).catch((function(e){console.log("Error: ",e.response),e.response&&e.response.status&&(400===e.response.status||500===e.response.status)?500===e.response.status&&"SequelizeUniqueConstraintError"===e.response.data.error.name?c.setState({filesProgress:0,isValid:{value:!0,text:"Quiz with this title already exist",name:"server_error"}}):c.setState({filesProgress:0,isValid:{value:!0,text:e.response.data.msg,name:"server_error"}}):c.setState({filesProgress:0,isValid:{value:!0,text:"Unknown Error",name:"server_error"}})}));case 12:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=O()().subtract(1,"day"),a=this.state.options;return d.a.createElement(b.a,null,this.state.isLoading&&d.a.createElement(x.a,null),d.a.createElement(m.a,null,d.a.createElement(k.NotificationContainer,null),d.a.createElement(h.a,null,d.a.createElement(f.a,null,d.a.createElement(f.a.Header,null,d.a.createElement(f.a.Title,{as:"h5"},"Add Assignment")),d.a.createElement(f.a.Body,null,d.a.createElement(m.a,null,d.a.createElement(g.a,{className:"col-md-12",onSubmit:function(t){return e.handleSubmit(t)}},d.a.createElement("fieldset",{disabled:this.state.isLoading,className:this.state.isLoading?"opacity-5":""},d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2}},d.a.createElement(g.a.Group,{className:"mb-2",controlId:"formBasicEmail"},d.a.createElement(g.a.Label,null,"Quiz Title"),d.a.createElement(g.a.Control,{type:"text",name:"name",placeholder:"Quiz Title",value:this.state.name,className:this.state.isValid.value&&"name"===this.state.isValid.name?"in-valid-input":"",onFocus:function(){return e.setState({isValid:{value:!1,text:""}})},onChange:function(t){return e.handleTextChange(t.target)}})))),d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2}},d.a.createElement(g.a.Group,{className:"mb-2",controlId:"formBasicEmail"},d.a.createElement(g.a.Label,null,"Quiz Total Marks"),d.a.createElement(g.a.Control,{type:"number",name:"total_marks",min:0,placeholder:"Assignment Total Marks",value:this.state.total_marks,className:this.state.isValid.value&&"total_marks"===this.state.isValid.name?"in-valid-input":"",onFocus:function(){return e.setState({isValid:{value:!1,text:""}})},onChange:function(t){return e.handleTextChange(t.target)}})))),d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2}},d.a.createElement(g.a.Group,{className:"mb-2",controlId:"exampleForm.ControlInput1"},d.a.createElement(g.a.Label,null,"Submission Date"),d.a.createElement(N.a,{isValidDate:function(e){return e.isAfter(t)},inputProps:{readOnly:!0},className:this.state.isValid.value&&"submission_date"===this.state.isValid.name?"in-valid-input":"",onFocus:function(){return e.setState({isValid:{value:!1,text:"",name:""}})},onChange:function(t){return e.handleChange(t,"submission_date")}})))),d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2}},d.a.createElement(E.a,{style:{width:"100%",marginTop:10},onClick:function(t){return e.appenedNewOptions(t)},variant:"outline-primary"},"Add New Question"))),this.state.options.map((function(t,n){var o="question-".concat(n),r="op1-".concat(n),i="op2-".concat(n),s="op3-".concat(n),l="op4-".concat(n);"correct_option-".concat(n);return d.a.createElement("div",{key:n,style:{padding:10}},d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2},style:{border:"2px solid #007bff",padding:10,marginTop:5}},d.a.createElement("button",{style:{float:"right"},onClick:function(t){return e.deleteFromOptions(t,n)}},d.a.createElement("i",{className:"fa fa-times"})),d.a.createElement(m.a,null,d.a.createElement(h.a,{md:12},d.a.createElement(g.a.Group,{className:"mb-2"},d.a.createElement(g.a.Label,null,"Question"),d.a.createElement(g.a.Control,{type:"text",name:o,"data-id":n,id:o,value:a[n].question,onKeyPress:function(e){"Enter"===e.key&&e.preventDefault()},onChange:function(t){return e.handleConnectionChange(t,"question")}})))),d.a.createElement(m.a,null,d.a.createElement(h.a,{md:6},d.a.createElement(g.a.Group,{className:"mb-2"},d.a.createElement(g.a.Label,null,"Option 1"),d.a.createElement(g.a.Control,{type:"text",name:r,"data-id":n,id:r,value:a[n].op1,onKeyPress:function(e){"Enter"===e.key&&e.preventDefault()},onChange:function(t){return e.handleConnectionChange(t,"op1")}}))),d.a.createElement(h.a,{md:6},d.a.createElement(g.a.Group,{className:"mb-2"},d.a.createElement(g.a.Label,null,"Option 2"),d.a.createElement(g.a.Control,{type:"text",name:i,"data-id":n,id:i,value:a[n].op2,onKeyPress:function(e){"Enter"===e.key&&e.preventDefault()},onChange:function(t){return e.handleConnectionChange(t,"op2")}}))),d.a.createElement(h.a,{md:6},d.a.createElement(g.a.Group,{className:"mb-2"},d.a.createElement(g.a.Label,null,"Option 3"),d.a.createElement(g.a.Control,{type:"text",name:s,"data-id":n,id:s,value:a[n].op3,onKeyPress:function(e){"Enter"===e.key&&e.preventDefault()},onChange:function(t){return e.handleConnectionChange(t,"op3")}}))),d.a.createElement(h.a,{md:6},d.a.createElement(g.a.Group,{className:"mb-2"},d.a.createElement(g.a.Label,null,"Option 4"),d.a.createElement(g.a.Control,{type:"text",name:l,"data-id":n,id:l,value:a[n].op4,onKeyPress:function(e){"Enter"===e.key&&e.preventDefault()},onChange:function(t){return e.handleConnectionChange(t,"op4")}})))),d.a.createElement(m.a,null,d.a.createElement(h.a,{md:12},d.a.createElement(g.a.Group,{className:"mb-2"},d.a.createElement(g.a.Label,null,"Correct Option"),d.a.createElement("br",null),d.a.createElement(g.a.Check,{inline:!0,label:"option 1","data-id":n,onChange:function(t){return e.toggleEnabled(t,"correct_option","op1")},checked:a[n].correct_option.op1,type:"radio",id:"inline-radio-1-".concat(n)}),d.a.createElement(g.a.Check,{inline:!0,label:"option 2","data-id":n,onChange:function(t){return e.toggleEnabled(t,"correct_option","op2")},checked:a[n].correct_option.op2,type:"radio",id:"inline-radio-2-".concat(n)}),d.a.createElement(g.a.Check,{inline:!0,label:"option 3","data-id":n,onChange:function(t){return e.toggleEnabled(t,"correct_option","op3")},checked:a[n].correct_option.op3,type:"radio",id:"inline-radio-3-".concat(n)}),d.a.createElement(g.a.Check,{inline:!0,label:"option 4","data-id":n,onChange:function(t){return e.toggleEnabled(t,"correct_option","op4")},checked:a[n].correct_option.op4,type:"radio",id:"inline-radio-4-".concat(n)})))))))})),this.state.options.length?d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2},style:{textAlign:"center",marginTop:10}},d.a.createElement(E.a,{style:{marginTop:10,borderTop:"0px",borderLeft:"0px",borderRight:"0px"},onClick:function(t){return e.appenedNewOptions(t)},variant:"outline-primary"},"+ Add New Question"))):null,d.a.createElement(g.a.Row,null,d.a.createElement(h.a,{md:{span:8,offset:2}},d.a.createElement("div",null,d.a.createElement(E.a,{type:"submit",style:{marginTop:"1.8rem",width:"100%"},variant:"primary"},"Submit"),this.state.isValid.value?d.a.createElement(g.a.Text,{style:{color:"red"}},this.state.isValid.text):"")))))))))))}}]),a}(d.a.Component);t.default=Object(_.b)((function(e){return{user:e.userDetails.user}}),null)(V)}}]);
//# sourceMappingURL=58.9df76410.chunk.js.map