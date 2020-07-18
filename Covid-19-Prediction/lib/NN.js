function sigmoid(x){
    return 1/(1 + Math.exp(-x));
}


class NeuralNetwork{
    constructor(in_Nodes,hid_Nodes,out_Nodes){
        this.in_Nodes = in_Nodes;
        this.hid_Nodes = hid_Nodes;
        this.out_Nodes = out_Nodes;

        this.weights_ih = new Matrix(this.hid_Nodes,this.in_Nodes); //weigths between input and hidden layer
        this.weights_ho = new Matrix(this.out_Nodes,this.hid_Nodes); //weights between hidden layer and output layer
        this.weights_ho.randomize(); //randomly putting matrix values
        this.weights_ih.randomize();

        this.bias_hid = new Matrix(this.hid_Nodes,1);
        this.bias_out = new Matrix(this.out_Nodes,1);

        this.bias_hid.randomize();
        this.bias_out.randomize();
    }
    feedForward(inputArray){
        //inputs convertion to matrix
        let inputs = Matrix.arrayToMatrix(inputArray);
        inputs.print();
        //Gen hidden outputs
        let hid = Matrix.multiply(this.weights_ih,inputs);
        hid.add(this.bias_hid);
        //Activation fucntion
        hid.map(sigmoid);
        hid.print();
        //Gen output from hid matrix
        let output = Matrix.multiply(this.weights_ho,hid);
        output.add(this.bias_out);
        output.map(sigmoid);
        output.print();

        let geuss = output.matrixToArray(); //convertion form matrix to array

        return geuss;
    }



    // ordLeastSquare(input){

    //     let xsum = 0;
    //     let ysum = 0;
    
    //     for(let i = 0; i< input.length;i++){
    //         xsum += input[i].x;
    //         ysum += input[i].y;
    //     }
    
    //     let xmean = xsum / input.length;
    //     let ymean = ysum / input.length;
    //     let Nr = 0;
    //     let Dr = 0;
    
    //     for(let i = 0;  i<input.length; i++){
    //         let x = input[i].x;
    //         let y = input[i].y;
    //         Nr+=(x- xmean) * (y - ymean);
    //         Dr+= Math.pow((x - xmean),2);
    
    //     }
    //     let m = Nr/Dr;
        
    //     let c = input[0].y - (m * input[0].x) ;
        
        
    //     let output = [m,c];
    
    //     return output;
    
    
    //    }
}
