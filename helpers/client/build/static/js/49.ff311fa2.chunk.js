(this["webpackJsonplms-react-app"]=this["webpackJsonplms-react-app"]||[]).push([[49],{412:function(e,t,a){"use strict";a.r(t);var n=a(67),l=a.n(n),r=a(68),o=a(9),i=a(10),c=a(12),s=a(11),u=a(0),d=a.n(u),m=a(71),h=a(457),p=a(244),f=a(73),E=a(72),g=a(21),w=a(63),b=a.n(w),k=a(23),v=a(64),M=a(16),y=a(22),D=function(e){Object(c.a)(a,e);var t=Object(s.a)(a);function a(e){var n;return Object(o.a)(this,a),(n=t.call(this,e)).componentDidMount=Object(r.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n.props&&n.props.user&&n.props.user.id&&n.props.match&&n.props.match.params&&n.props.match.params.id)){e.next=4;break}return e.next=3,n.setState({class_id:n.props.match.params.id});case 3:n.getAnnoucementList();case 4:case"end":return e.stop()}}),e)}))),n.createNotification=function(e,t){switch(e){case"info":v.NotificationManager.info(t,"",5e3);break;case"success":v.NotificationManager.success(t,"",5e3);break;case"warning":v.NotificationManager.warning(t,"",5e3);break;case"error":v.NotificationManager.error(t,"",5e3)}},n.state={isLoading:!1,deletedRowId:null,showModal:!1,handleCloseModal:!1,isValid:{value:!1,text:""},data:[],class_id:"",title:""},n}return Object(i.a)(a,[{key:"openDeleteModal",value:function(e){this.setState({title:e.title,showModal:!0,deletedRowId:e.id})}},{key:"closeDeleteModal",value:function(){this.setState({showModal:!1})}},{key:"handleDelete",value:function(){var e=this;this.setState({showModal:!1,isLoading:!0}),b.a.delete("".concat(k.a.prod,"/api/annoucement/delete"),{data:{annoucement_id:this.state.deletedRowId}}).then((function(t){e.createNotification("success","Annoucement Deleted Successfully"),e.getAnnoucementList(),e.setState({isLoading:!1,name:""})})).catch((function(t){e.setState({isLoading:!1,name:""}),console.log("Error: deleting data from db ",t.response),e.createNotification("error","Error while deleting data from db")}))}},{key:"getAnnoucementList",value:function(){var e=this;this.setState({isLoading:!0}),b.a.get("".concat(k.a.prod,"/api/annoucement/").concat(this.state.class_id,"/list")).then((function(t){e.setState({data:t.data.data,isLoading:!1})})).catch((function(t){e.setState({isLoading:!1}),console.log("Error: getting data from db ",t.response),e.createNotification("error","Error while Getting data from db")}))}},{key:"cancelDelete",value:function(){this.setState({isEdit:!1,showModal:!1,name:""})}},{key:"render",value:function(){var e=this;return d.a.createElement(g.a,null,this.state.isLoading&&d.a.createElement(M.a,null),d.a.createElement(m.a,null,this.state.showModal&&d.a.createElement(h.a,{show:this.state.showModal,onHide:function(){return e.setState({showModal:!1})}},d.a.createElement(h.a.Header,{closeButton:!0},d.a.createElement(h.a.Title,null,"Delete Confirm")),d.a.createElement(h.a.Body,null,"Are you sure to want to delete ",d.a.createElement("b",null,this.state.title),"?"),d.a.createElement(h.a.Footer,null,d.a.createElement(p.a,{variant:"primary",onClick:function(){return e.handleDelete()}},"OK"),d.a.createElement(p.a,{variant:"secondary",onClick:function(){return e.cancelDelete()}},"Cancel"))),d.a.createElement(v.NotificationContainer,null),d.a.createElement(f.a,null,d.a.createElement(E.a,null,d.a.createElement(E.a.Header,null,d.a.createElement(E.a.Title,{as:"h5"},"Annoucements List")),d.a.createElement(E.a.Body,null,d.a.createElement(m.a,null,d.a.createElement(f.a,null,this.state.data.map((function(t,a){return d.a.createElement(f.a,{key:t.id},d.a.createElement(E.a,null,d.a.createElement(E.a.Header,null,d.a.createElement("b",null,"# ",a+1,": ",t.title),d.a.createElement(p.a,{onClick:function(a){return e.openDeleteModal(t)},variant:"danger",style:{float:"right"}},"Delete")),d.a.createElement(E.a.Body,null,d.a.createElement(m.a,null,d.a.createElement(f.a,null,d.a.createElement("h5",null,"Description"),d.a.createElement("hr",null),d.a.createElement("p",null,t.description))))))})))))))))}}]),a}(d.a.Component);t.default=Object(y.b)((function(e){return{user:e.userDetails.user}}),null)(D)}}]);
//# sourceMappingURL=49.ff311fa2.chunk.js.map