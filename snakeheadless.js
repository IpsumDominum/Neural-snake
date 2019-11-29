/////////////////////////////////////////////////// just some stuff
var grid = 16;
var count = 0;
var snake = {
  x: 10,
  y: 10,
  dx: 1,
  dy: 0,
  cells: [],
  maxCells: 2
};
var apple = {
  x: 20,
  y: 20
};
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function reset_snake(){
        snake.x = 10;
        snake.y = 10;
        snake.cells = [];
        snake.maxCells = 3;
        snake.dx = 1;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25);
        apple.y = getRandomInt(0, 25);
}
var directions = {"top":[0,-1],
                  "left":[-1,0],
                  "right":[1,0],
                  "bottom":[0,1],
                  "topleft":[-1,1],
                  "bottomleft":[-1,-1],
                  "bottomright":[1,-1],
                  "topright":[1,1]};
var snake_direction = [1,0];
var snake_directionidx = 2;
var count = 0;
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
function argMax(array) {
  return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
var action_table = {0:"top",
                    1:"left",
                    2:"right",
                    3:"bottom",
                    4:"topleft",
                    5:"topright",
                    6:"bottomleft",
                    7:"bottomright"};
var sensory_input = new Array(24).fill(0);
///////////////////////////////////////////////////////////////
///                 Hyperparameters
/////////////////////////////////////////////

var maxpop = document.getElementById('maxpop');
var muta_rate = document.getElementById('muta_rate');
var crossy_rate = document.getElementById('crossy_rate');
var elyeet_size = document.getElementById('elite_rate')
var exo_rate = document.getElementById('exo_rate');
max_population_size = 0;
elite_size = 0;
mutation_rate = 0;
cross_rate = 0;
excess_offspring_size = 0;
excess_rate = 0;
function load_hypo(){
  max_population_size = Number.parseInt(maxpop.value);
  elite_size = Number.parseInt(elyeet_size.value);
  mutation_rate = Number.parseFloat(muta_rate.value);
  cross_rate = Number.parseFloat(crossy_rate.value);
  excess_rate = Number.parseFloat(exo_rate.value);
  excess_offspring_size = (max_population_size-elite_size) * excess_rate;
}
////////////////////////////////////////////
////////////////////////////////////////////
current_rollout = 0;
cross = true;
mutation = true;
load_hypo();
console.log(excess_offspring_size);
var fitness_history = [];
var population = get_new_pop(max_population_size);
var roll_out_idx = 0;
var NN = population[roll_out_idx];
var pop_fitness = {};
var fitness = 0;
//sensory_input : 8 directions, 3 channels [distance to wall, distance to food,distance to tail]
/////////////////////////////////////////////
////////////////////////////////////////
//    part of the population with the largest
//    fitness gets to reproduce, with percentage
//    of mutation.
//    also bring randomly 100 population of 'new blood'
//    which is 
//
//
///////////////////////////////////
function get_new_pop(pop_size,initialize_weights=true){
  var population =[];
  for(i=0;i<pop_size;i++){
    population[i] = Neuronetwork();
  }
  for(var pop in population){
    var L1 = FullyConnectedLayer(24,10,"sigmoid");
    var L2 = FullyConnectedLayer(10,8,"sigmoid");
  if(initialize_weights){
    L1.initialize_weights();
    L2.initialize_weights();
  }
    population[pop].Layers.push(L1);
    population[pop].Layers.push(L2);
  }
  return population;
}
function get_elites(population_yup,population_yeet){
    var global_elites = [];
    var idx  = 0;
    for(var pop in population_yup){
      if(global_elites.length<elite_size){
          var elite = {value:idx,
                       weight:population_yup[pop],
                       network:population_yeet[pop]};
          global_elites.push(elite);
          idx +=1;
      }else{
        for(i=global_elites.length-1;i>=0;i--){    
          var cur_value = global_elites[i].weight;
          if(cur_value>=population_yup[pop]){
              if(i==global_elites.length-1){
                  break;
              }else{
                  var elite = {value:i+1,
                              weight:population_yup[pop],
                              network:population_yeet[pop]}
                  global_elites[i+1] = elite;
                break;
              }
          }else{
            if(i!=global_elites.length-1){
              global_elites[i+1] = global_elites[i];
            }
            if(i==0){
                var elite = {value:0,
                              weight:population_yup[pop],
                              network:population_yeet[pop]}
                global_elites[0] = elite;
                }
          }          
        }
      }     
    }
     console.log("Best fitness:")
    console.log(global_elites[0].weight);
    console.log(global_elites[1].weight);
    console.log(global_elites[2].weight);
    console.log(global_elites[3].weight); 
    console.log(global_elites[4].weight); 
    console.log(global_elites[5].weight); 
    console.log(global_elites[6].weight); 
    console.log(global_elites[7].weight); 
    console.log(global_elites[8].weight); 
    console.log(global_elites[9].weight); 
    return global_elites;
}
function cross_over(wab1,wab2){  
  //First half cross
  for(layer=0;layer<wab1.length;layer++){    
      for(n=0;n<wab1[layer][0].length;n++){
        for(gene=0;gene<wab1[layer][0][n];gene++){
            if(mutation){
              //mutate individual gene
                if(Math.random()<mutation_rate){
                  wab1[layer][0][n][gene] = wab1[layer][0][n][gene]+ Math.random();
                }//mutate weight
                if(Math.random()<mutation_rate){
                  wab1[layer][1][n][gene] = wab1[layer][1][n][gene] + Math.random();
                }//mutate bias
                //Do the same for wab2
                if(Math.random()<mutation_rate){
                  wab2[layer][0][n][gene] = wab2[layer][0][n][gene] + Math.random();
                }//mutate weight
                if(Math.random()<mutation_rate){
                  wab2[layer][1][n][gene] = wab2[layer][1][n][gene] + Math.random();
                }//mutate bias
            }
            if(cross){
                if(Math.random()>cross_rate){
                  //cross over weights
                  wab1[layer][0][n][gene] = (wab1[layer][0][n][gene] + wab2[layer][0][n][gene])/2;
                }
                if(Math.random()>cross_rate){
                  //cross over bias
                  wab1[layer][1][n][gene] = (wab1[layer][1][n][gene] + wab2[layer][1][n][gene])/2;
                }
            }
    }
    }
  }
  //Then smuge cross
  return wab1;
}
function get_offsprings(parents){
  off_spring_size = max_population_size-elite_size;
  off_springs = get_new_pop(off_spring_size);
  for(i=0;i<(off_spring_size-excess_offspring_size);i++){
    var parent1 = random_sample(parents);
    var parent2 = random_sample(parents);
    wab1 = parents[parent1].network.get_all_weights_and_biases();
    wab2 = parents[parent2].network.get_all_weights_and_biases();
    offspring_wab= cross_over(wab1,wab2);
    off_springs[i].load_weights_and_biases(offspring_wab);
  }
  parents.forEach(function(parent, index) {
    off_springs[off_spring_size+index] = parent.network;
  });
  return off_springs;
}

function random_sample(samples){
  let sample =
    Math.random() *
    samples.reduce((sum, { weight }) => sum + weight, 0);
  // first sample n where sum of weight for [0..n] > sample
  const { value } = samples.find(
    ({ weight }) => (sample -= weight) < 0
  );
  return value;
}
//////////////////////////// Population loop///////////////
animating = false;
var info  = document.getElementById('info');
var inforollout  = document.getElementById('inforollout');
var infofitness  = document.getElementById('infofitness');
var buttonshowbest = document.getElementById('showbest');
function next_roll_out(){
  info.innerHTML = "Info: Rolling out...";
  buttonshowbest.style.display="none";
  best_snake = roll_out();  
  animate_NN = best_snake.network;
  infofitness.innerHTML = "Best_fitness: " + best_snake.weight;
  inforollout.innerHTML = "RolloutNum: " + current_rollout.toString();
  info.innerHTML = "Info:";
  buttonshowbest.style.display="inline-block";
}
function animate_snake(){
  if(animating){
    return;
  }else{
    animating = true;
  }
  requestAnimationFrame(loop);
}

function change_pop(ele){
  if(ele.innerHTML=="-"){
    if(max_population_size>0 ){
      max_population_size -= 100;
      maxpop.value = max_population_size.toString();
    }
  }else if(ele.innerHTML=="+"){
    if(max_population_size<10000 ){
      max_population_size += 100;
      maxpop.value = max_population_size.toString();
    }
  }
  excess_offspring_size = (max_population_size-elite_size) *excess_rate;
}
function change_elite(ele){
  if(ele.innerHTML=="-"){
    if(elite_size>0 ){
      elite_size -= 10;
      elyeet_size.value = elite_size.toString();
    }
  }else if(ele.innerHTML=="+"){
    if(elite_size<max_population_size ){
      elite_size += 10;
      elyeet_size.value = elite_size.toString();
    }
  }
  excess_offspring_size = (max_population_size-elite_size) *excess_rate;
}
function change_muta(ele){
  if(ele.innerHTML=="-"){
    if(mutation_rate>0){
      mutation_rate -= 0.05; 
      if(mutation_rate<0){
        mutation_rate =0;
      }
      muta_rate.value = mutation_rate.toString();

    }
  }else if(ele.innerHTML=="+"){
    if(mutation_rate<1){
      mutation_rate += 0.05; 
      if(mutation_rate>1){
        mutation_rate =1;
      }
      muta_rate.value = mutation_rate.toString();
    }
  }
}
function change_crossy(ele){
  if(ele.innerHTML=="-"){
    if(cross_rate>0){
      cross_rate -= 0.05; 
      if(cross_rate<0){
        cross_rate =0;
      }
      crossy_rate.value = cross_rate.toString();

    }
  }else if(ele.innerHTML=="+"){
    if(cross_rate<1){
      cross_rate += 0.05; 
      if(cross_rate>1){
        cross_rate =1;
      }
      crossy_rate.value = cross_rate.toString();
    }
  }  
}
function change_excess(ele){
  if(ele.innerHTML=="-"){
    if(excess_rate>0){      
      excess_rate -= 0.05; 
      if(excess_rate<0){
        excess_rate =0;
      }
      exo_rate.value = excess_rate.toString();

    }
  }else if(ele.innerHTML=="+"){
    if(excess_rate<1){
      excess_rate += 0.05; 
      if(excess_rate>1){
        excess_rate =1;
      }
      exo_rate.value = excess_rate.toString();
    }
  }
  excess_offspring_size = (max_population_size-elite_size) *excess_rate;
}
function roll_out(){

  while(true){
      console.log("rollout"+current_rollout.toString());
      if(roll_out_idx>=population.length-1){
        //sample up to population size
        //Roll out next population,
        //get elites
        //cross over elites to produce 
        //chance of mutation
        var elites = get_elites(pop_fitness,population);
        var offsprings = get_offsprings(elites);
        population = offsprings;      
        fitness_history.push(pop_fitness);      
        pop_fitness = {};
        roll_out_idx = 0;
        NN = population[roll_out_idx];
        current_rollout+=1;
        return elites[0];
      }      
    snake.x += snake.dx;
    snake.y += snake.dy;
    fitness += 1;
    if (snake.x < 0 ||snake.x >= 25||snake.y < 0||snake.y >= 25) {
        reset_snake();
        pop_fitness[roll_out_idx] = fitness;
        fitness = 0;
        roll_out_idx ++;
        if(roll_out_idx<population.length){
            NN = population[roll_out_idx];
        }
        }
      snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }
    //map[apple.x][apple.y] = 1;
    snake.cells.forEach(function(cell, index) {
    //  map[cell.x][cell.y] = 2;
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        fitness += 5;
        apple.x = getRandomInt(0, 25) ;
        apple.y = getRandomInt(0, 25) ;
      }
      for (var i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          reset_snake();
          pop_fitness[roll_out_idx] = fitness;
          fitness = 0;
          roll_out_idx ++;
        if(roll_out_idx<population.length){
            NN = population[roll_out_idx];
        }
        }
      }
    });
    
    ////////////////////////////////
    ///////////////////////////////
    ////Look in to all directions, for wall, food, and itself
    direction_idx = 0;
    for(var d in directions){
          var direction = directions[d];
          var dist = 0;
          var lookaheadx = snake.x+direction[0]*dist;
          var lookaheady = snake.y +direction[1]*dist;        
          while(true){            
            dist += 1;
            lookaheadx += direction[0];
            lookaheady += direction[1]; 
            if(lookaheadx==apple.x &&lookaheady==apple.y){
                sensory_input[1+direction_idx*3] = dist;
            }
            if(lookaheadx >= 25 || 
              lookaheadx <= 0 ||
              lookaheady >=25||
              lookaheady <=0){
                //that means we have hit a wall with our senses
                sensory_input[direction_idx*3] = dist;
                break;
            }                      
          }
        direction_idx+=1;
    }

        //get distance to itself, from the direction it is heading to.
        var lookaheadx = snake.x+snake_direction[0]*i;
        var lookaheady = snake.y +snake_direction[1]*i;
        var dist = 0;
        while(true){
        dist +=1;
        lookaheadx += snake_direction[0];                                                         
          lookaheady += snake_direction[1];
            for(i=snake.cells.length-1;i>0;i++){
            var cell = snake.cells[i];
              if(lookaheadx ==cell.x&& lookaheady==cell.y){
              sensory_input[2*snake_directionidx] = dist;
                break;
              }
              break;
            }
            if(lookaheadx >= 25 || 
              lookaheadx <= 0 ||
              lookaheady >=25||
              lookaheady <=0){
                break;
            }            
          }

  var result = argMax(NN.propagate(sensory_input,debug=false));
  var action = action_table[result];
  snake_direction = directions[action];
  snake_directionidx = result;
  snake.dx = snake_direction[0];
  snake.dy = snake_direction[1]; 
  }
}
////////////////////////////////////////////////////////////////////////
/////////////////////////////////Animation ////////////////////////////
////////////////////////////////////////////////////////////////////////
  step_counter = 0;
  function loop(){
    step_counter +=1;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = 'red';
    context.fillRect(apple.x*grid, apple.y*grid, grid-1, grid-1);
    snake.x += snake.dx;
    snake.y += snake.dy;
    fitness += 1;
    if (snake.x < 0 ||snake.x >= 25||snake.y < 0||snake.y >= 25) {
      animating = false;
        return;
    }
    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }
    snake.cells.forEach(function(cell, index) {
    context.fillStyle = 'green';
    context.fillRect(cell.x*grid, cell.y*grid, grid-1, grid-1);  
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;
        fitness += 50;
        apple.x = getRandomInt(0, 25) ;
        apple.y = getRandomInt(0, 25) ;
      }
      for (var i = index + 1; i < snake.cells.length; i++) {
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          animating = false;
            return;
        }
      }
    });
    ////////////////////////////////
    ///////////////////////////////
    ////Look in to all directions, for wall, food, and itself
    direction_idx = 0;
    for(var d in directions){
          var direction = directions[d];
          var dist = 0;
          var lookaheadx = snake.x+direction[0]*dist;
          var lookaheady = snake.y +direction[1]*dist;        
          while(true){            
            dist += 1;
            lookaheadx += direction[0];
            lookaheady += direction[1]; 
            if(lookaheadx==apple.x &&lookaheady==apple.y){
                sensory_input[1+direction_idx*3] = dist;
            }
            if(lookaheadx >= 25 || 
              lookaheadx <= 0 ||
              lookaheady >=25||
              lookaheady <=0){
                //that means we have hit a wall with our senses
                sensory_input[direction_idx*3] = dist;
                break;
            }                      
          }
        direction_idx+=1;
     }
  
        //get distance to itself, from the direction it is heading to.
        var lookaheadx = snake.x+snake_direction[0]*i;
        var lookaheady = snake.y +snake_direction[1]*i;
        var dist = 0;
        while(true){
         dist +=1;
         lookaheadx += snake_direction[0];                                                         
          lookaheady += snake_direction[1];
            for(i=snake.cells.length-1;i>0;i++){
            var cell = snake.cells[i];
              if(lookaheadx ==cell.x&& lookaheady==cell.y){
               sensory_input[2*snake_directionidx] = dist;
                break;
              }
              break;
            }
            if(lookaheadx >= 25 || 
              lookaheadx <= 0 ||
              lookaheady >=25||
              lookaheady <=0){
                break;
            }            
          }
  
  var result = argMax(animate_NN.propagate(sensory_input,debug=false));
  var action = action_table[result];
  snake_direction = directions[action];
  snake_directionidx = result;
  snake.dx = snake_direction[0];
  snake.dy = snake_direction[1]; 
requestAnimationFrame(loop);
    }

  
  