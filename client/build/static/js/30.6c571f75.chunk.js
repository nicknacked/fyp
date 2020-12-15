(this["webpackJsonplms-react-app"]=this["webpackJsonplms-react-app"]||[]).push([[30],{430:function(e,a,t){"use strict";t.r(a);var r=t(67),n=t.n(r),s=t(68),c=t(9),i=t(10),l=t(12),o=t(11),u=t(0),d=t.n(u),m=t(71),b=t(73),f=t(72),p=t(76),v=t(244),h=t(21),E=t(63),g=t.n(E),j=t(23),O=t(64),N=t(16),x=t(22),y=function(e){Object(l.a)(t,e);var a=Object(o.a)(t);function t(e){var r;return Object(c.a)(this,t),(r=a.call(this,e)).componentDidMount=Object(s.a)(n.a.mark((function e(){return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(r.props&&r.props.user&&r.props.user.id&&r.props.match&&r.props.match.params&&r.props.match.params.id)){e.next=4;break}return e.next=3,r.setState({class_id:r.props.match.params.id});case 3:r.getQuizList();case 4:case"end":return e.stop()}}),e)}))),r.createNotification=function(e,a){switch(e){case"info":O.NotificationManager.info(a,"",5e3);break;case"success":O.NotificationManager.success(a,"",5e3);break;case"warning":O.NotificationManager.warning(a,"",5e3);break;case"error":O.NotificationManager.error(a,"",5e3)}},r.state={isLoading:!1,isValid:{value:!1,text:""},data:[],class_id:""},r}return Object(i.a)(t,[{key:"openSubmissions",value:function(e){this.props.history.push("/faculty/class/".concat(this.state.class_id,"/quiz/").concat(e.id,"/submissions"))}},{key:"getQuizList",value:function(){var e=this;this.setState({isLoading:!0}),g.a.get("".concat(j.a.prod,"/api/class/").concat(this.state.class_id,"/quiz/list")).then((function(a){e.setState({data:a.data.data,isLoading:!1})})).catch((function(a){e.setState({isLoading:!1}),console.log("Error: getting data from db ",a.response),e.createNotification("error","Error while Getting data from db")}))}},{key:"render",value:function(){var e=this;return d.a.createElement(h.a,null,this.state.isLoading&&d.a.createElement(N.a,null),d.a.createElement(m.a,null,d.a.createElement(O.NotificationContainer,null),d.a.createElement(b.a,null,d.a.createElement(f.a,null,d.a.createElement(f.a.Header,null,d.a.createElement(f.a.Title,{as:"h5"},"Quiz List")),d.a.createElement(f.a.Body,null,d.a.createElement(m.a,null,d.a.createElement(b.a,null,d.a.createElement(p.a,{striped:!0,bordered:!0,hover:!0,responsive:!0},d.a.createElement("thead",null,d.a.createElement("tr",null,d.a.createElement("th",null,"#"),d.a.createElement("th",null,"Title"),d.a.createElement("th",null,"Total Marks"),d.a.createElement("th",null,"Submission Date"),d.a.createElement("th",null,"Actions"))),d.a.createElement("tbody",null,this.state.data.map((function(a,t){return d.a.createElement("tr",{key:t},d.a.createElement("td",null,t),d.a.createElement("td",null,a.title),d.a.createElement("td",null,a.total_marks),d.a.createElement("td",null,new Date(a.submission_date).toString()),d.a.createElement("td",null,d.a.createElement(v.a,{onClick:function(t){return e.openSubmissions(a)},variant:"primary"},"Check Submission")))})))))))))))}}]),t}(d.a.Component);a.default=Object(x.b)((function(e){return{user:e.userDetails.user}}),null)(y)},61:function(e,a,t){"use strict";var r=t(4),n=t(0),s=t.n(n),c=t(56),i=t.n(c);a.a=function(e){return s.a.forwardRef((function(a,t){return s.a.createElement("div",Object(r.a)({},a,{ref:t,className:i()(a.className,e)}))}))}},71:function(e,a,t){"use strict";var r=t(4),n=t(7),s=t(56),c=t.n(s),i=t(0),l=t.n(i),o=t(57),u=["xl","lg","md","sm","xs"],d=l.a.forwardRef((function(e,a){var t=e.bsPrefix,s=e.className,i=e.noGutters,d=e.as,m=void 0===d?"div":d,b=Object(n.a)(e,["bsPrefix","className","noGutters","as"]),f=Object(o.a)(t,"row"),p=f+"-cols",v=[];return u.forEach((function(e){var a,t=b[e];delete b[e];var r="xs"!==e?"-"+e:"";null!=(a=null!=t&&"object"===typeof t?t.cols:t)&&v.push(""+p+r+"-"+a)})),l.a.createElement(m,Object(r.a)({ref:a},b,{className:c.a.apply(void 0,[s,f,i&&"no-gutters"].concat(v))}))}));d.displayName="Row",d.defaultProps={noGutters:!1},a.a=d},72:function(e,a,t){"use strict";var r=t(4),n=t(7),s=t(56),c=t.n(s),i=t(0),l=t.n(i),o=t(57),u=t(60),d=t(61),m=l.a.createContext(null);m.displayName="CardContext";var b=m,f=l.a.forwardRef((function(e,a){var t=e.bsPrefix,s=e.className,i=e.variant,u=e.as,d=void 0===u?"img":u,m=Object(n.a)(e,["bsPrefix","className","variant","as"]),b=Object(o.a)(t,"card-img");return l.a.createElement(d,Object(r.a)({ref:a,className:c()(i?b+"-"+i:b,s)},m))}));f.displayName="CardImg",f.defaultProps={variant:null};var p=f,v=Object(d.a)("h5"),h=Object(d.a)("h6"),E=Object(u.a)("card-body"),g=Object(u.a)("card-title",{Component:v}),j=Object(u.a)("card-subtitle",{Component:h}),O=Object(u.a)("card-link",{Component:"a"}),N=Object(u.a)("card-text",{Component:"p"}),x=Object(u.a)("card-header"),y=Object(u.a)("card-footer"),k=Object(u.a)("card-img-overlay"),w=l.a.forwardRef((function(e,a){var t=e.bsPrefix,s=e.className,u=e.bg,d=e.text,m=e.border,f=e.body,p=e.children,v=e.as,h=void 0===v?"div":v,g=Object(n.a)(e,["bsPrefix","className","bg","text","border","body","children","as"]),j=Object(o.a)(t,"card"),O=Object(i.useMemo)((function(){return{cardHeaderBsPrefix:j+"-header"}}),[j]);return l.a.createElement(b.Provider,{value:O},l.a.createElement(h,Object(r.a)({ref:a},g,{className:c()(s,j,u&&"bg-"+u,d&&"text-"+d,m&&"border-"+m)}),f?l.a.createElement(E,null,p):p))}));w.displayName="Card",w.defaultProps={body:!1},w.Img=p,w.Title=g,w.Subtitle=j,w.Body=E,w.Link=O,w.Text=N,w.Header=x,w.Footer=y,w.ImgOverlay=k;a.a=w},76:function(e,a,t){"use strict";var r=t(4),n=t(7),s=t(56),c=t.n(s),i=t(0),l=t.n(i),o=t(57),u=l.a.forwardRef((function(e,a){var t=e.bsPrefix,s=e.className,i=e.striped,u=e.bordered,d=e.borderless,m=e.hover,b=e.size,f=e.variant,p=e.responsive,v=Object(n.a)(e,["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"]),h=Object(o.a)(t,"table"),E=c()(s,h,f&&h+"-"+f,b&&h+"-"+b,i&&h+"-striped",u&&h+"-bordered",d&&h+"-borderless",m&&h+"-hover"),g=l.a.createElement("table",Object(r.a)({},v,{className:E,ref:a}));if(p){var j=h+"-responsive";return"string"===typeof p&&(j=j+"-"+p),l.a.createElement("div",{className:j},g)}return g}));a.a=u}}]);
//# sourceMappingURL=30.6c571f75.chunk.js.map