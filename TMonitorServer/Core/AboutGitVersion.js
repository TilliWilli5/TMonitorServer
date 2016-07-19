console.log("AboutGitVersion Required");
module.exports = (pCallback)=>{
    require("child_process").exec("git log -1", (pError, pSTDout, pSTDerr)=>{
        if(pError)
            pCallback(pSTDerr);
        else
            pCallback(pSTDout);
    });
};