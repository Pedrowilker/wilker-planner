const http=require("http"),fs=require("fs"),path=require("path"),{exec}=require("child_process");
const ROOT=__dirname,PORT=8080,DATA_DIR=path.join(ROOT,"data"),DATA_FILE=path.join(DATA_DIR,"wilker-planner.json");
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8"};
const DEFAULT={tasks:[],finances:[],investments:[],budgets:{},goals:[],bills:[],studySessions:[],settings:{studyHours:2}};
function ensure(){if(!fs.existsSync(DATA_DIR))fs.mkdirSync(DATA_DIR,{recursive:true});if(!fs.existsSync(DATA_FILE))fs.writeFileSync(DATA_FILE,JSON.stringify(DEFAULT,null,2),"utf8")}
function readState(){ensure();try{return JSON.parse(fs.readFileSync(DATA_FILE,"utf8"))}catch{return DEFAULT}}
function writeState(obj){ensure();const tmp=DATA_FILE+".tmp";fs.writeFileSync(tmp,JSON.stringify(obj,null,2),"utf8");fs.renameSync(tmp,DATA_FILE)}
function send(res,status,type,body){res.writeHead(status,{"Content-Type":type,"Cache-Control":"no-store"});res.end(body)}
function json(res,status,obj){send(res,status,MIME[".json"],JSON.stringify(obj))}
function serve(req,res){let p=decodeURIComponent((req.url||"/").split("?")[0]);if(p==="/"||!path.extname(p))p="/index.html";const file=path.join(ROOT,p);if(!file.startsWith(ROOT)){return send(res,403,"text/plain; charset=utf-8","Forbidden")}fs.readFile(file,(err,data)=>{if(err)return send(res,404,"text/plain; charset=utf-8","Not found");send(res,200,MIME[path.extname(file).toLowerCase()]||"application/octet-stream",data)})}
const app=http.createServer((req,res)=>{
 if(req.method==="GET"&&req.url.startsWith("/api/state"))return json(res,200,readState());
 if(req.method==="PUT"&&req.url.startsWith("/api/state")){let body="";req.on("data",c=>{body+=c});req.on("end",()=>{try{const obj=JSON.parse(body);writeState(obj);json(res,200,{ok:true,savedAt:new Date().toISOString()})}catch{json(res,400,{ok:false,error:"JSON inválido"})}});return}
 if(req.method==="GET"&&req.url==="/api/health")return json(res,200,{ok:true,service:"wilker-planner",storage:"local-json"});
 serve(req,res)
});
ensure();app.listen(PORT,"127.0.0.1",()=>{const url="http://127.0.0.1:"+PORT;console.log("WILKER Planner rodando em "+url);if(process.platform==="win32")exec('start "" "'+url+'"')});
