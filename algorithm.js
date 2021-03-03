const {performance} = require('perf_hooks');            // To moniter execution time


/////////////////////////////////////////// Native/Brute Algorithm ///////////////////////////////////////////
const bruteUtil= (a,b)=>{
    
    let startTime=performance.now();
    let arr=[];
    
    for(let i=a;i<=b;i++)
    {
        let flag=(i>1)?true:false;
        for(let j=2;j<i;j++)
        {
            if(i%j===0)
            flag=false;
        }
        if(flag)
        arr.push(i);
        
        if(performance.now()-startTime>500)              //Checking Time Limit Exceeded
        throw {message:"Time Limit Exceeded"};
        
    }
    
    return arr;
    
}


/////////////////////////////////////////// Recursive Algorithm ///////////////////////////////////////////


function recursiveUtilUtil(a,n,startTime)
{
    if(performance.now()-startTime>500)
    throw {message:"Time Limit Exceeded"}
    if(n===1)
    return true;
    
    if(a%n===0)
    return false;
    
    return recursiveUtilUtil(a,n-1,startTime);
}

const recursiveUtil= (a,b)=>{
    let startTime=performance.now();

    let arr=[];
    for(let i=a;i<b;i++)
    if(recursiveUtilUtil(i,i-1,startTime))
    arr.push(i);
    return arr;
}


/////////////////////////////////////////// Sieve Algorithm ///////////////////////////////////////////



const sieveUtil= (a,b)=>{

    if(b>10000)                                                  // Checking range error
    throw {message:'Range too large'};
    let startTime=performance.now();


    let arr=Array.apply(null, Array(100001)).map(function (x, i) { return (i>1)?true:false; })

    for(let i=2;i<=100000;i++)
    {
        if(arr[i])
        {
            for(let j=i+i;j<100001;j+=i)
            {
                arr[j]=false;
                
                if(performance.now()-startTime>500)
                throw {message:'Time Limit Exceeded'};
            }
        }
    }
    
    let res=[];
    for(let i=a;i<=b;i++)
    {
        if(arr[i])
        res.push(i);
    }
    return res;

 }

 function brute(a,b)
 {
     try{

         return bruteUtil(a,b)
     }
     catch(err){
         return (err.message) 

     }
 }

 function recursive(a,b)
 {
     try{

         return recursiveUtil(a,b)
     }
     catch(err){
         return (err.message) 

     }
 }

 function sieve(a,b)
 {
     try{

         return sieveUtil(a,b)
     }
     catch(err){
         return (err.message) 

     }
 }





 module.exports={
     brute,
     recursive,
     sieve,    
 }