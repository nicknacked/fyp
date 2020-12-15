(this["webpackJsonplms-react-app"]=this["webpackJsonplms-react-app"]||[]).push([[31],{431:function(e,a,t){"use strict";t.r(a);var r=t(67),s=t.n(r),l=t(68),i=t(9),n=t(10),o=t(12),c=t(11),d=t(0),u=t.n(d),m=t(71),f=t(457),b=t(73),v=t(74),p=t(244),h=t(72),E=t(76),k=t(21),x=t(63),y=t.n(x),O=t(23),N=t(64),j=t(16),w=t(22),M=function(e){Object(o.a)(t,e);var a=Object(c.a)(t);function t(e){var r;return Object(i.a)(this,t),(r=a.call(this,e)).componentDidMount=Object(l.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(r.props&&r.props.user&&r.props.user.id&&r.props.match&&r.props.match.params&&r.props.match.params.id&&r.props.match.params.assign_id)){e.next=4;break}return e.next=3,r.setState({class_id:r.props.match.params.id,assign_id:r.props.match.params.assign_id});case 3:r.getSubmissionList();case 4:case"end":return e.stop()}}),e)}))),r.createNotification=function(e,a){switch(e){case"info":N.NotificationManager.info(a,"",5e3);break;case"success":N.NotificationManager.success(a,"",5e3);break;case"warning":N.NotificationManager.warning(a,"",5e3);break;case"error":N.NotificationManager.error(a,"",5e3)}},r.state={isLoading:!1,marksRowId:null,elem:{},showModalMarks:!1,handleCloseModal:!1,isValid:{value:!1,text:""},data:[],class_id:"",title:"",quiz:{},obtained_marks:0},r}return Object(n.a)(t,[{key:"openMarksModal",value:function(e){this.setState({showModalMarks:!0,marksRowId:e.id,elem:e})}},{key:"closeMarksModal",value:function(){this.setState({showModalMarks:!1})}},{key:"handleTextChange",value:function(e){this.setState({[e.name]:e.value})}},{key:"handleMarks",value:function(){var e=this,a=this.state,t=a.obtained_marks,r=a.quiz,s=a.marksRowId;t<0||t>r.total_marks?this.setState({isValid:{value:!0,text:"Please enter valid Marks",name:"obtained_marks"}}):(this.setState({isLoading:!0,showModalMarks:!1}),y.a.post("".concat(O.a.prod,"/api/class/quiz/submission/update"),{obtained_marks:t,submission_id:s}).then((function(a){e.setState({showModalMarks:!1}),e.getSubmissionList()})).catch((function(a){console.log("Error: ",a.response),a.response&&a.response.status&&(400===a.response.status||500===a.response.status)?500===a.response.status?e.setState({isValid:{value:!0,text:"Internal Server Error",name:"server_error"},showModalMarks:!0}):e.setState({isValid:{value:!0,text:a.response.data.msg,name:"server_error"},showModalMarks:!0}):e.setState({isValid:{value:!0,text:"Unknown Error",name:"server_error"},showModalMarks:!0})})))}},{key:"getSubmissionList",value:function(){var e=this;this.setState({isLoading:!0}),y.a.get("".concat(O.a.prod,"/api/class/quiz/").concat(this.state.assign_id,"/submission/list")).then((function(a){var t=a.data.data;e.setState({data:t,quiz:t.length?t[0].quize:{},isLoading:!1})})).catch((function(a){e.setState({isLoading:!1}),console.log("Error: getting data from db ",a.response),e.createNotification("error","Error while Getting data from db")}))}},{key:"cancelMarks",value:function(){this.setState({showModalMarks:!1,isValid:{value:!1}})}},{key:"render",value:function(){var e=this;return u.a.createElement(k.a,null,this.state.isLoading&&u.a.createElement(j.a,null),u.a.createElement(m.a,null,this.state.showModalMarks&&u.a.createElement(f.a,{show:this.state.showModalMarks,onHide:function(){return e.setState({showModalMarks:!1,isValid:{value:!1}})}},u.a.createElement(f.a.Header,{closeButton:!0},u.a.createElement(f.a.Title,null,"Confirm Obtained Marks")),u.a.createElement(f.a.Body,null,u.a.createElement(m.a,null,u.a.createElement(b.a,{xs:12},u.a.createElement(v.a,null,u.a.createElement(v.a.Row,null,u.a.createElement(b.a,null,u.a.createElement(v.a.Group,{className:"mb-2",controlId:"formBasicEmail"},u.a.createElement(v.a.Label,null,"Obtained Marks"),u.a.createElement(v.a.Control,{type:"number",name:"obtained_marks",min:0,max:this.state.quiz.total_marks?this.state.quiz.total_marks:10,placeholder:"Obtained Marks",value:this.state.obtained_marks,className:this.state.isValid.value&&"obtained_marks"===this.state.isValid.name?"in-valid-input":"",onFocus:function(){return e.setState({isValid:{value:!1,text:""}})},onChange:function(a){return e.handleTextChange(a.target)}})))),u.a.createElement(v.a.Row,null,this.state.isValid.value?u.a.createElement(v.a.Text,{style:{color:"red"}},this.state.isValid.text):""))))),u.a.createElement(f.a.Footer,null,u.a.createElement(p.a,{variant:"primary",onClick:function(){return e.handleMarks()}},"Save"),u.a.createElement(p.a,{variant:"secondary",onClick:function(){return e.cancelMarks()}},"Cancel"))),u.a.createElement(N.NotificationContainer,null),u.a.createElement(b.a,null,u.a.createElement(h.a,null,u.a.createElement(h.a.Header,null,u.a.createElement(h.a.Title,{as:"h5"},"Submitted Quizes ",u.a.createElement("b",null,this.state.quiz.title?this.state.quiz.title:null))),u.a.createElement(h.a.Body,null,u.a.createElement(m.a,null,u.a.createElement(b.a,null,u.a.createElement(E.a,{striped:!0,bordered:!0,hover:!0,responsive:!0},u.a.createElement("thead",null,u.a.createElement("tr",null,u.a.createElement("th",null,"First Name"),u.a.createElement("th",null,"Last Name"),u.a.createElement("th",null,"U ID"),u.a.createElement("th",null,"Total Marks"),u.a.createElement("th",null,"Obtained Marks"),u.a.createElement("th",null,"Submission"))),u.a.createElement("tbody",null,this.state.data.map((function(a,t){return u.a.createElement("tr",{key:t},u.a.createElement("td",null,a.user.first_name),u.a.createElement("td",null,a.user.last_name),u.a.createElement("td",null,a.user.u_id),u.a.createElement("td",null,a.quize.total_marks),u.a.createElement("td",null,a.obtained_marks),u.a.createElement("td",null,u.a.createElement(p.a,{style:{width:"100%"},onClick:function(t){return e.openMarksModal(a)},variant:"outline-primary"},"Update Marks")))})))))))))))}}]),t}(u.a.Component);a.default=Object(w.b)((function(e){return{user:e.userDetails.user}}),null)(M)},58:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default=function(){for(var e=arguments.length,a=Array(e),t=0;t<e;t++)a[t]=arguments[t];function r(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];var s=null;return a.forEach((function(e){if(null==s){var a=e.apply(void 0,t);null!=a&&(s=a)}})),s}return(0,l.default)(r)};var r,s=t(66),l=(r=s)&&r.__esModule?r:{default:r};e.exports=a.default},66:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default=function(e){function a(a,t,r,s,l,i){var n=s||"<<anonymous>>",o=i||r;if(null==t[r])return a?new Error("Required "+l+" `"+o+"` was not specified in `"+n+"`."):null;for(var c=arguments.length,d=Array(c>6?c-6:0),u=6;u<c;u++)d[u-6]=arguments[u];return e.apply(void 0,[t,r,n,l,o].concat(d))}var t=a.bind(null,!1);return t.isRequired=a.bind(null,!0),t},e.exports=a.default},74:function(e,a,t){"use strict";var r=t(4),s=t(7),l=t(56),i=t.n(l),n=t(0),o=t.n(n),c=(t(58),t(1)),d=t.n(c),u={type:d.a.string,tooltip:d.a.bool,as:d.a.elementType},m=o.a.forwardRef((function(e,a){var t=e.as,l=void 0===t?"div":t,n=e.className,c=e.type,d=void 0===c?"valid":c,u=e.tooltip,m=void 0!==u&&u,f=Object(s.a)(e,["as","className","type","tooltip"]);return o.a.createElement(l,Object(r.a)({},f,{ref:a,className:i()(n,d+"-"+(m?"tooltip":"feedback"))}))}));m.displayName="Feedback",m.propTypes=u;var f=m,b=o.a.createContext({controlId:void 0}),v=t(57),p=o.a.forwardRef((function(e,a){var t=e.id,l=e.bsPrefix,c=e.bsCustomPrefix,d=e.className,u=e.type,m=void 0===u?"checkbox":u,f=e.isValid,p=void 0!==f&&f,h=e.isInvalid,E=void 0!==h&&h,k=e.isStatic,x=e.as,y=void 0===x?"input":x,O=Object(s.a)(e,["id","bsPrefix","bsCustomPrefix","className","type","isValid","isInvalid","isStatic","as"]),N=Object(n.useContext)(b),j=N.controlId,w=N.custom?[c,"custom-control-input"]:[l,"form-check-input"],M=w[0],g=w[1];return l=Object(v.a)(M,g),o.a.createElement(y,Object(r.a)({},O,{ref:a,type:m,id:t||j,className:i()(d,l,p&&"is-valid",E&&"is-invalid",k&&"position-static")}))}));p.displayName="FormCheckInput";var h=p,E=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.bsCustomPrefix,c=e.className,d=e.htmlFor,u=Object(s.a)(e,["bsPrefix","bsCustomPrefix","className","htmlFor"]),m=Object(n.useContext)(b),f=m.controlId,p=m.custom?[l,"custom-control-label"]:[t,"form-check-label"],h=p[0],E=p[1];return t=Object(v.a)(h,E),o.a.createElement("label",Object(r.a)({},u,{ref:a,htmlFor:d||f,className:i()(c,t)}))}));E.displayName="FormCheckLabel";var k=E,x=o.a.forwardRef((function(e,a){var t=e.id,l=e.bsPrefix,c=e.bsCustomPrefix,d=e.inline,u=void 0!==d&&d,m=e.disabled,p=void 0!==m&&m,E=e.isValid,x=void 0!==E&&E,y=e.isInvalid,O=void 0!==y&&y,N=e.feedbackTooltip,j=void 0!==N&&N,w=e.feedback,M=e.className,g=e.style,P=e.title,C=void 0===P?"":P,I=e.type,F=void 0===I?"checkbox":I,_=e.label,S=e.children,V=e.custom,R=e.as,z=void 0===R?"input":R,L=Object(s.a)(e,["id","bsPrefix","bsCustomPrefix","inline","disabled","isValid","isInvalid","feedbackTooltip","feedback","className","style","title","type","label","children","custom","as"]),T="switch"===F||V,q=T?[c,"custom-control"]:[l,"form-check"],A=q[0],B=q[1];l=Object(v.a)(A,B);var G=Object(n.useContext)(b).controlId,D=Object(n.useMemo)((function(){return{controlId:t||G,custom:T}}),[G,T,t]),H=null!=_&&!1!==_&&!S,U=o.a.createElement(h,Object(r.a)({},L,{type:"switch"===F?"checkbox":F,ref:a,isValid:x,isInvalid:O,isStatic:!H,disabled:p,as:z}));return o.a.createElement(b.Provider,{value:D},o.a.createElement("div",{style:g,className:i()(M,l,T&&"custom-"+F,u&&l+"-inline")},S||o.a.createElement(o.a.Fragment,null,U,H&&o.a.createElement(k,{title:C},_),(x||O)&&o.a.createElement(f,{type:x?"valid":"invalid",tooltip:j},w))))}));x.displayName="FormCheck",x.Input=h,x.Label=k;var y=x,O=o.a.forwardRef((function(e,a){var t=e.id,l=e.bsPrefix,c=e.bsCustomPrefix,d=e.className,u=e.isValid,m=e.isInvalid,f=e.lang,p=e.as,h=void 0===p?"input":p,E=Object(s.a)(e,["id","bsPrefix","bsCustomPrefix","className","isValid","isInvalid","lang","as"]),k=Object(n.useContext)(b),x=k.controlId,y=k.custom?[c,"custom-file-input"]:[l,"form-control-file"],O=y[0],N=y[1];return l=Object(v.a)(O,N),o.a.createElement(h,Object(r.a)({},E,{ref:a,id:t||x,type:"file",lang:f,className:i()(d,l,u&&"is-valid",m&&"is-invalid")}))}));O.displayName="FormFileInput";var N=O,j=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.bsCustomPrefix,c=e.className,d=e.htmlFor,u=Object(s.a)(e,["bsPrefix","bsCustomPrefix","className","htmlFor"]),m=Object(n.useContext)(b),f=m.controlId,p=m.custom?[l,"custom-file-label"]:[t,"form-file-label"],h=p[0],E=p[1];return t=Object(v.a)(h,E),o.a.createElement("label",Object(r.a)({},u,{ref:a,htmlFor:d||f,className:i()(c,t),"data-browse":u["data-browse"]}))}));j.displayName="FormFileLabel";var w=j,M=o.a.forwardRef((function(e,a){var t=e.id,l=e.bsPrefix,c=e.bsCustomPrefix,d=e.disabled,u=void 0!==d&&d,m=e.isValid,p=void 0!==m&&m,h=e.isInvalid,E=void 0!==h&&h,k=e.feedbackTooltip,x=void 0!==k&&k,y=e.feedback,O=e.className,j=e.style,M=e.label,g=e.children,P=e.custom,C=e.lang,I=e["data-browse"],F=e.as,_=void 0===F?"div":F,S=e.inputAs,V=void 0===S?"input":S,R=Object(s.a)(e,["id","bsPrefix","bsCustomPrefix","disabled","isValid","isInvalid","feedbackTooltip","feedback","className","style","label","children","custom","lang","data-browse","as","inputAs"]),z=P?[c,"custom"]:[l,"form-file"],L=z[0],T=z[1];l=Object(v.a)(L,T);var q=Object(n.useContext)(b).controlId,A=Object(n.useMemo)((function(){return{controlId:t||q,custom:P}}),[q,P,t]),B=null!=M&&!1!==M&&!g,G=o.a.createElement(N,Object(r.a)({},R,{ref:a,isValid:p,isInvalid:E,disabled:u,as:V,lang:C}));return o.a.createElement(b.Provider,{value:A},o.a.createElement(_,{style:j,className:i()(O,l,P&&"custom-file")},g||o.a.createElement(o.a.Fragment,null,P?o.a.createElement(o.a.Fragment,null,G,B&&o.a.createElement(w,{"data-browse":I},M)):o.a.createElement(o.a.Fragment,null,B&&o.a.createElement(w,null,M),G),(p||E)&&o.a.createElement(f,{type:p?"valid":"invalid",tooltip:x},y))))}));M.displayName="FormFile",M.Input=N,M.Label=w;var g=M,P=(t(3),o.a.forwardRef((function(e,a){var t,l,c=e.bsPrefix,d=e.bsCustomPrefix,u=e.type,m=e.size,f=e.htmlSize,p=e.id,h=e.className,E=e.isValid,k=void 0!==E&&E,x=e.isInvalid,y=void 0!==x&&x,O=e.plaintext,N=e.readOnly,j=e.custom,w=e.as,M=void 0===w?"input":w,g=Object(s.a)(e,["bsPrefix","bsCustomPrefix","type","size","htmlSize","id","className","isValid","isInvalid","plaintext","readOnly","custom","as"]),P=Object(n.useContext)(b).controlId,C=j?[d,"custom"]:[c,"form-control"],I=C[0],F=C[1];if(c=Object(v.a)(I,F),O)(l={})[c+"-plaintext"]=!0,t=l;else if("file"===u){var _;(_={})[c+"-file"]=!0,t=_}else if("range"===u){var S;(S={})[c+"-range"]=!0,t=S}else if("select"===M&&j){var V;(V={})[c+"-select"]=!0,V[c+"-select-"+m]=m,t=V}else{var R;(R={})[c]=!0,R[c+"-"+m]=m,t=R}return o.a.createElement(M,Object(r.a)({},g,{type:u,size:f,ref:a,readOnly:N,id:p||P,className:i()(h,t,k&&"is-valid",y&&"is-invalid")}))})));P.displayName="FormControl";var C=Object.assign(P,{Feedback:f}),I=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.className,c=e.children,d=e.controlId,u=e.as,m=void 0===u?"div":u,f=Object(s.a)(e,["bsPrefix","className","children","controlId","as"]);t=Object(v.a)(t,"form-group");var p=Object(n.useMemo)((function(){return{controlId:d}}),[d]);return o.a.createElement(b.Provider,{value:p},o.a.createElement(m,Object(r.a)({},f,{ref:a,className:i()(l,t)}),c))}));I.displayName="FormGroup";var F=I,_=t(73),S=o.a.forwardRef((function(e,a){var t=e.as,l=void 0===t?"label":t,c=e.bsPrefix,d=e.column,u=e.srOnly,m=e.className,f=e.htmlFor,p=Object(s.a)(e,["as","bsPrefix","column","srOnly","className","htmlFor"]),h=Object(n.useContext)(b).controlId;c=Object(v.a)(c,"form-label");var E="col-form-label";"string"===typeof d&&(E=E+"-"+d);var k=i()(m,c,u&&"sr-only",d&&E);return f=f||h,d?o.a.createElement(_.a,Object(r.a)({as:"label",className:k,htmlFor:f},p)):o.a.createElement(l,Object(r.a)({ref:a,className:k,htmlFor:f},p))}));S.displayName="FormLabel",S.defaultProps={column:!1,srOnly:!1};var V=S,R=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.className,n=e.as,c=void 0===n?"small":n,d=e.muted,u=Object(s.a)(e,["bsPrefix","className","as","muted"]);return t=Object(v.a)(t,"form-text"),o.a.createElement(c,Object(r.a)({},u,{ref:a,className:i()(l,t,d&&"text-muted")}))}));R.displayName="FormText";var z=R,L=o.a.forwardRef((function(e,a){return o.a.createElement(y,Object(r.a)({},e,{ref:a,type:"switch"}))}));L.displayName="Switch",L.Input=y.Input,L.Label=y.Label;var T=L,q=t(60),A=Object(q.a)("form-row"),B=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.inline,n=e.className,c=e.validated,d=e.as,u=void 0===d?"form":d,m=Object(s.a)(e,["bsPrefix","inline","className","validated","as"]);return t=Object(v.a)(t,"form"),o.a.createElement(u,Object(r.a)({},m,{ref:a,className:i()(n,c&&"was-validated",l&&t+"-inline")}))}));B.displayName="Form",B.defaultProps={inline:!1},B.Row=A,B.Group=F,B.Control=C,B.Check=y,B.File=g,B.Switch=T,B.Label=V,B.Text=z;a.a=B},76:function(e,a,t){"use strict";var r=t(4),s=t(7),l=t(56),i=t.n(l),n=t(0),o=t.n(n),c=t(57),d=o.a.forwardRef((function(e,a){var t=e.bsPrefix,l=e.className,n=e.striped,d=e.bordered,u=e.borderless,m=e.hover,f=e.size,b=e.variant,v=e.responsive,p=Object(s.a)(e,["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"]),h=Object(c.a)(t,"table"),E=i()(l,h,b&&h+"-"+b,f&&h+"-"+f,n&&h+"-striped",d&&h+"-bordered",u&&h+"-borderless",m&&h+"-hover"),k=o.a.createElement("table",Object(r.a)({},p,{className:E,ref:a}));if(v){var x=h+"-responsive";return"string"===typeof v&&(x=x+"-"+v),o.a.createElement("div",{className:x},k)}return k}));a.a=d}}]);
//# sourceMappingURL=31.f10b56ca.chunk.js.map