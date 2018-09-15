var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var path = require('path');
app.use(express.static(__dirname+'/public/dist/public'));

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/basic_mongoose') , { useNewUrlParser: true }

var RateSchema = new mongoose.Schema({
    rating: {type: Number, required:true},
    comment: {type: String, required:true},
    },{timestamps: true})

var CakeSchema = new mongoose.Schema({
    name: {type: String, required:true},
    url: {type: String, required:true},
    rates: [RateSchema]
    },{timestamps: true})

mongoose.model('Rate', RateSchema);
var Rate = mongoose.model('Rate')
mongoose.model('Cake', CakeSchema);
var Cake = mongoose.model('Cake')

app.get('/allCakes', function(req, res){
    Cake.find({}, function(err, result){
        if(err){
            console.log("Error in Server .find()")
            res.json({message:"Error in Server .find()", error:err})
        }
        else{
            res.json({message:"Success", data:result})
        }
    })
})

app.post('/cake', function(req,res){
    if (req.body.name.length <=1){
        if (req.body.url.length ==0){
            res.json({status:"Both Error", message1:"Name is too short", message2:"URL is empty"})
        }
        else{
            res.json({status:"Name Error", message1:"Name is too short"})
        }
    }
    else if (req.body.url.length ==0){
        res.json({status:"Url Error", message2:"URL is empty"})
    }
    else{
        Cake.create(req.body, function(err, result){
            if(err){
                console.log("Error creating cake in server")
                res.json({message:"Error in Server", error:err})
            }
            else{
                console.log("Post works in Server Side", result)
                res.json({message:"Success", data:result})
            }
        })
    }
})

app.post('/cakeRate/:id', function(req,res){
    Rate.create(req.body, function(err, result){
        if(err){
            console.log("Error creating cake in server")
            res.json({message:"Server Error", error:err})
        }
        else{
            console.log("Post works in Server Side", result)
            Cake.updateOne({_id : req.params.id }, {$push:{rates: result}}, function(err){
                if(err){
                    console.log("Update Error error", err);
                    res.json({message: "Error", error: err})
                }
                else {
                    console.log('Updated Nicely')
                    res.json({message: "Success"})
                }
            })
        }
    })
})

app.get('/cake/:id', function(req, res){
    Cake.find({_id:req.params.id}, function(err, result){
        if(err){
            console.log("Error in Server .find()")
            res.json({message:"Error in Server .find()", error:err})
        }
        else{
            res.json({message:"Success", data:result})
        }
    })
})












app.post('/post', function(req, res){
    console.log(req.body)
    Cake.create(req.body, function(err, cake){
        if(err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err})
        }
        else {
            res.json({message: "Success", data: cake})
        }
    })

})

app.listen(8000, function() {
    console.log("listening on port 8000");
})