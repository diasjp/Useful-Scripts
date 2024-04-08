var q = "task=f10f01dc1b780d10decedca19b4bcbb7^ORtask=cbe3ad2fdb17881812975408f496192b";

gs.print(parseQuery(q));

function parseQuery(q) {

    var answer = -1;

    //place encoded query into array 
    var q_array = q.split("^");

    for (var i = 0; i < q_array.length; i++) {

        //each iteration of query , split into parts , if we find task, bring back the value
        var parts = q_array[i].split("=");
        var key = parts[0];
        var value = parts[1];

        if (key === "task") {

            answer = value;
            break;
        }

        //gs.print(key);
        //gs.print(value);
    }

    return answer
}