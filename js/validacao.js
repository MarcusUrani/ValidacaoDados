const dataNascimento = document.querySelector("[dataNascimento]");

dataNascimento.addEventListener('blur', (event) => {
    validaNascimento(event.target);
})

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
    const dataMaiorDe18 = new Date(data.getUTCFullYear() +18, data.getUTCMonth(), data.getUTCDate())

    return dataMaiorDe18 <= dataAtual;
}