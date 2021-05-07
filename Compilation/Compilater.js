//verifie ligne avec juste un commentaire

class Compiler{


    static compile(brute_code){

        //----------------------------------------------------------------
        let lexicalOutput = (new LexicalAnalysis()).analyse(brute_code);

        let lexicalView = lexicalOutput.lexicalView;

        if (lexicalOutput.status == false) 
        {

            let errorLine = lexicalView.length-1,
                message = lexicalView[errorLine].message;

            return this.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------

        let prepResult = new PreProcessor(lexicalView).executePostLexical();

        let newLexical = prepResult.lexicalView;

        if (prepResult.status == false) 
        {

            let errorLine = prepResult.errorLine,
                message = prepResult.message;

            return this.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------
        

        let syntResult = new SyntaxAnalysis().analyse(newLexical);
        
        if (syntResult.good == false) 
        {

            let errorLine = syntResult.index,
                message = syntResult.message;

            return Compiler.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------
        let varArray = prepResult.varArray,
            labelArray = prepResult.labelArray,
            origin = prepResult.origin;
        
        let finalView = new Linkage(varArray, labelArray, origin).addressResolving(newLexical);

        let postLinkageState = PreProcessor.executePostLinkVerif(finalView);

        if (postLinkageState.good == false) 
        {

            let errorLine = postLinkageState.errorLine,
                message = postLinkageState.message;

            return this.manageErrors(errorLine, message);
        }


        return {
            status: true,
            message: '',
            errorLine: null,
            finalView: finalView,
            varArray: varArray,
            labelArray: labelArray
        }

        /*
            finalView => Array of object in the form of =>
            
            {
                executableLine: boolean, //this shall be set to false for NULL instrcution

                originalLine: str,
                resolvedLine: str,
                opcodes: int[],

                instructionSize: int,
                instructionAddr: int
            }
            
            varArry => Array of variablesObject
            
            variablesObject = {

                line : null,
                size: null, 
                varName: null, 
                addr: 0,
            }

        */
    }

    static manageErrors(errorLine, message){
        return {
            status: false,
            message: message,
            errorLine: errorLine,
            finalView: null,
            varArray: null,
            labelArray: null
        }
    }
}
