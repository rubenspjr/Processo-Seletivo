
const $stepText = $('#step-text');
const $stepDescription = $('#step-description');
const $stepOne = $('.step.one');
const $stepTwo = $('.step.two');
const $stepThree = $('.step.three');
const $title = $('#title');

const $containerBtnFormThree = $('#containerBtnFormThree');
const $btnFormThree = $('#btnFormThree');

const $containerBtnFormTwo = $('#containerBtnFormTwo');
const $btnFormTwo = $('#btnFormTwo');
const $containerBtnFormOne = $('#containerBtnFormOne');
const $btnFormOne = $('#btnFormOne');


const $inputNome = $('#nome');
const $inputSobrenome = $('#sobrenome');
const $inputEmail = $('#email');
const $inputDataNascimento = $('#dataNascimento');
const $inputMinibio = $('#minibio');

const $inputEndereco = $('#endereco');
const $inputComplemento = $('#complemento');
const $inputCep = $('#cep');
const $inputCidade = $('#cidade');

const $inputHabilidades = $('#habilidades');
const $inputPontosFortes = $('#pontosFortes');

let nomeValido = false;
let sobrenomeValido = false;
let emailValido = false;
let dataNacimentoValido = false;
let minibioValido = false;
let enderecoValido = false;
let cidadeValida = false;
let cepValido = false;
let complementoValido = false;
let habilidadeDescription = false;
let pontosFortesDescription =false;

const cepRegex = /^([\d]{2})([\d]{3})([\d]{3})|^[\d]{2}.[\d]{3}-[\d]{3}/; 
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const minLengthText = 3;
const minLengthTextArea = 8;
//const maxLengthDescription = 100;


function validarInput(element, minLength, maxLength, regex) {
    const closest = $(element).closest('.input-data')
    if (!element.value
        || (minLength && element.value.trim().length < minLength)
        || (maxLength && element.value.trim().length > maxLength)
        || (regex && !element.value.toLowerCase().match(regex))
    ) {
        closest.addClass('error');
        return false;
    }
    closest.removeClass('error');
    return true;
};

function validaFormularioUm() {
    if (nomeValido && sobrenomeValido && dataNacimentoValido && emailValido) {
        $containerBtnFormOne.removeClass('disabled');
        $btnFormOne.removeClass('disabled');
        $btnFormOne.off('click').on('click', iniciarFormularioDois);
    } else {
        $containerBtnFormOne.addClass('disabled');
        $btnFormOne.addClass('disabled');
        $btnFormOne.off('click')
    }
}

function iniciarFormularioTres(){
    $stepText.text('Passo 3 de 3 - Fale um pouco mais sobre você!');
    $stepDescription.text('Descreva suas principais habilidades e seus pontos fortes');
    $stepTwo.hide();
    $stepThree.show();

    $inputHabilidades.keyup(function(){
        habilidadeDescription = validarInput(this, minLengthTextArea);
        validaFormularioTres()

    });

    $inputPontosFortes.keyup(function(){
        pontosFortesDescription = validarInput(this, minLengthTextArea);
        validaFormularioTres()
    });

};

function iniciarFormularioDois (){
    $stepText.text('Passo 2 de 3 - Dados de correspondência');
    $stepDescription.text('Precisamos desses dados para que possamos entrar em contato se necessário.');
    $stepOne.hide();
    $stepTwo.show();

    $inputEndereco.keyup(function (){
        enderecoValido = validarInput(this, minLengthText);
        validaFormularioDois();

    });
   
    $inputCidade.keyup(function (){
        cidadeValida = validarInput(this, minLengthTextArea);
        validaFormularioDois();

    });

    $inputCep.keyup(function (){
        this.value = this.value.replace(/\D/g, '');
        cepValido = validarInput(this, null, null, cepRegex);
        if(cepValido){
            this.value = this.value.replace(cepRegex,'$1$2-$3');
            
        };
        validaFormularioDois();
    });

    $inputComplemento.keyup(function(){
        validaFormularioDois();
    })
};

