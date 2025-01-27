import{m as et}from"./monaco-D_himP8N.js";/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/var tt=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,rt=Object.getOwnPropertyNames,it=Object.prototype.hasOwnProperty,at=(e,r,i,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of rt(r))!it.call(e,t)&&t!==i&&tt(e,t,{get:()=>r[t],enumerable:!(n=nt(r,t))||n.enumerable});return e},ot=(e,r,i)=>(at(e,r,"default"),i),d={};ot(d,et);var st=2*60*1e3,ut=class{constructor(e){this._defaults=e,this._worker=null,this._client=null,this._idleCheckInterval=window.setInterval(()=>this._checkIfIdle(),30*1e3),this._lastUsedTime=0,this._configChangeListener=this._defaults.onDidChange(()=>this._stopWorker())}_stopWorker(){this._worker&&(this._worker.dispose(),this._worker=null),this._client=null}dispose(){clearInterval(this._idleCheckInterval),this._configChangeListener.dispose(),this._stopWorker()}_checkIfIdle(){if(!this._worker)return;Date.now()-this._lastUsedTime>st&&this._stopWorker()}_getClient(){return this._lastUsedTime=Date.now(),this._client||(this._worker=d.editor.createWebWorker({moduleId:"vs/language/css/cssWorker",label:this._defaults.languageId,createData:{options:this._defaults.options,languageId:this._defaults.languageId}}),this._client=this._worker.getProxy()),this._client}getLanguageServiceWorker(...e){let r;return this._getClient().then(i=>{r=i}).then(i=>{if(this._worker)return this._worker.withSyncedResources(e)}).then(i=>r)}},T;(function(e){function r(i){return typeof i=="string"}e.is=r})(T||(T={}));var O;(function(e){function r(i){return typeof i=="string"}e.is=r})(O||(O={}));var Y;(function(e){e.MIN_VALUE=-2147483648,e.MAX_VALUE=2147483647;function r(i){return typeof i=="number"&&e.MIN_VALUE<=i&&i<=e.MAX_VALUE}e.is=r})(Y||(Y={}));var M;(function(e){e.MIN_VALUE=0,e.MAX_VALUE=2147483647;function r(i){return typeof i=="number"&&e.MIN_VALUE<=i&&i<=e.MAX_VALUE}e.is=r})(M||(M={}));var w;(function(e){function r(n,t){return n===Number.MAX_VALUE&&(n=M.MAX_VALUE),t===Number.MAX_VALUE&&(t=M.MAX_VALUE),{line:n,character:t}}e.create=r;function i(n){let t=n;return o.objectLiteral(t)&&o.uinteger(t.line)&&o.uinteger(t.character)}e.is=i})(w||(w={}));var h;(function(e){function r(n,t,a,s){if(o.uinteger(n)&&o.uinteger(t)&&o.uinteger(a)&&o.uinteger(s))return{start:w.create(n,t),end:w.create(a,s)};if(w.is(n)&&w.is(t))return{start:n,end:t};throw new Error(`Range#create called with invalid arguments[${n}, ${t}, ${a}, ${s}]`)}e.create=r;function i(n){let t=n;return o.objectLiteral(t)&&w.is(t.start)&&w.is(t.end)}e.is=i})(h||(h={}));var C;(function(e){function r(n,t){return{uri:n,range:t}}e.create=r;function i(n){let t=n;return o.objectLiteral(t)&&h.is(t.range)&&(o.string(t.uri)||o.undefined(t.uri))}e.is=i})(C||(C={}));var Z;(function(e){function r(n,t,a,s){return{targetUri:n,targetRange:t,targetSelectionRange:a,originSelectionRange:s}}e.create=r;function i(n){let t=n;return o.objectLiteral(t)&&h.is(t.targetRange)&&o.string(t.targetUri)&&h.is(t.targetSelectionRange)&&(h.is(t.originSelectionRange)||o.undefined(t.originSelectionRange))}e.is=i})(Z||(Z={}));var S;(function(e){function r(n,t,a,s){return{red:n,green:t,blue:a,alpha:s}}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&o.numberRange(t.red,0,1)&&o.numberRange(t.green,0,1)&&o.numberRange(t.blue,0,1)&&o.numberRange(t.alpha,0,1)}e.is=i})(S||(S={}));var K;(function(e){function r(n,t){return{range:n,color:t}}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&h.is(t.range)&&S.is(t.color)}e.is=i})(K||(K={}));var ee;(function(e){function r(n,t,a){return{label:n,textEdit:t,additionalTextEdits:a}}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&o.string(t.label)&&(o.undefined(t.textEdit)||E.is(t))&&(o.undefined(t.additionalTextEdits)||o.typedArray(t.additionalTextEdits,E.is))}e.is=i})(ee||(ee={}));var A;(function(e){e.Comment="comment",e.Imports="imports",e.Region="region"})(A||(A={}));var te;(function(e){function r(n,t,a,s,u,l){const c={startLine:n,endLine:t};return o.defined(a)&&(c.startCharacter=a),o.defined(s)&&(c.endCharacter=s),o.defined(u)&&(c.kind=u),o.defined(l)&&(c.collapsedText=l),c}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&o.uinteger(t.startLine)&&o.uinteger(t.startLine)&&(o.undefined(t.startCharacter)||o.uinteger(t.startCharacter))&&(o.undefined(t.endCharacter)||o.uinteger(t.endCharacter))&&(o.undefined(t.kind)||o.string(t.kind))}e.is=i})(te||(te={}));var U;(function(e){function r(n,t){return{location:n,message:t}}e.create=r;function i(n){let t=n;return o.defined(t)&&C.is(t.location)&&o.string(t.message)}e.is=i})(U||(U={}));var x;(function(e){e.Error=1,e.Warning=2,e.Information=3,e.Hint=4})(x||(x={}));var ne;(function(e){e.Unnecessary=1,e.Deprecated=2})(ne||(ne={}));var re;(function(e){function r(i){const n=i;return o.objectLiteral(n)&&o.string(n.href)}e.is=r})(re||(re={}));var y;(function(e){function r(n,t,a,s,u,l){let c={range:n,message:t};return o.defined(a)&&(c.severity=a),o.defined(s)&&(c.code=s),o.defined(u)&&(c.source=u),o.defined(l)&&(c.relatedInformation=l),c}e.create=r;function i(n){var t;let a=n;return o.defined(a)&&h.is(a.range)&&o.string(a.message)&&(o.number(a.severity)||o.undefined(a.severity))&&(o.integer(a.code)||o.string(a.code)||o.undefined(a.code))&&(o.undefined(a.codeDescription)||o.string((t=a.codeDescription)===null||t===void 0?void 0:t.href))&&(o.string(a.source)||o.undefined(a.source))&&(o.undefined(a.relatedInformation)||o.typedArray(a.relatedInformation,U.is))}e.is=i})(y||(y={}));var I;(function(e){function r(n,t,...a){let s={title:n,command:t};return o.defined(a)&&a.length>0&&(s.arguments=a),s}e.create=r;function i(n){let t=n;return o.defined(t)&&o.string(t.title)&&o.string(t.command)}e.is=i})(I||(I={}));var E;(function(e){function r(a,s){return{range:a,newText:s}}e.replace=r;function i(a,s){return{range:{start:a,end:a},newText:s}}e.insert=i;function n(a){return{range:a,newText:""}}e.del=n;function t(a){const s=a;return o.objectLiteral(s)&&o.string(s.newText)&&h.is(s.range)}e.is=t})(E||(E={}));var V;(function(e){function r(n,t,a){const s={label:n};return t!==void 0&&(s.needsConfirmation=t),a!==void 0&&(s.description=a),s}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&o.string(t.label)&&(o.boolean(t.needsConfirmation)||t.needsConfirmation===void 0)&&(o.string(t.description)||t.description===void 0)}e.is=i})(V||(V={}));var L;(function(e){function r(i){const n=i;return o.string(n)}e.is=r})(L||(L={}));var ie;(function(e){function r(a,s,u){return{range:a,newText:s,annotationId:u}}e.replace=r;function i(a,s,u){return{range:{start:a,end:a},newText:s,annotationId:u}}e.insert=i;function n(a,s){return{range:a,newText:"",annotationId:s}}e.del=n;function t(a){const s=a;return E.is(s)&&(V.is(s.annotationId)||L.is(s.annotationId))}e.is=t})(ie||(ie={}));var W;(function(e){function r(n,t){return{textDocument:n,edits:t}}e.create=r;function i(n){let t=n;return o.defined(t)&&B.is(t.textDocument)&&Array.isArray(t.edits)}e.is=i})(W||(W={}));var H;(function(e){function r(n,t,a){let s={kind:"create",uri:n};return t!==void 0&&(t.overwrite!==void 0||t.ignoreIfExists!==void 0)&&(s.options=t),a!==void 0&&(s.annotationId=a),s}e.create=r;function i(n){let t=n;return t&&t.kind==="create"&&o.string(t.uri)&&(t.options===void 0||(t.options.overwrite===void 0||o.boolean(t.options.overwrite))&&(t.options.ignoreIfExists===void 0||o.boolean(t.options.ignoreIfExists)))&&(t.annotationId===void 0||L.is(t.annotationId))}e.is=i})(H||(H={}));var X;(function(e){function r(n,t,a,s){let u={kind:"rename",oldUri:n,newUri:t};return a!==void 0&&(a.overwrite!==void 0||a.ignoreIfExists!==void 0)&&(u.options=a),s!==void 0&&(u.annotationId=s),u}e.create=r;function i(n){let t=n;return t&&t.kind==="rename"&&o.string(t.oldUri)&&o.string(t.newUri)&&(t.options===void 0||(t.options.overwrite===void 0||o.boolean(t.options.overwrite))&&(t.options.ignoreIfExists===void 0||o.boolean(t.options.ignoreIfExists)))&&(t.annotationId===void 0||L.is(t.annotationId))}e.is=i})(X||(X={}));var $;(function(e){function r(n,t,a){let s={kind:"delete",uri:n};return t!==void 0&&(t.recursive!==void 0||t.ignoreIfNotExists!==void 0)&&(s.options=t),a!==void 0&&(s.annotationId=a),s}e.create=r;function i(n){let t=n;return t&&t.kind==="delete"&&o.string(t.uri)&&(t.options===void 0||(t.options.recursive===void 0||o.boolean(t.options.recursive))&&(t.options.ignoreIfNotExists===void 0||o.boolean(t.options.ignoreIfNotExists)))&&(t.annotationId===void 0||L.is(t.annotationId))}e.is=i})($||($={}));var z;(function(e){function r(i){let n=i;return n&&(n.changes!==void 0||n.documentChanges!==void 0)&&(n.documentChanges===void 0||n.documentChanges.every(t=>o.string(t.kind)?H.is(t)||X.is(t)||$.is(t):W.is(t)))}e.is=r})(z||(z={}));var ae;(function(e){function r(n){return{uri:n}}e.create=r;function i(n){let t=n;return o.defined(t)&&o.string(t.uri)}e.is=i})(ae||(ae={}));var oe;(function(e){function r(n,t){return{uri:n,version:t}}e.create=r;function i(n){let t=n;return o.defined(t)&&o.string(t.uri)&&o.integer(t.version)}e.is=i})(oe||(oe={}));var B;(function(e){function r(n,t){return{uri:n,version:t}}e.create=r;function i(n){let t=n;return o.defined(t)&&o.string(t.uri)&&(t.version===null||o.integer(t.version))}e.is=i})(B||(B={}));var se;(function(e){function r(n,t,a,s){return{uri:n,languageId:t,version:a,text:s}}e.create=r;function i(n){let t=n;return o.defined(t)&&o.string(t.uri)&&o.string(t.languageId)&&o.integer(t.version)&&o.string(t.text)}e.is=i})(se||(se={}));var q;(function(e){e.PlainText="plaintext",e.Markdown="markdown";function r(i){const n=i;return n===e.PlainText||n===e.Markdown}e.is=r})(q||(q={}));var P;(function(e){function r(i){const n=i;return o.objectLiteral(i)&&q.is(n.kind)&&o.string(n.value)}e.is=r})(P||(P={}));var p;(function(e){e.Text=1,e.Method=2,e.Function=3,e.Constructor=4,e.Field=5,e.Variable=6,e.Class=7,e.Interface=8,e.Module=9,e.Property=10,e.Unit=11,e.Value=12,e.Enum=13,e.Keyword=14,e.Snippet=15,e.Color=16,e.File=17,e.Reference=18,e.Folder=19,e.EnumMember=20,e.Constant=21,e.Struct=22,e.Event=23,e.Operator=24,e.TypeParameter=25})(p||(p={}));var Q;(function(e){e.PlainText=1,e.Snippet=2})(Q||(Q={}));var ue;(function(e){e.Deprecated=1})(ue||(ue={}));var ce;(function(e){function r(n,t,a){return{newText:n,insert:t,replace:a}}e.create=r;function i(n){const t=n;return t&&o.string(t.newText)&&h.is(t.insert)&&h.is(t.replace)}e.is=i})(ce||(ce={}));var de;(function(e){e.asIs=1,e.adjustIndentation=2})(de||(de={}));var fe;(function(e){function r(i){const n=i;return n&&(o.string(n.detail)||n.detail===void 0)&&(o.string(n.description)||n.description===void 0)}e.is=r})(fe||(fe={}));var le;(function(e){function r(i){return{label:i}}e.create=r})(le||(le={}));var ge;(function(e){function r(i,n){return{items:i||[],isIncomplete:!!n}}e.create=r})(ge||(ge={}));var F;(function(e){function r(n){return n.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}e.fromPlainText=r;function i(n){const t=n;return o.string(t)||o.objectLiteral(t)&&o.string(t.language)&&o.string(t.value)}e.is=i})(F||(F={}));var he;(function(e){function r(i){let n=i;return!!n&&o.objectLiteral(n)&&(P.is(n.contents)||F.is(n.contents)||o.typedArray(n.contents,F.is))&&(i.range===void 0||h.is(i.range))}e.is=r})(he||(he={}));var pe;(function(e){function r(i,n){return n?{label:i,documentation:n}:{label:i}}e.create=r})(pe||(pe={}));var ve;(function(e){function r(i,n,...t){let a={label:i};return o.defined(n)&&(a.documentation=n),o.defined(t)?a.parameters=t:a.parameters=[],a}e.create=r})(ve||(ve={}));var R;(function(e){e.Text=1,e.Read=2,e.Write=3})(R||(R={}));var me;(function(e){function r(i,n){let t={range:i};return o.number(n)&&(t.kind=n),t}e.create=r})(me||(me={}));var v;(function(e){e.File=1,e.Module=2,e.Namespace=3,e.Package=4,e.Class=5,e.Method=6,e.Property=7,e.Field=8,e.Constructor=9,e.Enum=10,e.Interface=11,e.Function=12,e.Variable=13,e.Constant=14,e.String=15,e.Number=16,e.Boolean=17,e.Array=18,e.Object=19,e.Key=20,e.Null=21,e.EnumMember=22,e.Struct=23,e.Event=24,e.Operator=25,e.TypeParameter=26})(v||(v={}));var _e;(function(e){e.Deprecated=1})(_e||(_e={}));var be;(function(e){function r(i,n,t,a,s){let u={name:i,kind:n,location:{uri:a,range:t}};return s&&(u.containerName=s),u}e.create=r})(be||(be={}));var we;(function(e){function r(i,n,t,a){return a!==void 0?{name:i,kind:n,location:{uri:t,range:a}}:{name:i,kind:n,location:{uri:t}}}e.create=r})(we||(we={}));var ke;(function(e){function r(n,t,a,s,u,l){let c={name:n,detail:t,kind:a,range:s,selectionRange:u};return l!==void 0&&(c.children=l),c}e.create=r;function i(n){let t=n;return t&&o.string(t.name)&&o.number(t.kind)&&h.is(t.range)&&h.is(t.selectionRange)&&(t.detail===void 0||o.string(t.detail))&&(t.deprecated===void 0||o.boolean(t.deprecated))&&(t.children===void 0||Array.isArray(t.children))&&(t.tags===void 0||Array.isArray(t.tags))}e.is=i})(ke||(ke={}));var xe;(function(e){e.Empty="",e.QuickFix="quickfix",e.Refactor="refactor",e.RefactorExtract="refactor.extract",e.RefactorInline="refactor.inline",e.RefactorRewrite="refactor.rewrite",e.Source="source",e.SourceOrganizeImports="source.organizeImports",e.SourceFixAll="source.fixAll"})(xe||(xe={}));var j;(function(e){e.Invoked=1,e.Automatic=2})(j||(j={}));var Ie;(function(e){function r(n,t,a){let s={diagnostics:n};return t!=null&&(s.only=t),a!=null&&(s.triggerKind=a),s}e.create=r;function i(n){let t=n;return o.defined(t)&&o.typedArray(t.diagnostics,y.is)&&(t.only===void 0||o.typedArray(t.only,o.string))&&(t.triggerKind===void 0||t.triggerKind===j.Invoked||t.triggerKind===j.Automatic)}e.is=i})(Ie||(Ie={}));var Ee;(function(e){function r(n,t,a){let s={title:n},u=!0;return typeof t=="string"?(u=!1,s.kind=t):I.is(t)?s.command=t:s.edit=t,u&&a!==void 0&&(s.kind=a),s}e.create=r;function i(n){let t=n;return t&&o.string(t.title)&&(t.diagnostics===void 0||o.typedArray(t.diagnostics,y.is))&&(t.kind===void 0||o.string(t.kind))&&(t.edit!==void 0||t.command!==void 0)&&(t.command===void 0||I.is(t.command))&&(t.isPreferred===void 0||o.boolean(t.isPreferred))&&(t.edit===void 0||z.is(t.edit))}e.is=i})(Ee||(Ee={}));var Le;(function(e){function r(n,t){let a={range:n};return o.defined(t)&&(a.data=t),a}e.create=r;function i(n){let t=n;return o.defined(t)&&h.is(t.range)&&(o.undefined(t.command)||I.is(t.command))}e.is=i})(Le||(Le={}));var Ae;(function(e){function r(n,t){return{tabSize:n,insertSpaces:t}}e.create=r;function i(n){let t=n;return o.defined(t)&&o.uinteger(t.tabSize)&&o.boolean(t.insertSpaces)}e.is=i})(Ae||(Ae={}));var Re;(function(e){function r(n,t,a){return{range:n,target:t,data:a}}e.create=r;function i(n){let t=n;return o.defined(t)&&h.is(t.range)&&(o.undefined(t.target)||o.string(t.target))}e.is=i})(Re||(Re={}));var Pe;(function(e){function r(n,t){return{range:n,parent:t}}e.create=r;function i(n){let t=n;return o.objectLiteral(t)&&h.is(t.range)&&(t.parent===void 0||e.is(t.parent))}e.is=i})(Pe||(Pe={}));var De;(function(e){e.namespace="namespace",e.type="type",e.class="class",e.enum="enum",e.interface="interface",e.struct="struct",e.typeParameter="typeParameter",e.parameter="parameter",e.variable="variable",e.property="property",e.enumMember="enumMember",e.event="event",e.function="function",e.method="method",e.macro="macro",e.keyword="keyword",e.modifier="modifier",e.comment="comment",e.string="string",e.number="number",e.regexp="regexp",e.operator="operator",e.decorator="decorator"})(De||(De={}));var Me;(function(e){e.declaration="declaration",e.definition="definition",e.readonly="readonly",e.static="static",e.deprecated="deprecated",e.abstract="abstract",e.async="async",e.modification="modification",e.documentation="documentation",e.defaultLibrary="defaultLibrary"})(Me||(Me={}));var Ce;(function(e){function r(i){const n=i;return o.objectLiteral(n)&&(n.resultId===void 0||typeof n.resultId=="string")&&Array.isArray(n.data)&&(n.data.length===0||typeof n.data[0]=="number")}e.is=r})(Ce||(Ce={}));var ye;(function(e){function r(n,t){return{range:n,text:t}}e.create=r;function i(n){const t=n;return t!=null&&h.is(t.range)&&o.string(t.text)}e.is=i})(ye||(ye={}));var Fe;(function(e){function r(n,t,a){return{range:n,variableName:t,caseSensitiveLookup:a}}e.create=r;function i(n){const t=n;return t!=null&&h.is(t.range)&&o.boolean(t.caseSensitiveLookup)&&(o.string(t.variableName)||t.variableName===void 0)}e.is=i})(Fe||(Fe={}));var je;(function(e){function r(n,t){return{range:n,expression:t}}e.create=r;function i(n){const t=n;return t!=null&&h.is(t.range)&&(o.string(t.expression)||t.expression===void 0)}e.is=i})(je||(je={}));var Ne;(function(e){function r(n,t){return{frameId:n,stoppedLocation:t}}e.create=r;function i(n){const t=n;return o.defined(t)&&h.is(n.stoppedLocation)}e.is=i})(Ne||(Ne={}));var G;(function(e){e.Type=1,e.Parameter=2;function r(i){return i===1||i===2}e.is=r})(G||(G={}));var J;(function(e){function r(n){return{value:n}}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&(t.tooltip===void 0||o.string(t.tooltip)||P.is(t.tooltip))&&(t.location===void 0||C.is(t.location))&&(t.command===void 0||I.is(t.command))}e.is=i})(J||(J={}));var Oe;(function(e){function r(n,t,a){const s={position:n,label:t};return a!==void 0&&(s.kind=a),s}e.create=r;function i(n){const t=n;return o.objectLiteral(t)&&w.is(t.position)&&(o.string(t.label)||o.typedArray(t.label,J.is))&&(t.kind===void 0||G.is(t.kind))&&t.textEdits===void 0||o.typedArray(t.textEdits,E.is)&&(t.tooltip===void 0||o.string(t.tooltip)||P.is(t.tooltip))&&(t.paddingLeft===void 0||o.boolean(t.paddingLeft))&&(t.paddingRight===void 0||o.boolean(t.paddingRight))}e.is=i})(Oe||(Oe={}));var Se;(function(e){function r(i){return{kind:"snippet",value:i}}e.createSnippet=r})(Se||(Se={}));var Ue;(function(e){function r(i,n,t,a){return{insertText:i,filterText:n,range:t,command:a}}e.create=r})(Ue||(Ue={}));var Ve;(function(e){function r(i){return{items:i}}e.create=r})(Ve||(Ve={}));var We;(function(e){e.Invoked=0,e.Automatic=1})(We||(We={}));var He;(function(e){function r(i,n){return{range:i,text:n}}e.create=r})(He||(He={}));var Xe;(function(e){function r(i,n){return{triggerKind:i,selectedCompletionInfo:n}}e.create=r})(Xe||(Xe={}));var $e;(function(e){function r(i){const n=i;return o.objectLiteral(n)&&O.is(n.uri)&&o.string(n.name)}e.is=r})($e||($e={}));var ze;(function(e){function r(a,s,u,l){return new ct(a,s,u,l)}e.create=r;function i(a){let s=a;return!!(o.defined(s)&&o.string(s.uri)&&(o.undefined(s.languageId)||o.string(s.languageId))&&o.uinteger(s.lineCount)&&o.func(s.getText)&&o.func(s.positionAt)&&o.func(s.offsetAt))}e.is=i;function n(a,s){let u=a.getText(),l=t(s,(g,_)=>{let b=g.range.start.line-_.range.start.line;return b===0?g.range.start.character-_.range.start.character:b}),c=u.length;for(let g=l.length-1;g>=0;g--){let _=l[g],b=a.offsetAt(_.range.start),f=a.offsetAt(_.range.end);if(f<=c)u=u.substring(0,b)+_.newText+u.substring(f,u.length);else throw new Error("Overlapping edit");c=b}return u}e.applyEdits=n;function t(a,s){if(a.length<=1)return a;const u=a.length/2|0,l=a.slice(0,u),c=a.slice(u);t(l,s),t(c,s);let g=0,_=0,b=0;for(;g<l.length&&_<c.length;)s(l[g],c[_])<=0?a[b++]=l[g++]:a[b++]=c[_++];for(;g<l.length;)a[b++]=l[g++];for(;_<c.length;)a[b++]=c[_++];return a}})(ze||(ze={}));var ct=class{constructor(e,r,i,n){this._uri=e,this._languageId=r,this._version=i,this._content=n,this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let r=this.offsetAt(e.start),i=this.offsetAt(e.end);return this._content.substring(r,i)}return this._content}update(e,r){this._content=e.text,this._version=r,this._lineOffsets=void 0}getLineOffsets(){if(this._lineOffsets===void 0){let e=[],r=this._content,i=!0;for(let n=0;n<r.length;n++){i&&(e.push(n),i=!1);let t=r.charAt(n);i=t==="\r"||t===`
`,t==="\r"&&n+1<r.length&&r.charAt(n+1)===`
`&&n++}i&&r.length>0&&e.push(r.length),this._lineOffsets=e}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let r=this.getLineOffsets(),i=0,n=r.length;if(n===0)return w.create(0,e);for(;i<n;){let a=Math.floor((i+n)/2);r[a]>e?n=a:i=a+1}let t=i-1;return w.create(t,e-r[t])}offsetAt(e){let r=this.getLineOffsets();if(e.line>=r.length)return this._content.length;if(e.line<0)return 0;let i=r[e.line],n=e.line+1<r.length?r[e.line+1]:this._content.length;return Math.max(Math.min(i+e.character,n),i)}get lineCount(){return this.getLineOffsets().length}},o;(function(e){const r=Object.prototype.toString;function i(f){return typeof f<"u"}e.defined=i;function n(f){return typeof f>"u"}e.undefined=n;function t(f){return f===!0||f===!1}e.boolean=t;function a(f){return r.call(f)==="[object String]"}e.string=a;function s(f){return r.call(f)==="[object Number]"}e.number=s;function u(f,N,Ke){return r.call(f)==="[object Number]"&&N<=f&&f<=Ke}e.numberRange=u;function l(f){return r.call(f)==="[object Number]"&&-2147483648<=f&&f<=2147483647}e.integer=l;function c(f){return r.call(f)==="[object Number]"&&0<=f&&f<=2147483647}e.uinteger=c;function g(f){return r.call(f)==="[object Function]"}e.func=g;function _(f){return f!==null&&typeof f=="object"}e.objectLiteral=_;function b(f,N){return Array.isArray(f)&&f.every(N)}e.typedArray=b})(o||(o={}));var dt=class{constructor(e,r,i){this._languageId=e,this._worker=r,this._disposables=[],this._listener=Object.create(null);const n=a=>{let s=a.getLanguageId();if(s!==this._languageId)return;let u;this._listener[a.uri.toString()]=a.onDidChangeContent(()=>{window.clearTimeout(u),u=window.setTimeout(()=>this._doValidate(a.uri,s),500)}),this._doValidate(a.uri,s)},t=a=>{d.editor.setModelMarkers(a,this._languageId,[]);let s=a.uri.toString(),u=this._listener[s];u&&(u.dispose(),delete this._listener[s])};this._disposables.push(d.editor.onDidCreateModel(n)),this._disposables.push(d.editor.onWillDisposeModel(t)),this._disposables.push(d.editor.onDidChangeModelLanguage(a=>{t(a.model),n(a.model)})),this._disposables.push(i(a=>{d.editor.getModels().forEach(s=>{s.getLanguageId()===this._languageId&&(t(s),n(s))})})),this._disposables.push({dispose:()=>{d.editor.getModels().forEach(t);for(let a in this._listener)this._listener[a].dispose()}}),d.editor.getModels().forEach(n)}dispose(){this._disposables.forEach(e=>e&&e.dispose()),this._disposables.length=0}_doValidate(e,r){this._worker(e).then(i=>i.doValidation(e.toString())).then(i=>{const n=i.map(a=>lt(e,a));let t=d.editor.getModel(e);t&&t.getLanguageId()===r&&d.editor.setModelMarkers(t,r,n)}).then(void 0,i=>{console.error(i)})}};function ft(e){switch(e){case x.Error:return d.MarkerSeverity.Error;case x.Warning:return d.MarkerSeverity.Warning;case x.Information:return d.MarkerSeverity.Info;case x.Hint:return d.MarkerSeverity.Hint;default:return d.MarkerSeverity.Info}}function lt(e,r){let i=typeof r.code=="number"?String(r.code):r.code;return{severity:ft(r.severity),startLineNumber:r.range.start.line+1,startColumn:r.range.start.character+1,endLineNumber:r.range.end.line+1,endColumn:r.range.end.character+1,message:r.message,code:i,source:r.source}}var gt=class{constructor(e,r){this._worker=e,this._triggerCharacters=r}get triggerCharacters(){return this._triggerCharacters}provideCompletionItems(e,r,i,n){const t=e.uri;return this._worker(t).then(a=>a.doComplete(t.toString(),k(r))).then(a=>{if(!a)return;const s=e.getWordUntilPosition(r),u=new d.Range(r.lineNumber,s.startColumn,r.lineNumber,s.endColumn),l=a.items.map(c=>{const g={label:c.label,insertText:c.insertText||c.label,sortText:c.sortText,filterText:c.filterText,documentation:c.documentation,detail:c.detail,command:vt(c.command),range:u,kind:pt(c.kind)};return c.textEdit&&(ht(c.textEdit)?g.range={insert:m(c.textEdit.insert),replace:m(c.textEdit.replace)}:g.range=m(c.textEdit.range),g.insertText=c.textEdit.newText),c.additionalTextEdits&&(g.additionalTextEdits=c.additionalTextEdits.map(D)),c.insertTextFormat===Q.Snippet&&(g.insertTextRules=d.languages.CompletionItemInsertTextRule.InsertAsSnippet),g});return{isIncomplete:a.isIncomplete,suggestions:l}})}};function k(e){if(e)return{character:e.column-1,line:e.lineNumber-1}}function Qe(e){if(e)return{start:{line:e.startLineNumber-1,character:e.startColumn-1},end:{line:e.endLineNumber-1,character:e.endColumn-1}}}function m(e){if(e)return new d.Range(e.start.line+1,e.start.character+1,e.end.line+1,e.end.character+1)}function ht(e){return typeof e.insert<"u"&&typeof e.replace<"u"}function pt(e){const r=d.languages.CompletionItemKind;switch(e){case p.Text:return r.Text;case p.Method:return r.Method;case p.Function:return r.Function;case p.Constructor:return r.Constructor;case p.Field:return r.Field;case p.Variable:return r.Variable;case p.Class:return r.Class;case p.Interface:return r.Interface;case p.Module:return r.Module;case p.Property:return r.Property;case p.Unit:return r.Unit;case p.Value:return r.Value;case p.Enum:return r.Enum;case p.Keyword:return r.Keyword;case p.Snippet:return r.Snippet;case p.Color:return r.Color;case p.File:return r.File;case p.Reference:return r.Reference}return r.Property}function D(e){if(e)return{range:m(e.range),text:e.newText}}function vt(e){return e&&e.command==="editor.action.triggerSuggest"?{id:e.command,title:e.title,arguments:e.arguments}:void 0}var mt=class{constructor(e){this._worker=e}provideHover(e,r,i){let n=e.uri;return this._worker(n).then(t=>t.doHover(n.toString(),k(r))).then(t=>{if(t)return{range:m(t.range),contents:bt(t.contents)}})}};function _t(e){return e&&typeof e=="object"&&typeof e.kind=="string"}function Be(e){return typeof e=="string"?{value:e}:_t(e)?e.kind==="plaintext"?{value:e.value.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}:{value:e.value}:{value:"```"+e.language+`
`+e.value+"\n```\n"}}function bt(e){if(e)return Array.isArray(e)?e.map(Be):[Be(e)]}var wt=class{constructor(e){this._worker=e}provideDocumentHighlights(e,r,i){const n=e.uri;return this._worker(n).then(t=>t.findDocumentHighlights(n.toString(),k(r))).then(t=>{if(t)return t.map(a=>({range:m(a.range),kind:kt(a.kind)}))})}};function kt(e){switch(e){case R.Read:return d.languages.DocumentHighlightKind.Read;case R.Write:return d.languages.DocumentHighlightKind.Write;case R.Text:return d.languages.DocumentHighlightKind.Text}return d.languages.DocumentHighlightKind.Text}var xt=class{constructor(e){this._worker=e}provideDefinition(e,r,i){const n=e.uri;return this._worker(n).then(t=>t.findDefinition(n.toString(),k(r))).then(t=>{if(t)return[Ge(t)]})}};function Ge(e){return{uri:d.Uri.parse(e.uri),range:m(e.range)}}var It=class{constructor(e){this._worker=e}provideReferences(e,r,i,n){const t=e.uri;return this._worker(t).then(a=>a.findReferences(t.toString(),k(r))).then(a=>{if(a)return a.map(Ge)})}},Et=class{constructor(e){this._worker=e}provideRenameEdits(e,r,i,n){const t=e.uri;return this._worker(t).then(a=>a.doRename(t.toString(),k(r),i)).then(a=>Lt(a))}};function Lt(e){if(!e||!e.changes)return;let r=[];for(let i in e.changes){const n=d.Uri.parse(i);for(let t of e.changes[i])r.push({resource:n,versionId:void 0,textEdit:{range:m(t.range),text:t.newText}})}return{edits:r}}var At=class{constructor(e){this._worker=e}provideDocumentSymbols(e,r){const i=e.uri;return this._worker(i).then(n=>n.findDocumentSymbols(i.toString())).then(n=>{if(n)return n.map(t=>Rt(t)?Je(t):{name:t.name,detail:"",containerName:t.containerName,kind:Te(t.kind),range:m(t.location.range),selectionRange:m(t.location.range),tags:[]})})}};function Rt(e){return"children"in e}function Je(e){return{name:e.name,detail:e.detail??"",kind:Te(e.kind),range:m(e.range),selectionRange:m(e.selectionRange),tags:e.tags??[],children:(e.children??[]).map(r=>Je(r))}}function Te(e){let r=d.languages.SymbolKind;switch(e){case v.File:return r.File;case v.Module:return r.Module;case v.Namespace:return r.Namespace;case v.Package:return r.Package;case v.Class:return r.Class;case v.Method:return r.Method;case v.Property:return r.Property;case v.Field:return r.Field;case v.Constructor:return r.Constructor;case v.Enum:return r.Enum;case v.Interface:return r.Interface;case v.Function:return r.Function;case v.Variable:return r.Variable;case v.Constant:return r.Constant;case v.String:return r.String;case v.Number:return r.Number;case v.Boolean:return r.Boolean;case v.Array:return r.Array}return r.Function}var Nt=class{constructor(e){this._worker=e}provideLinks(e,r){const i=e.uri;return this._worker(i).then(n=>n.findDocumentLinks(i.toString())).then(n=>{if(n)return{links:n.map(t=>({range:m(t.range),url:t.target}))}})}},Pt=class{constructor(e){this._worker=e}provideDocumentFormattingEdits(e,r,i){const n=e.uri;return this._worker(n).then(t=>t.format(n.toString(),null,Ye(r)).then(a=>{if(!(!a||a.length===0))return a.map(D)}))}},Dt=class{constructor(e){this._worker=e,this.canFormatMultipleRanges=!1}provideDocumentRangeFormattingEdits(e,r,i,n){const t=e.uri;return this._worker(t).then(a=>a.format(t.toString(),Qe(r),Ye(i)).then(s=>{if(!(!s||s.length===0))return s.map(D)}))}};function Ye(e){return{tabSize:e.tabSize,insertSpaces:e.insertSpaces}}var Mt=class{constructor(e){this._worker=e}provideDocumentColors(e,r){const i=e.uri;return this._worker(i).then(n=>n.findDocumentColors(i.toString())).then(n=>{if(n)return n.map(t=>({color:t.color,range:m(t.range)}))})}provideColorPresentations(e,r,i){const n=e.uri;return this._worker(n).then(t=>t.getColorPresentations(n.toString(),r.color,Qe(r.range))).then(t=>{if(t)return t.map(a=>{let s={label:a.label};return a.textEdit&&(s.textEdit=D(a.textEdit)),a.additionalTextEdits&&(s.additionalTextEdits=a.additionalTextEdits.map(D)),s})})}},Ct=class{constructor(e){this._worker=e}provideFoldingRanges(e,r,i){const n=e.uri;return this._worker(n).then(t=>t.getFoldingRanges(n.toString(),r)).then(t=>{if(t)return t.map(a=>{const s={start:a.startLine+1,end:a.endLine+1};return typeof a.kind<"u"&&(s.kind=yt(a.kind)),s})})}};function yt(e){switch(e){case A.Comment:return d.languages.FoldingRangeKind.Comment;case A.Imports:return d.languages.FoldingRangeKind.Imports;case A.Region:return d.languages.FoldingRangeKind.Region}}var Ft=class{constructor(e){this._worker=e}provideSelectionRanges(e,r,i){const n=e.uri;return this._worker(n).then(t=>t.getSelectionRanges(n.toString(),r.map(k))).then(t=>{if(t)return t.map(a=>{const s=[];for(;a;)s.push({range:m(a.range)}),a=a.parent;return s})})}};function Ot(e){const r=[],i=[],n=new ut(e);r.push(n);const t=(...s)=>n.getLanguageServiceWorker(...s);function a(){const{languageId:s,modeConfiguration:u}=e;Ze(i),u.completionItems&&i.push(d.languages.registerCompletionItemProvider(s,new gt(t,["/","-",":"]))),u.hovers&&i.push(d.languages.registerHoverProvider(s,new mt(t))),u.documentHighlights&&i.push(d.languages.registerDocumentHighlightProvider(s,new wt(t))),u.definitions&&i.push(d.languages.registerDefinitionProvider(s,new xt(t))),u.references&&i.push(d.languages.registerReferenceProvider(s,new It(t))),u.documentSymbols&&i.push(d.languages.registerDocumentSymbolProvider(s,new At(t))),u.rename&&i.push(d.languages.registerRenameProvider(s,new Et(t))),u.colors&&i.push(d.languages.registerColorProvider(s,new Mt(t))),u.foldingRanges&&i.push(d.languages.registerFoldingRangeProvider(s,new Ct(t))),u.diagnostics&&i.push(new dt(s,t,e.onDidChange)),u.selectionRanges&&i.push(d.languages.registerSelectionRangeProvider(s,new Ft(t))),u.documentFormattingEdits&&i.push(d.languages.registerDocumentFormattingEditProvider(s,new Pt(t))),u.documentRangeFormattingEdits&&i.push(d.languages.registerDocumentRangeFormattingEditProvider(s,new Dt(t)))}return a(),r.push(qe(i)),qe(r)}function qe(e){return{dispose:()=>Ze(e)}}function Ze(e){for(;e.length;)e.pop().dispose()}export{gt as CompletionAdapter,xt as DefinitionAdapter,dt as DiagnosticsAdapter,Mt as DocumentColorAdapter,Pt as DocumentFormattingEditProvider,wt as DocumentHighlightAdapter,Nt as DocumentLinkAdapter,Dt as DocumentRangeFormattingEditProvider,At as DocumentSymbolAdapter,Ct as FoldingRangeAdapter,mt as HoverAdapter,It as ReferenceAdapter,Et as RenameAdapter,Ft as SelectionRangeAdapter,ut as WorkerManager,k as fromPosition,Qe as fromRange,Ot as setupMode,m as toRange,D as toTextEdit};
