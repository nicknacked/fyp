(this["webpackJsonplms-react-app"]=this["webpackJsonplms-react-app"]||[]).push([[29],{427:function(e,a,t){"use strict";t.r(a);var r=t(9),n=t(10),c=t(12),s=t(11),i=t(0),o=t.n(i),l=t(71),u=t(73),d=t(72),m=t(76),f=t(244),b=t(21),p=t(63),v=t.n(p),h=t(23),E=t(64),g=t(16),O=t(22),j=function(e){Object(c.a)(t,e);var a=Object(s.a)(t);function t(e){var n;return Object(r.a)(this,t),(n=a.call(this,e)).componentDidMount=function(){n.getTopicsList()},n.createNotification=function(e,a){switch(e){case"info":E.NotificationManager.info(a,"",5e3);break;case"success":E.NotificationManager.success(a,"",5e3);break;case"warning":E.NotificationManager.warning(a,"",5e3);break;case"error":E.NotificationManager.error(a,"",5e3)}},n.state={isLoading:!1,isValid:{value:!1,text:""},data:[],class_id:""},n}return Object(n.a)(t,[{key:"openDiscussionForum",value:function(e){this.props.history.push("/faculty/general/topic/".concat(e.id,"/discussion"))}},{key:"getTopicsList",value:function(){var e=this;this.setState({isLoading:!0}),v.a.get("".concat(h.a.prod,"/api/topic/").concat(this.props.user.id,"/list")).then((function(a){e.setState({data:a.data.data,isLoading:!1})})).catch((function(a){e.setState({isLoading:!1}),console.log("Error: getting data from db ",a.response),e.createNotification("error","Error while Getting data from db")}))}},{key:"cancelDownload",value:function(){this.setState({showModal:!1,title:""})}},{key:"render",value:function(){var e=this;return o.a.createElement(b.a,null,this.state.isLoading&&o.a.createElement(g.a,null),o.a.createElement(l.a,null,o.a.createElement(E.NotificationContainer,null),o.a.createElement(u.a,null,o.a.createElement(d.a,null,o.a.createElement(d.a.Header,null,o.a.createElement(d.a.Title,{as:"h5"},"General Topics List")),o.a.createElement(d.a.Body,null,o.a.createElement(l.a,null,o.a.createElement(u.a,null,o.a.createElement(m.a,{striped:!0,bordered:!0,hover:!0,responsive:!0},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",null,"#"),o.a.createElement("th",null,"Title"),o.a.createElement("th",null,"Description"),o.a.createElement("th",null,"Actions"))),o.a.createElement("tbody",null,this.state.data.map((function(a,t){return o.a.createElement("tr",{key:t},o.a.createElement("td",null,t),o.a.createElement("td",null,a.name),o.a.createElement("td",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word"}},a.description),o.a.createElement("td",null,o.a.createElement(f.a,{onClick:function(t){return e.openDiscussionForum(a)},variant:"primary"},"Open Forum")))})))))))))))}}]),t}(o.a.Component);a.default=Object(O.b)((function(e){return{user:e.userDetails.user}}),null)(j)},61:function(e,a,t){"use strict";var r=t(4),n=t(0),c=t.n(n),s=t(56),i=t.n(s);a.a=function(e){return c.a.forwardRef((function(a,t){return c.a.createElement("div",Object(r.a)({},a,{ref:t,className:i()(a.className,e)}))}))}},71:function(e,a,t){"use strict";var r=t(4),n=t(7),c=t(56),s=t.n(c),i=t(0),o=t.n(i),l=t(57),u=["xl","lg","md","sm","xs"],d=o.a.forwardRef((function(e,a){var t=e.bsPrefix,c=e.className,i=e.noGutters,d=e.as,m=void 0===d?"div":d,f=Object(n.a)(e,["bsPrefix","className","noGutters","as"]),b=Object(l.a)(t,"row"),p=b+"-cols",v=[];return u.forEach((function(e){var a,t=f[e];delete f[e];var r="xs"!==e?"-"+e:"";null!=(a=null!=t&&"object"===typeof t?t.cols:t)&&v.push(""+p+r+"-"+a)})),o.a.createElement(m,Object(r.a)({ref:a},f,{className:s.a.apply(void 0,[c,b,i&&"no-gutters"].concat(v))}))}));d.displayName="Row",d.defaultProps={noGutters:!1},a.a=d},72:function(e,a,t){"use strict";var r=t(4),n=t(7),c=t(56),s=t.n(c),i=t(0),o=t.n(i),l=t(57),u=t(60),d=t(61),m=o.a.createContext(null);m.displayName="CardContext";var f=m,b=o.a.forwardRef((function(e,a){var t=e.bsPrefix,c=e.className,i=e.variant,u=e.as,d=void 0===u?"img":u,m=Object(n.a)(e,["bsPrefix","className","variant","as"]),f=Object(l.a)(t,"card-img");return o.a.createElement(d,Object(r.a)({ref:a,className:s()(i?f+"-"+i:f,c)},m))}));b.displayName="CardImg",b.defaultProps={variant:null};var p=b,v=Object(d.a)("h5"),h=Object(d.a)("h6"),E=Object(u.a)("card-body"),g=Object(u.a)("card-title",{Component:v}),O=Object(u.a)("card-subtitle",{Component:h}),j=Object(u.a)("card-link",{Component:"a"}),N=Object(u.a)("card-text",{Component:"p"}),y=Object(u.a)("card-header"),x=Object(u.a)("card-footer"),w=Object(u.a)("card-img-overlay"),k=o.a.forwardRef((function(e,a){var t=e.bsPrefix,c=e.className,u=e.bg,d=e.text,m=e.border,b=e.body,p=e.children,v=e.as,h=void 0===v?"div":v,g=Object(n.a)(e,["bsPrefix","className","bg","text","border","body","children","as"]),O=Object(l.a)(t,"card"),j=Object(i.useMemo)((function(){return{cardHeaderBsPrefix:O+"-header"}}),[O]);return o.a.createElement(f.Provider,{value:j},o.a.createElement(h,Object(r.a)({ref:a},g,{className:s()(c,O,u&&"bg-"+u,d&&"text-"+d,m&&"border-"+m)}),b?o.a.createElement(E,null,p):p))}));k.displayName="Card",k.defaultProps={body:!1},k.Img=p,k.Title=g,k.Subtitle=O,k.Body=E,k.Link=j,k.Text=N,k.Header=y,k.Footer=x,k.ImgOverlay=w;a.a=k},76:function(e,a,t){"use strict";var r=t(4),n=t(7),c=t(56),s=t.n(c),i=t(0),o=t.n(i),l=t(57),u=o.a.forwardRef((function(e,a){var t=e.bsPrefix,c=e.className,i=e.striped,u=e.bordered,d=e.borderless,m=e.hover,f=e.size,b=e.variant,p=e.responsive,v=Object(n.a)(e,["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"]),h=Object(l.a)(t,"table"),E=s()(c,h,b&&h+"-"+b,f&&h+"-"+f,i&&h+"-striped",u&&h+"-bordered",d&&h+"-borderless",m&&h+"-hover"),g=o.a.createElement("table",Object(r.a)({},v,{className:E,ref:a}));if(p){var O=h+"-responsive";return"string"===typeof p&&(O=O+"-"+p),o.a.createElement("div",{className:O},g)}return g}));a.a=u}}]);
//# sourceMappingURL=29.02a5ed09.chunk.js.map