async function salvarNoTrello(){
    try {
        const nome = $inputNome.val();
        const sobrenome = $inputSobrenome.val();
        const email = $inputEmail.val();
        const dataNascimento = $inputDataNascimento.val();

        const minibio = $inputMinibio.val();
        const complemento = $inputComplemento.val();
        const endereco = $inputDataNascimento.val();
        const cidade = $inputCidade.val();
        const cep = $inputCep.val();

        const habilidade =$inputHabilidades.val();
        const pontosFortes =$inputPontosFortes.val();

        if(!nome || !sobrenome || !email || !dataNascimento  || !endereco  || !cidade
            || !cep || !habilidade || !pontosFortes){
                return alert('Favor preencher todos os dados obrigatórios para seguir.')
        }

        const body = {
            name:'Candidato - ' + nome + '' + sobrenome,
            desc:`
                Seguem dados do candidato(a):

                -------- Dados Pessoais ----------
                Nome: ${nome}
                Sobrenome : ${sobrenome}
                Email: ${email}
                Data de Nascimento ${dataNascimento}
                Minibio: ${minibio}

                -------- Dados de Endereço ----------
                Endereço: ${endereco}
                Complemento : ${complemento}
                Cep: ${cep}
                Cidade: ${cidade}

                -------- Dados do Canditato ----------
                Habilidades: ${habilidade}
                Pontos Fortes : ${pontosFortes}
                
            `
        }


        await fetch('https://api.trello.com/1/cards?idList=653a56c470895c00dd14fc37&key=85e5adc320147ffc22863343d6cf9e09&token=ATTA4561ebae04cdd72e8cd60e66319f9a7f7c17961cf5a8dcda1e9d243c41ba3b89C50EF6B3',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(body)
        });    

        return finalizarFormulario();
            
    } catch (error) {
        console.log('Ocorreu erro ao salvar no Trello:', error)
    }
}

function validaFormularioTres(){
    if(habilidadeDescription && pontosFortesDescription){
        $containerBtnFormThree.removeClass('disabled');
        $btnFormThree.removeClass('disabled');
        $btnFormThree.off('click').on('click',salvarNoTrello);
    }else{
        $containerBtnFormThree.addClass('disabled');
        $btnFormThree.addClass('disabled');
        $btnFormThree.off('click');
    }
}

function validaFormularioDois(){ 
    if(enderecoValido && cidadeValida && cepValido){
        $containerBtnFormTwo.removeClass('disabled');
        $btnFormTwo.removeClass('disabled');
        $btnFormTwo.off('click').on('click',iniciarFormularioTres)
    }else{
        $containerBtnFormTwo.addClass('disabled');
        $btnFormTwo.addClass('disabled');
    };
}

function finalizarFormulario(){
    $stepThree.hide();
    $stepDescription.hide();
    $title.text('Inscrição realizada com sucesso');
    $stepText.text ('Agradecemos a sua inscriçao, entraremos em contato assim que possível, nosso prazo de análise é de no maximo 5 dias úteis!')
}

function init() {
    $stepDescription.text('Descreva seus dados para que possamos te conhecer melhor');
    $stepText.text('Passo 1 de 3 - Dados Pessoais');
    $stepTwo.hide();
    $stepThree.hide();



    $inputNome.keyup(function () {
        nomeValido = validarInput(this, minLengthText);
        validaFormularioUm();

    });

    $inputSobrenome.keyup(function () {
        sobrenomeValido = validarInput(this, minLengthText);
        validaFormularioUm();

    });

    $inputDataNascimento.keyup(function () {
        dataNacimentoValido = validarInput(this, minLengthText);
        validaFormularioUm();
    });

    $inputDataNascimento.change(function () {
        dataNacimentoValido = validarInput(this, minLengthText);
        validaFormularioUm();
    });

    $inputEmail.keyup(function () {
        emailValido = validarInput(this, null, null, emailRegex);
        validaFormularioUm();

    });
    
   

    $inputDataNascimento.on('focus', function () {
        this.type = 'date';

    });

    $inputDataNascimento.on('blur', function () {
        if (!this.value) {
            this.type = 'text';
        }
    })

    $inputMinibio.keyup(function (){
        validaFormularioUm();
    })

    
}

init();