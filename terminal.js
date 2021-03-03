const readline = require("readline");
const algo = require("./algorithm");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter Starting Number - ", function(num1) {
    rl.question("Enter Ending Number - ", function(num2) {
        rl.question("Enter the Name of algorithm ( Native / Recursive / Sieve ) - ",function(algorithm){
            var ans = "Invalid Input";
            if(algorithm==='Native')
                ans=algo.brute(Number(num1),Number(num2));
            else if(algorithm==='Recursive')
                ans=algo.recursive(Number(num1),Number(num2));
            else if(algorithm==='Sieve')
                ans=algo.sieve(Number(num1),Number(num2));
            console.log(ans);
            rl.close();
        });
    });
});

rl.on("close", function() {
    console.log("\n");
    process.exit(0);
});