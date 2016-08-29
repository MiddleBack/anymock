/**
 * Created by tanxiangyuan on 16/8/18.
 */
import ProxyDef from '../models/ProxyDef';

ProxyDef.saveDef({
    globalProxy:false,
    clearCache:true
});
setTimeout(()=>{
    console.log(ProxyDef.getCurrentDef());
},1000);
