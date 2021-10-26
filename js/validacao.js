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
        customError: 'O cpf digitado é inválido.'
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
    cpf:input => validaCPF(input)
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

    if(!checaCpfRepetido(cpfFormatado)) {
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