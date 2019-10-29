

//A neuronetwork looks like this:
// activation(((x*W) + b)) = output

//A forward propagation looks like this:
//   layer3(layer2(layer1(x)))
//initialization can be random, or 1
var initialization_scheme = "random";
//normalization can be gaussian normalize or none
var normalization_scheme = "none";
function gaussain(array){
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
    return 1/(1+Math.pow(Math.E,-t));
}
var FullyConnectedLayer = function(input_shape,num_nodes,activation){
    var self = {};
    self.input_shape = input_shape;
    self.num_nodes = num_nodes;
    self.activation = activation;
    self.weights = [[]];
    self.initialize_weights = function(){
	//initialize n by x matrix;
	for(i=0;i<self.num_nodes;i++){
	    for(j=0;j<self.input_shape;i++){
		if(initialization_scheme=="random")
		    self.weights[i][j] = Math.random();
	    }
	}
    };
    return self;
}
var NN = {};
NN.propagate()
NN.Layers.add(FullyConnectedLayer(5,

