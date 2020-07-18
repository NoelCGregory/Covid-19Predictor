   //exampel of matrix lib
   // let m = new Matrix(2,3);   
   //  let m1 = new Matrix(3,3);
   //  m.randomize();
   //  m1.randomize();
   //  m.print();
   //  m1.print(); 
   //  let p = Matrix.multiply(m,m1);
   //  p.print();

class Matrix{
    constructor(rows,cols){
        this.rows = rows;
        this.cols = cols;
        this.data = Array(rows).fill(0).map(() => Array(cols).fill(0)); //creating empty 2d array with 0
    }
    randomize(){
        this.data = this.data.map((ar,i) =>ar.map((x,j) => x=Math.floor(Math.random() *2 -1))); //filling with random numbers
    }
    static transpose(n){
        let result = new Matrix(this.rows,this.cols);
        result.data = result.data.map((ar,i) =>ar.map((x,j) => x=n.data[j][i])); //converting rows to cols
        return result;
    } 
    add(n){
        if(n instanceof Matrix){
            //element matrix
            this.data = this.data.map((ar,i) =>ar.map((x,j) => x+=n.data[i][j])); //adding matrix
        }else{
            //scalar
            this.data = this.data.map((ar) =>ar.map((x) => x+=n));
        }
    }
    subtract(n){
        if(n instanceof Matrix){
            //element matrix
            this.data = this.data.map((ar,i) =>ar.map((x,j) => x-=n.data[i][j]));
        }else{
            //scalar
            this.data = this.data.map((ar) =>ar.map((x) => x-=n));
        }
    }
    multiply(n){
        if(n instanceof Matrix){
            //hadamard
            this.data = this.data.map((ar,i) =>ar.map((x,j) => x*=n.data[i][j]));
        }else{
            //scalar
            this.data = this.data.map((ar) =>ar.map((x) => x*=n));
        }

    }

    print(){
        console.table(this.data); //display matrix
    }

    map(fn){
        return this.data.map((r,i) => r.map((c,j) =>{
            let temp = this.data[i][j];
            this.data[i][j] = fn(temp); // mapping to a function
        }));
    }

    static arrayToMatrix(array){
        let result = new Matrix(array.length,1);
        for(let i = 0 ;i< array.length;i++){
            result.data[i][0] = array[i]; 
        } //convert array to matrix
        return result;
    }

    matrixToArray(){
        let result = [];
        result = this.data.map((r,i) =>r.map((c,j) => result[j] = this.data[i][j])); // convert matrix to array
        return result;
    }
    
    static multiply(n,m){
            if (n.cols !== m.rows) {
                console.log('Columns of data 1 must match rows of data 2.')
                return undefined;
              }else{
                  //matrix multiply
                let result = new Matrix(n.rows, m.cols);
                result.data.map((r,i) => r.map((c,j) => {
                    let sum = 0;
                    //dot product
                    for(let k = 0; k < n.cols; k++){
                        sum += n.data[i][k] * m.data[k][j];
                    }
                    return result.data[i][j] =sum;
                }))
                return result;
            }
    }
}
