var initialization_scheme = "random";
var normalization_scheme = "none";
function gaussian(array){
    var mean = 0;
    var mean_of_the_squares = 0;
    var std = 0;
    var array_size = 0;
    for(i=0;i<array.length;i++){
	for(j=0;j<array[i].length;j++){
	    mean+= array[i][j];
	    mean_of_the_squares += Math.pow(array[i][j],2);
	    array_size ++;
	}
    }
    mean = mean/array_size;
    mean_of_the_squares = mean_of_the_squares/array_size;
    std = Math.sqrt(mean_of_the_squares - Math.pow(mean,2));
    for(i=0;i<array.length;i++){
	for(j=0;j<array[i].length;j++){
	    array[i][j] = (array[i][j] - mean)/std;
	}
    }
    return array;
}
function normalize(array){
    var max = 0;
    for(i=0;i<array.length;i++){
	for(j=0;j<array[i].length;j++){
	    if(array[i][j]>max){
		max = array[i][j];
	    }
	}
    }
    for(i=0;i<array.length;i++){
	for(j=0;j<array[i].length;j++){
	    if(array[i][j]>max){
		array[i][j] = array[i][j]/max;
	    }
	}
    }
}
function sigmoid(t){
    var delta = 0.001;
    for(i=0;i<t.length;i++){
        t[i] = 1/(1+Math.pow(Math.E,-t[i]))+delta;
    }
    return t;
}
var FullyConnectedLayer = function(input_shape,num_nodes,activation){
    var self = {};
    self.input_shape = input_shape;
    self.num_nodes = num_nodes;
    self.activation = activation;    
    self.initialize_weights = function(){
    //initialize n by x matrix;
    self.weights = new Array(input_shape).fill(new Array(num_nodes).fill(0));
    self.biases = new Array(input_shape).fill(new Array(num_nodes).fill(0));        
    if(initialization_scheme=="random"){
	for(i=0;i<self.input_shape;i++){
	    for(j=0;j<self.num_nodes;j++){
            self.weights[i][j] = Math.random();
            self.biases[i][j] = Math.random();
        }
    }
    }
    normalize(self.weights);
    normalize(self.biases);
    };
    self.compute_activation = function(Input,debug){
        var output = [];    
        for(i=0;i<self.input_shape;i++){
            for(j=0;j<self.num_nodes;j++){
                if(debug){
                    console.log(self.weights);
                    console.log(self.input_shape);
                }
                output[j] = self.weights[i][j] * Input[j] + self.biases[i][j];
            }
        }
        if(self.activation=="sigmoid"){
            return sigmoid(output);
        }
    }
    self.get_weight_and_bias = function(){
        return [self.weights,self.biases];
    }
    self.load_weight_and_bias = function(weight,bias){
        //self.weights = new Array(input_shape).fill(new Array(num_nodes).fill(0));
       // self.biases = new Array(input_shape).fill(new Array(num_nodes).fill(0));        
        self.weights = weight;
        self.biases = bias;
        //normalize(self.weights);
        //normalize(self.biases);
    }
    return self;
}
var Neuronetwork = function(){
    var self = {};
    self.Layers = [];
    self.propagate = function(Input,debug){
        var x = Input;
        for(layer=0;layer<NN.Layers.length;layer++){
            x = self.Layers[layer].compute_activation(x,debug);
        }
        return x;
    }
    self.get_all_weights_and_biases = function(){
        //instead of a massive weight matrix you have a separated weight?
        var weightsandbiases =[];
        for(layer=0;layer<NN.Layers.length;layer++){
            var wab = self.Layers[layer].get_weight_and_bias();
            weightsandbiases.push(wab);
        }
        return weightsandbiases;
    }
    self.load_weights_and_biases = function(wab){
        for(layer=0;layer<NN.Layers.length;layer++){
            self.Layers[layer].load_weight_and_bias(wab[layer][0],wab[layer][1]);
        }
    }
    return self;
}










