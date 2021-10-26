export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input);
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input);
    }
}

const erros = {
    nome: {
        valueMissing: 'O nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'A senha não pode estar vazia.',
        patternMismatch: 'A senha deve conter entre 6 e 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter números.'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior de 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado é inválido.'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado é inválido.',
        customError: 'Não foi possível buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo estado não pode estar vazio.'
    },
    preco: {
        valueMissing: 'O campo de preço não pode estar vazio.'
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const validadores = {
    dataNascimento:input => validaNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperaCep(input)
}

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = '';
    tiposDeErro.forEach(erro =>{
        if(input.validity[erro]) {
            mensagem = erros[tipoDeInput][erro];
        }
    })

    return mensagem;
}

function validaNascimento(input) {
    const dataRecebida = new Date(input.value);
    let mensagem = '';
    if(!verificaIdade(dataRecebida)) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar'
    }

    input.setCustomValidity(mensagem);
}

function verificaIdade(data) {
    const dataAtual = new Date();
    const dataMaiorDe18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMaiorDe18 <= dataAtual;
}

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '');
    let mensagem = '';

    if(!checaCpfRepetido(cpfFormatado) || !cpfValido(cpfFormatado)) {
        mensagem = 'O cpf digitado é inválido.'
    }

    input.setCustomValidity(mensagem);
}

function checaCpfRepetido(cpf) {
    const valoresRepetidos = [
        '0000000000',
        '1111111111',
        '2222222222',
        '3333333333',
        '4444444444',
        '5555555555',
        '6666666666',
        '7777777777',
        '8888888888',
        '9999999999'
    ]

    let cpfValido = true; 

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false;
        }
    })

    return cpfValido;
}

function cpfValido(cpf) {
    let soma1 = 0;
    for(let i = 0; i < cpf.length - 2; i++) {
        soma1 += (10 - i) * cpf[i]; 
    }

    let soma2 = 0;
    for(let i = 0; i < cpf.length - 1; i++) {
        soma2 += (11 - i) * cpf[i]; 
    }

    const digVerificadorCalculado1 = 11 - (soma1 % 11);
    const digVerificadorCalculado2 = 11 - (soma2 % 11);
    const digVerificadorCPF1 = cpf.slice(9,10);
    const digVerificadorCPF2 = cpf.slice(10,11);


    return digVerificadorCalculado1 == digVerificadorCPF1 && digVerificadorCalculado2 == digVerificadorCPF2;
}

function recuperaCep(input) {
    const cep = input.value.replace(/\D/g,'');
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type' : 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response = response.json()
            ).then(
                data => {
                    if(data.erro) {
                        input.setCustomValidity('Não foi possível buscar o CEP.');
                        return;
                    }
                    input.setCustomValidity('');
                    preencheCamposEndereco(data);
                })
    }
}

function preencheCamposEndereco(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]');
    const cidade = document.querySelector('[data-tipo="cidade"]');
    const estado = document.querySelector('[data-tipo="estado"]');

    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
}