module.exports = class PolynomialRegression{
    constructor(){
        this.inputs = null;
        this.c = 0;
        this.a = 0;
        this.b = 0;
        this.learningRate = 0.0000000001; //0.000000003;
        this.lossHistory = [];
    }

    addModel(a,b,c){
        this.a = a;
        this.b = b;
        this.c = c;
    }

    addInputs(inputs){
        this.inputs = inputs;
    }

    predict(x){
        if(this.a  != 0 && this.b != 0 && this.c != 0){
            return (this.a*Math.pow(x,2)) + (this.b * x) + this.c;
        }else{
            return 'Error please enter a,b,c  values';
        }
    }
    static predict(len,a,b,c){
        let resultAr = [];
        if(a  != 0 && b != 0 && c != 0 && len > 0){
            for(let i = 0; i<len;i++){
                let x = i + 1;
                resultAr.push((a*Math.pow(x,2)) + (b * x) + c);
            }
        }else{
            return 'Error,please pass all variables '
        }
        console.log(resultAr);
        return resultAr;
    }

    calcLoss(){
        if(this.inputs != null){
            let lenInputs = this.inputs.length;
            let totalError = 0;
            for(let i = 0; i < lenInputs; i++){
                let temp = Object.values(this.inputs[i])
                let x = i + 1;
                let y = temp[1];
                let geuss = (this.a*Math.pow(x,2)) + (this.b * x) + this.c;
                totalError += Math.pow((y - geuss),2);
            }
            return totalError;
        }else{
            console.log('No Inputs');
            return undefined;
        } 
    }

    printLoss(){
        //console.log(this.lossHistory);
        console.log(`A-Value: ${this.a} B-Value: ${this.b}  C-Value: ${this.c}  Loss: ${this.lossHistory[this.lossHistory.length -1]} `)   
    }

    updateWeights(){
        let aDeriv = 0;
        let bDeriv = 0;
        let cDeriv = 0;
        let lenInputs = this.inputs.length;

        for(let i = 0; i < lenInputs;i++){
             let temp = Object.values(this.inputs[i]);
            let x = i + 1;
            let y = temp[1];
            let geuss =(this.a*Math.pow(x,2)) + (this.b * x) + this.c;
            let error = (y - geuss);
            bDeriv = ( x * error) * this.learningRate;
            aDeriv = (2*x*error) * this.learningRate;
            cDeriv = error * this.learningRate;
            this.b += bDeriv;
            this.a += aDeriv;
            this.c = cDeriv;
        }
    }

    train(iterations){
        let loss = 0;

        for(let i = 0; i < iterations; i++){
            this.updateWeights();

            //Calculate to audit after
            loss = this.calcLoss();
            if(loss == Infinity){
                console.log('zero');
            }
            this.lossHistory.push(loss);


            if(i % 100){
                //console.log(`Loss: ${loss} `);
            }

        }
    }
}