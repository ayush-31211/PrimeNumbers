const algorithm = require('./algorithm.js')
const express = require('express');
const bodyParser = require('body-parser');
const http=require('http')
const mongoose = require('mongoose');
const {performance} = require('perf_hooks');
const app = express();



app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

app.set('view engine', 'ejs');


///////////////////////////////////     Database     ////////////////////////////////////

var dburl="mongodb+srv://Ayush:Ayush@123@cluster0.pwkof.mongodb.net/PrimeNumbers?retryWrites=true&w=majority";

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(dburl,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })


//Database Schema

const generationSchema={
   startingNumber: Number,
   endingNumber: Number,
   algorithm: String,
   noOfPrime: Number,     
   date: Object, 
   exeTime: Number,
};



const Prime = mongoose.model('prime',generationSchema);


///////////////////////////////////     Server     ////////////////////////////////////

var primenos=[],warning="",currUrl="";        //initializing list and warning message

app.route('/').
get(function (req,res){
    if(currUrl==="")                // get the current working Url
    {
        currUrl=req.protocol+"://"+req.get('host')+req.originalUrl;
        console.log(currUrl);
    }
    res.render('index',{arr:primenos,warning:warning});
    primenos=[],warning="";
})
.post(function(req,res){
    if(Number(req.body.num1)>Number(req.body.num2))
    {
        warning='Starting Number is greater than Ending Number';
        res.redirect('/');
    }
    else{
        var urll=currUrl+'primegenerator/'+req.body.num1+'/'+req.body.num2+'/'+req.body.algo;
        http.get(urll,function(response){
            response.on('data',function(data){
                let result=JSON.parse(data);
                
                /* Checking for errors */
                if(typeof(result.arr)==='string')
                    warning=result.arr;
                else
                    primenos=result.arr;
                
                res.redirect("/")
            })
        })
    }
});


app.get('/primegenerator',function(req,res){
    let getApiUrl = req.protocol + "://" + req.get('host') + "" + req.originalUrl.split('?')[0] + "/";
    console.log(getApiUrl);
    res.render('getApi',{url:getApiUrl});
})


///////////////////////////////////     API     ////////////////////////////////////

app.route("/primegenerator/:num1/:num2/:algo")

.get(function(req,res){
    var num1=req.params.num1,
    num2=req.params.num2,
    algo=req.params.algo;

    let t1=performance.now();   //to get timelapsed

    if(algo==='Native')
        primes=algorithm.brute(Number(num1),Number(num2));
    else if(algo==='Sieve')
        primes=algorithm.sieve(Number(num1),Number(num2));
    else 
        primes=algorithm.recursive(Number(num1),Number(num2));
    
    /* Checking for Error */
    if(typeof(primes)==='string'){
        res.send({
            arr: primes,
        })
    }
    else{
        /** posting to database */
        const newGenerator=new Prime({
            startingNumber: Number(num1),
            endingNumber: Number(num2),
            algorithm: algo,
            noOfPrime: primes.length,        
            date: new Date(),
            exeTime: performance.now()-t1,
        })
        newGenerator.save();
        
        res.send({
            arr:primes,
        })
    }
});


const Port = process.env.PORT || 3000;

app.listen(Port, function () {
  console.log("Server Started");
  console.log(Port);
});
